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

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    
    // Fetch active coupons
    const coupons = await prisma.coupon.findMany({
      where: {
        isActive: true,
        expiryDate: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // If user is authenticated, check their usage for each coupon
    let couponsWithUsage = coupons;
    if (user) {
      const usages = await prisma.couponUsage.findMany({
        where: {
          userId: user.id,
        },
      });

      const usedCouponIds = new Set(usages.map((u) => u.couponId));

      couponsWithUsage = coupons.map((coupon) => ({
        ...coupon,
        isUsed: usedCouponIds.has(coupon.id),
      })) as any;
    }

    return NextResponse.json({ success: true, coupons: couponsWithUsage });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json({ success: false, error: 'Lỗi hệ thống khi lấy mã giảm giá.' }, { status: 500 });
  }
}
