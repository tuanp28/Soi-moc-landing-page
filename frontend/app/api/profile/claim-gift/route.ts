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
    const { milestone, simulatedCreatedAt } = body;

    if (!milestone || !['1_month', '6_months', '1_year'].includes(milestone)) {
      return NextResponse.json({ success: false, error: 'Mốc kỷ niệm không hợp lệ.' }, { status: 400 });
    }

    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
    });

    if (!profile) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy hồ sơ người dùng.' }, { status: 404 });
    }

    // Check if already claimed
    const claimedList = profile.claimedGifts ? profile.claimedGifts.split(',').map(s => s.trim()) : [];
    if (claimedList.includes(milestone)) {
      return NextResponse.json({ success: false, error: 'Bạn đã nhận phần quà kỷ niệm này rồi.' }, { status: 400 });
    }

    // Validate eligibility
    // Use simulated createdAt in non-production environments to make testing easier
    const effectiveCreatedAt = (process.env.NODE_ENV !== 'production' && simulatedCreatedAt)
      ? new Date(simulatedCreatedAt)
      : new Date(profile.createdAt);

    const now = new Date();
    const diffTime = Math.abs(now.getTime() - effectiveCreatedAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let isEligible = false;
    if (milestone === '1_month' && diffDays >= 30) {
      isEligible = true;
    } else if (milestone === '6_months' && diffDays >= 180) {
      isEligible = true;
    } else if (milestone === '1_year' && diffDays >= 365) {
      isEligible = true;
    }

    if (!isEligible) {
      return NextResponse.json({ success: false, error: 'Tài khoản chưa đủ thời gian tham gia mốc này.' }, { status: 400 });
    }

    // Determine rewards
    let voucherCode = '';
    let giftDescription = '';

    if (milestone === '1_month') {
      voucherCode = 'SM1MONTH';
      giftDescription = 'Voucher giảm giá 20.000đ khi đặt hàng';
    } else if (milestone === '6_months') {
      voucherCode = 'SM6MONTHS';
      giftDescription = 'Voucher giảm giá 50.000đ khi đặt hàng';
    } else if (milestone === '1_year') {
      const level = profile.vipLevel;
      if (level === 'diamond') {
        voucherCode = 'SM1YEAR_DIAMOND';
        giftDescription = 'Bộ Hộp Quà Tặng Cao Cấp Diamond Edition + Voucher 300.000đ';
      } else if (level === 'gold') {
        voucherCode = 'SM1YEAR_GOLD';
        giftDescription = 'Hộp Quà Đặc Biệt Gold Edition + Voucher 200.000đ';
      } else if (level === 'silver') {
        voucherCode = 'SM1YEAR_SILVER';
        giftDescription = 'Bộ Quà Bạc Silver Edition + Voucher 100.000đ';
      } else {
        voucherCode = 'SM1YEAR';
        giftDescription = 'Voucher 100.000đ chúc mừng thành viên';
      }
    }

    // Save claim status
    const updatedClaimedGifts = profile.claimedGifts
      ? `${profile.claimedGifts},${milestone}`
      : milestone;

    await prisma.profile.update({
      where: { id: user.id },
      data: {
        claimedGifts: updatedClaimedGifts,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Nhận quà thành công!',
      voucherCode,
      giftDescription,
    });
  } catch (error) {
    console.error('Error claiming anniversary gift:', error);
    return NextResponse.json({ success: false, error: 'Lỗi hệ thống khi nhận quà.' }, { status: 500 });
  }
}
