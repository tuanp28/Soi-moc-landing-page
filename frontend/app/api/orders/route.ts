import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import prisma from '@/src/lib/prisma';
import { getDbProducts } from '@/app/data/productsDb';
import { checkRateLimit, recordFailedAttempt } from '@/src/lib/rateLimit';
import { z } from 'zod';
import { sendOrderNotification } from '@/src/lib/notifications';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wanuvqejxogotqrxmdck.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_bYvknsun39Hg3d4xYQKSVA_7-IiLCCb';

async function getAuthenticatedUser(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  try {
    const supabaseServer = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    });
    const { data: { user } } = await supabaseServer.auth.getUser(token);
    return user;
  } catch {
    return null;
  }
}

// Zod schema for input validation
const cartItemSchema = z.object({
  productId: z.string(),
  selectedWeight: z.string(),
  quantity: z.number().int().positive(),
});

const orderPOSTBodySchema = z.object({
  customerName: z.string().min(1, 'Họ và tên không được để trống.'),
  customerPhone: z.string().min(1, 'Số điện thoại không được để trống.'),
  customerAddress: z.string().min(1, 'Địa chỉ không được để trống.'),
  customerNote: z.string().nullable().optional(),
  totalAmount: z.number(),
  cartItems: z.array(cartItemSchema).min(1, 'Giỏ hàng của bạn đang trống.'),
  couponCode: z.string().nullable().optional(),
  province: z.string().nullable().optional(),
  paymentMethod: z.string().optional().default('COD'),
});

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Chưa đăng nhập.' }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
    });

    const isStaff = profile && ['staff', 'manager', 'admin'].includes(profile.role);

    let orders;
    if (isStaff) {
      orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } else {
      orders = await prisma.order.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    // Convert keys to camelCase or map to match what the frontend expects
    const formattedOrders = orders.map((o) => {
      let parsedItems = [];
      try {
        parsedItems = JSON.parse(o.itemsJson);
      } catch (e) {
        console.error('Failed to parse itemsJson for order:', o.id, e);
      }
      return {
        id: o.id,
        customer_name: o.customerName,
        customer_phone: o.customerPhone,
        customer_address: o.customerAddress,
        customer_note: o.customerNote,
        payment_method: o.paymentMethod,
        payment_status: o.paymentStatus,
        order_status: o.orderStatus,
        total_amount: o.totalAmount,
        items: parsedItems,
        created_at: o.createdAt.toISOString(),
      };
    });

    return NextResponse.json({ success: true, orders: formattedOrders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ success: false, error: 'Lỗi hệ thống khi lấy đơn hàng.' }, { status: 500 });
  }
}

async function getShippingFeeForProvince(provinceName: string | null | undefined): Promise<{ shippingFee: number; estimatedDays: string }> {
  if (!provinceName) {
    return { shippingFee: 40000, estimatedDays: '3-5 ngày' };
  }
  
  let searchName = provinceName;
  if (provinceName.includes('Thạch Thất')) {
    searchName = 'Thạch Thất';
  } else if (provinceName.includes('Quốc Oai')) {
    searchName = 'Quốc Oai';
  } else if (provinceName.includes('Hà Nội')) {
    searchName = 'Hà Nội';
  } else if (provinceName.includes('TP Hồ Chí Minh')) {
    searchName = 'TP Hồ Chí Minh';
  } else if (provinceName.includes('Đà Nẵng')) {
    searchName = 'Đà Nẵng';
  }

  try {
    const rate = await prisma.shippingRate.findUnique({
      where: { provinceName: searchName }
    });
    if (rate) {
      return { shippingFee: rate.shippingFee, estimatedDays: rate.estimatedDays };
    }
    const fallbackRate = await prisma.shippingRate.findUnique({
      where: { provinceName: 'Các tỉnh khác' }
    });
    if (fallbackRate) {
      return { shippingFee: fallbackRate.shippingFee, estimatedDays: fallbackRate.estimatedDays };
    }
  } catch (err) {
    console.error('Error fetching shipping rate:', err);
  }
  if (searchName === 'Thạch Thất' || searchName === 'Quốc Oai') {
    return { shippingFee: 0, estimatedDays: 'Trong ngày' };
  }
  if (searchName === 'Hà Nội') {
    return { shippingFee: 20000, estimatedDays: '1-2 ngày' };
  }
  if (searchName === 'TP Hồ Chí Minh' || searchName === 'Đà Nẵng') {
    return { shippingFee: 35000, estimatedDays: '3-4 ngày' };
  }
  return { shippingFee: 40000, estimatedDays: '3-5 ngày' };
}

