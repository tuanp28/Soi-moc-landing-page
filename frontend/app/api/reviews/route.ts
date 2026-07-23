import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import prisma from '@/src/lib/prisma';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wanuvqejxogotqrxmdck.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_bYvknsun39Hg3d4xYQKSVA_7-IiLCCb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    const reviews = await prisma.review.findMany({
      where: productId ? { productId } : {},
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ success: false, error: 'Lỗi khi lấy dữ liệu đánh giá.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'Đăng nhập để đánh giá.' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];

    const supabaseServer = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    });

    const { data: { user }, error } = await supabaseServer.auth.getUser(token);
    if (error || !user) {
      return NextResponse.json({ success: false, error: 'Phiên đăng nhập không hợp lệ.' }, { status: 401 });
    }

    const body = await request.json();
    const { text, rating, location, productId, images } = body;

    if (!text || typeof text !== 'string' || text.trim() === '') {
      return NextResponse.json({ success: false, error: 'Nội dung đánh giá không được để trống.' }, { status: 400 });
    }

    const ratingVal = parseInt(rating);
    if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
      return NextResponse.json({ success: false, error: 'Điểm đánh giá phải từ 1 đến 5 sao.' }, { status: 400 });
    }

    const cleanLocation = location && typeof location === 'string' && location.trim() !== '' ? location.trim() : 'Việt Nam';

    // Fetch user profile to get their fullName
    const profile = await prisma.profile.findUnique({
      where: { id: user.id }
    });

    const name = profile?.fullName || user.user_metadata?.full_name || 'Khách hàng Sợi Mộc';
    const imagesJson = images && Array.isArray(images) ? JSON.stringify(images) : '[]';

    // Create the review
    const review = await prisma.review.create({
      data: {
        name,
        location: cleanLocation,
        text: text.trim(),
        rating: ratingVal,
        userId: user.id,
        productId: productId || null,
        imagesJson
      }
    });

    return NextResponse.json({ success: true, message: 'Đánh giá đã được gửi thành công!', data: review });
  } catch (error: any) {
    console.error('Error creating review:', error);
    return NextResponse.json({ success: false, error: 'Lỗi hệ thống khi lưu đánh giá.' }, { status: 500 });
  }
}
