import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import prisma from '@/src/lib/prisma';

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

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Chưa đăng nhập.' }, { status: 401 });
    }

    const body = await request.json();
    const { option } = body; // 150 | 300 | 500 points

    if (![150, 300, 500].includes(option)) {
      return NextResponse.json({ success: false, error: 'Mức đổi quà không hợp lệ.' }, { status: 400 });
    }

    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
    });

    if (!profile) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy hồ sơ người dùng.' }, { status: 404 });
    }

    if (profile.points < option) {
      return NextResponse.json({ success: false, error: 'Bạn không đủ điểm thưởng để thực hiện quy đổi này.' }, { status: 400 });
    }

    // Determine voucher details
    let discountValue = 0;
    if (option === 150) {
      discountValue = 15000;
    } else if (option === 300) {
      discountValue = 35000;
    } else if (option === 500) {
      discountValue = 60000;
    }

    // Generate a unique random voucher code
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const couponCode = `SM-RED-${option}-${randomSuffix}`;

    // Execute atomic transaction: deduct points & create coupon
    const coupon = await prisma.$transaction(async (tx) => {
      // 1. Deduct points
      await tx.profile.update({
        where: { id: user.id },
        data: {
          points: { decrement: option }
        }
      });

      // 2. Create coupon
      return tx.coupon.create({
        data: {
          code: couponCode,
          discountType: 'fixed',
          discountValue: discountValue,
          minOrderValue: 0,
          maxDiscountAmount: discountValue,
          usageLimit: 1,
          limitPerUser: 1,
          startDate: new Date(),
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // valid for 30 days
          isActive: true
        }
      });
    });

    return NextResponse.json({
      success: true,
      message: `Đổi quà thành công! Bạn nhận được Voucher ${discountValue.toLocaleString('vi-VN')}đ`,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderValue: coupon.minOrderValue,
        expiryDate: coupon.expiryDate
      }
    });

  } catch (error: any) {
    console.error('Error redeeming points:', error);
    return NextResponse.json({ success: false, error: 'Lỗi hệ thống khi quy đổi điểm thưởng.' }, { status: 500 });
  }
}