export async function POST(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';
  let rateLimitKey = `ip-${ip}`;
  let couponCodeSent: string | null = null;

  try {
    const user = await getAuthenticatedUser(request);
    if (user) {
      rateLimitKey = `user-${user.id}`;
    }

    const json = await request.json();
    const parsed = orderPOSTBodySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({
        success: false,
        error: parsed.error.issues[0].message || 'Thông tin đơn hàng không hợp lệ.'
      }, { status: 400 });
    }

    const { customerName, customerPhone, customerAddress, customerNote, cartItems, couponCode, province, paymentMethod } = parsed.data;
    couponCodeSent = couponCode || null;

    const cleanPhone = customerPhone.replace(/[\s().-]/g, '');
    if (!/^(0|84|\+84)[35789][0-9]{8}$|^(0|84|\+84)2[0-9]{9}$/.test(cleanPhone)) {
      return NextResponse.json({ success: false, error: 'Số điện thoại không hợp lệ (ví dụ: 0912 345 678).' }, { status: 400 });
    }

    // Recalculate original total on the server to prevent F12 price tampering
    const products = await getDbProducts();
    let computedTotal = 0;
    let totalWeight = 0;
    const resolvedItems: any[] = [];
    for (const item of cartItems) {
      const prod = products.find((p) => p.id === item.productId);
      if (!prod) {
        return NextResponse.json({ success: false, error: `Sản phẩm ${item.productId} không hợp lệ.` }, { status: 400 });
      }
      const sizeInfo = prod.sizes.find((s) => s.weight === item.selectedWeight);
      if (!sizeInfo) {
        return NextResponse.json({ success: false, error: `Kích cỡ ${item.selectedWeight} không hợp lệ.` }, { status: 400 });
      }
      computedTotal += sizeInfo.price * item.quantity;
      resolvedItems.push({
        productId: item.productId,
        name: prod.name,
        selectedWeight: item.selectedWeight,
        quantity: item.quantity,
        price: sizeInfo.price,
      });

      // Parse weight for shipping calculation
      const weightStr = item.selectedWeight.toLowerCase();
      let weightValue = 0;
      if (weightStr.endsWith('kg')) {
        weightValue = parseFloat(weightStr.replace('kg', ''));
      } else if (weightStr.endsWith('g')) {
        weightValue = parseFloat(weightStr.replace('g', '')) / 1000;
      }
      totalWeight += weightValue * item.quantity;
    }

    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    // Auto-apply "Mua 5 Tặng 1" gift item (Bún Ngô Premium 500g)
    if (totalQuantity >= 5) {
      resolvedItems.push({
        productId: 'bun-ngo-premium',
        name: 'BÚN NGÔ KHÔ PREMIUM (QUÀ TẶNG MUA 5 TẶNG 1)',
        selectedWeight: '500g',
        quantity: 1,
        price: 0,
      });
    }

    // Validate and apply coupon atomically to prevent concurrency race conditions
    let discount = 0;
    let appliedCoupon = null;

    if (couponCode && typeof couponCode === 'string' && couponCode.trim() !== '') {
      const normalizedCode = couponCode.trim().toUpperCase();

      // Check Rate Limit for Coupon submissions
      const { allowed } = checkRateLimit(rateLimitKey);
      if (!allowed) {
        return NextResponse.json({
          success: false,
          error: 'Bạn đã thử nhập mã sai quá nhiều lần. Vui lòng thử lại sau 1 phút.'
        }, { status: 429 });
      }

      // Fetch the coupon details first to check user limits
      const coupon = await prisma.coupon.findUnique({
        where: { code: normalizedCode },
      });

      if (!coupon) {
        recordFailedAttempt(rateLimitKey);
        return NextResponse.json({ success: false, error: 'Mã giảm giá không tồn tại.' }, { status: 404 });
      }

      if (!coupon.isActive) {
        recordFailedAttempt(rateLimitKey);
        return NextResponse.json({ success: false, error: 'Mã giảm giá đã bị vô hiệu hóa.' }, { status: 400 });
      }

      const now = new Date();
      if (now < coupon.startDate || now > coupon.expiryDate) {
        recordFailedAttempt(rateLimitKey);
        return NextResponse.json({ success: false, error: 'Mã giảm giá đã hết hạn hoặc chưa đến thời gian áp dụng.' }, { status: 400 });
      }

      if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
        recordFailedAttempt(rateLimitKey);
        return NextResponse.json({ success: false, error: 'Mã giảm giá đã hết lượt sử dụng trên hệ thống.' }, { status: 400 });
      }

      if (coupon.limitPerUser !== null) {
        if (!user) {
          return NextResponse.json({ success: false, error: 'Mã giảm giá này yêu cầu đăng nhập tài khoản để sử dụng.' }, { status: 401 });
        }

        const usageCount = await prisma.couponUsage.count({
          where: {
            couponId: coupon.id,
            userId: user.id,
          },
        });

        if (usageCount >= coupon.limitPerUser) {
          recordFailedAttempt(rateLimitKey);
          return NextResponse.json({
            success: false,
            error: `Mã giảm giá này chỉ được sử dụng tối đa ${coupon.limitPerUser} lần mỗi thành viên.`,
          }, { status: 400 });
        }
      }

      if (computedTotal < coupon.minOrderValue) {
        recordFailedAttempt(rateLimitKey);
        return NextResponse.json({
          success: false,
          error: `Đơn hàng chưa đạt giá trị tối thiểu ${coupon.minOrderValue.toLocaleString('vi-VN')}đ để sử dụng mã này.`,
        }, { status: 400 });
      }

      appliedCoupon = coupon;
    }

    // Generate random 6 digit code for Order ID
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    const orderId = `SM-${randomCode}`;

    // Get shipping fee based on selected province
    const { shippingFee: baseShippingFee } = await getShippingFeeForProvince(province);

    // Free shipping criteria:
    // 1. Coupon applied is a free shipping coupon
    // 2. Order items subtotal >= 500k
    // 3. Total weight >= 5kg
    const isFreeShipping = (appliedCoupon && (appliedCoupon.code.toUpperCase().includes('FREESHIP') || appliedCoupon.discountType === 'free_shipping')) ||
                           computedTotal >= 500000 ||
                           totalWeight >= 5;

    const finalShippingFee = isFreeShipping ? 0 : baseShippingFee;

    // Process Transaction: Order creation + atomic coupon update + coupon usage log
    const order = await prisma.$transaction(async (tx) => {
      if (appliedCoupon && appliedCoupon.discountType !== 'free_shipping') {
        // Calculate discount
        if (appliedCoupon.discountType === 'percentage') {
          discount = (computedTotal * appliedCoupon.discountValue) / 100;
          if (appliedCoupon.maxDiscountAmount !== null && discount > appliedCoupon.maxDiscountAmount) {
            discount = appliedCoupon.maxDiscountAmount;
          }
        } else if (appliedCoupon.discountType === 'fixed') {
          discount = appliedCoupon.discountValue;
        }

        if (discount > computedTotal) {
          discount = computedTotal;
        }
      }

      let comboDiscount = 0;
      if (totalQuantity >= 3) {
        comboDiscount = Math.round(computedTotal * 0.05); // 5% discount for combo 3+ products
      }

      // Guarantee invoice amount is never negative
      const finalAmount = Math.max(0, computedTotal - comboDiscount - discount + finalShippingFee);

      // Create order first so that coupon_usages can reference it
      const newOrder = await tx.order.create({
        data: {
          id: orderId,
          customerName: customerName.trim(),
          customerPhone: cleanPhone,
          customerAddress: province ? `${customerAddress.trim()}, ${province}` : customerAddress.trim(),
          customerNote: customerNote ? customerNote.trim() : null,
          paymentMethod: paymentMethod || 'COD',
          paymentStatus: 'pending',
          orderStatus: 'waiting_confirm',
          totalAmount: finalAmount,
          userId: user ? user.id : null,
          itemsJson: JSON.stringify(resolvedItems),
        },
      });

      if (appliedCoupon) {
        // Concurrency-safe atomic check and update
        const updatedRows = await tx.$executeRaw`
          UPDATE coupons 
          SET used_count = used_count + 1 
          WHERE code = ${appliedCoupon.code} 
            AND is_active = true 
            AND start_date <= NOW() 
            AND expiry_date >= NOW() 
            AND (usage_limit IS NULL OR used_count < usage_limit)
            AND ${computedTotal} >= min_order_value
        `;

        if (updatedRows === 0) {
          throw new Error('Mã giảm giá không hợp lệ, đơn hàng chưa đạt giá trị tối thiểu hoặc mã đã hết lượt sử dụng.');
        }

        // Save coupon usage log
        if (user) {
          const usageId = `usage-${Math.random().toString(36).substring(2, 9)}`;
          await tx.$executeRaw`
            INSERT INTO coupon_usages (id, coupon_id, user_id, order_id, used_at)
            VALUES (${usageId}, ${appliedCoupon.id}, ${user.id}, ${orderId}, NOW())
          `;
        }
      }

      return newOrder;
    });

    // Create initial history log
    await prisma.orderStatusHistory.create({
      data: {
        orderId: order.id,
        status: 'waiting_confirm',
        changedBy: 'Khách hàng',
        note: 'Đơn hàng mới đã được khởi tạo thành công.'
      }
    });

    // Send email notification asynchronously
    sendOrderNotification(order.id, 'order_created');

    return NextResponse.json({
      success: true,
      message: 'Đặt hàng thành công!',
      order: {
        id: order.id,
        customer_name: order.customerName,
        customer_phone: order.customerPhone,
        customer_address: order.customerAddress,
        customer_note: order.customerNote,
        payment_method: order.paymentMethod,
        payment_status: order.paymentStatus,
        order_status: order.orderStatus,
        total_amount: order.totalAmount,
        created_at: order.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    if (couponCodeSent && couponCodeSent.trim() !== '') {
      recordFailedAttempt(rateLimitKey);
    }
    return NextResponse.json({ success: false, error: error.message || 'Lỗi hệ thống khi tạo đơn hàng.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Chưa đăng nhập.' }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
    });

    const body = await request.json();
    const { orderId, field, status } = body;

    if (!orderId || !field || !status) {
      return NextResponse.json({ success: false, error: 'Thiếu tham số cập nhật.' }, { status: 400 });
    }

    if (field !== 'order_status' && field !== 'payment_status') {
      return NextResponse.json({ success: false, error: 'Trường cập nhật không hợp lệ.' }, { status: 400 });
    }

    // Fetch the existing order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: 'Đơn hàng không tồn tại.' }, { status: 404 });
    }

    const isStaff = profile && ['staff', 'manager', 'admin'].includes(profile.role);
    const isOwner = order.userId === user.id;

    if (!isStaff && !isOwner) {
      return NextResponse.json({ success: false, error: 'Không có quyền truy cập.' }, { status: 403 });
    }

    if (!isStaff) {
      // Customer can only cancel their own order, and only if it's waiting_confirm
      if (field !== 'order_status' || status !== 'cancelled') {
        return NextResponse.json({ success: false, error: 'Bạn chỉ có quyền hủy đơn hàng.' }, { status: 400 });
      }
      if (order.orderStatus !== 'waiting_confirm') {
        return NextResponse.json({ success: false, error: 'Không thể hủy đơn hàng đã xác nhận hoặc đang vận chuyển.' }, { status: 400 });
      }
    }

    // Map frontend field to Prisma model key
    const prismaField = field === 'order_status' ? 'orderStatus' : 'paymentStatus';

    // Process update in a transaction to safely update status and revert coupon usages
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Reverting coupon usage if cancelled
      if (field === 'order_status' && status === 'cancelled' && order.orderStatus !== 'cancelled') {
        const couponUsage = await tx.couponUsage.findFirst({
          where: { orderId: orderId },
        });

        if (couponUsage) {
          const coupon = await tx.coupon.findUnique({
            where: { id: couponUsage.couponId },
          });

          if (coupon) {
            await tx.coupon.update({
              where: { id: coupon.id },
              data: {
                usedCount: Math.max(0, coupon.usedCount - 1),
              },
            });
          }

          await tx.couponUsage.delete({
            where: { id: couponUsage.id },
          });
        }
      }

      // 3. Write status history log
      const actorName = profile ? `${profile.fullName} (${profile.role === 'admin' ? 'Admin' : profile.role === 'staff' ? 'Nhân viên' : 'Quản lý'})` : 'Khách hàng';
      const noteText = field === 'order_status' 
        ? `Trạng thái đơn hàng chuyển sang: ${status}`
        : `Trạng thái thanh toán chuyển sang: ${status}`;

      await tx.orderStatusHistory.create({
        data: {
          orderId: orderId,
          status: status,
          changedBy: actorName,
          note: noteText
        }
      });

      // 4. Award points to user if order is completed
      if (field === 'order_status' && status === 'completed' && order.orderStatus !== 'completed') {
        if (order.userId) {
          const pointsGained = Math.floor(order.totalAmount / 1000); // 1,000đ = 1 point
          await tx.profile.update({
            where: { id: order.userId },
            data: {
              points: { increment: pointsGained }
            }
          });
        }
      }

      // 5. Write audit log for staff/manager/admin
      if (profile && ['staff', 'manager', 'admin'].includes(profile.role)) {
        await tx.auditLog.create({
          data: {
            userId: profile.id,
            userEmail: profile.email,
            action: field === 'order_status' ? 'UPDATE_ORDER_STATUS' : 'UPDATE_ORDER_PAYMENT',
            details: JSON.stringify({ orderId, status }),
            ipAddress: ip
          }
        });
      }

      return await tx.order.update({
        where: { id: orderId },
        data: {
          [prismaField]: status,
        },
      });
    });

    // Trigger status update email notifications asynchronously
    if (field === 'order_status' && status === 'shipping') {
      sendOrderNotification(orderId, 'order_shipped');
    } else if (field === 'payment_status' && status === 'paid') {
      sendOrderNotification(orderId, 'payment_paid');
    }

    return NextResponse.json({
      success: true,
      message: 'Cập nhật đơn hàng thành công!',
      order: {
        id: updatedOrder.id,
        customer_name: updatedOrder.customerName,
        customer_phone: updatedOrder.customerPhone,
        customer_address: updatedOrder.customerAddress,
        customer_note: updatedOrder.customerNote,
        payment_method: updatedOrder.paymentMethod,
        payment_status: updatedOrder.paymentStatus,
        order_status: updatedOrder.orderStatus,
        total_amount: updatedOrder.totalAmount,
        created_at: updatedOrder.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ success: false, error: 'Lỗi hệ thống khi cập nhật đơn hàng.' }, { status: 500 });
  }
}
