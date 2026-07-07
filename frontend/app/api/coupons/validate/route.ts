import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import prisma from '@/src/lib/prisma';
import { getDbProducts } from '@/app/data/productsDb';
import { checkRateLimit, recordFailedAttempt } from '@/src/lib/rateLimit';
import { z } from 'zod';

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

// Zod Schema for validation
const cartItemSchema = z.object({
  productId: z.string(),
  selectedWeight: z.string(),
  quantity: z.number().int().positive(),
});

const validateBodySchema = z.object({
  code: z.string().min(1, 'Vui lòng nhập mã giảm giá.'),
  cartItems: z.array(cartItemSchema),
});

export async function POST(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';
  let rateLimitKey = `ip-${ip}`;
  
  try {
    const user = await getAuthenticatedUser(request);
    if (user) {
      rateLimitKey = `user-${user.id}`;
    }

    // 1. Check Rate Limit
    const { allowed } = checkRateLimit(rateLimitKey);
    if (!allowed) {
      return NextResponse.json({
        success: false,
        error: 'Bạn đã thử nhập mã sai quá nhiều lần. Vui lòng thử lại sau 1 phút.'
      }, { status: 429 });
    }

    const json = await request.json();
    const parsed = validateBodySchema.safeParse(json);
    
    if (!parsed.success) {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json({
        success: false,
        error: parsed.error.issues[0].message || 'Dữ liệu đầu vào không hợp lệ.'
      }, { status: 400 });
    }

    const { code, cartItems } = parsed.data;
    const normalizedCode = code.trim().toUpperCase();

    // 2. Validate Cart and Recalculate original total server-side
    const products = await getDbProducts();
    let computedTotal = 0;
    for (const item of cartItems) {
      const prod = products.find((p) => p.id === item.productId);
      if (!prod) {
        recordFailedAttempt(rateLimitKey);
        return NextResponse.json({ success: false, error: `Sản phẩm ${item.productId} không hợp lệ.` }, { status: 400 });
      }
      const sizeInfo = prod.sizes.find((s) => s.weight === item.selectedWeight);
      if (!sizeInfo) {
        recordFailedAttempt(rateLimitKey);
        return NextResponse.json({ success: false, error: `Kích cỡ ${item.selectedWeight} không hợp lệ.` }, { status: 400 });
      }
      computedTotal += sizeInfo.price * item.quantity;
    }

    // 3. Fetch Coupon details
    const coupon = await prisma.coupon.findUnique({
      where: { code: normalizedCode },
    });

    if (!coupon) {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json({ success: false, error: 'Mã giảm giá không tồn tại.' }, { status: 404 });
    }

    // Check if the coupon is active
    if (!coupon.isActive) {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json({ success: false, error: 'Mã giảm giá đã bị vô hiệu hóa.' }, { status: 400 });
    }

    // Check date validity
    const now = new Date();
    if (now < coupon.startDate) {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json({ success: false, error: 'Mã giảm giá chưa đến thời gian áp dụng.' }, { status: 400 });
    }
    if (now > coupon.expiryDate) {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json({ success: false, error: 'Mã giảm giá đã hết hạn sử dụng.' }, { status: 400 });
    }

    // Check usage limit
    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json({ success: false, error: 'Mã giảm giá đã hết lượt sử dụng.' }, { status: 400 });
    }

    // Check limit per user
    if (coupon.limitPerUser !== null) {
      if (!user) {
        return NextResponse.json({
          success: false,
          error: 'Mã giảm giá này yêu cầu đăng nhập tài khoản để sử dụng.',
        }, { status: 401 });
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
          error: `Mã giảm giá này giới hạn ${coupon.limitPerUser} lần sử dụng cho mỗi thành viên (Bạn đã dùng rồi).`,
        }, { status: 400 });
      }
    }

    // Check minimum order value
    if (computedTotal < coupon.minOrderValue) {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json({
        success: false,
        error: `Đơn hàng chưa đạt giá trị tối thiểu từ ${coupon.minOrderValue.toLocaleString('vi-VN')}đ để áp dụng mã này.`,
      }, { status: 400 });
    }

    // 4. Calculate discount amount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (computedTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount !== null && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else if (coupon.discountType === 'fixed') {
      discountAmount = coupon.discountValue;
    }

    // Cap discount to prevent negative amount
    if (discountAmount > computedTotal) {
      discountAmount = computedTotal;
    }

    const newTotal = Math.max(0, computedTotal - discountAmount);

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderValue: coupon.minOrderValue,
      },
      discountAmount,
      newTotal,
    });
  } catch (error: any) {
    console.error('Error validating coupon:', error);
    return NextResponse.json({ success: false, error: 'Lỗi hệ thống khi kiểm tra mã giảm giá.' }, { status: 500 });
  }
}
