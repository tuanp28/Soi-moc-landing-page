import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import prisma from '@/src/lib/prisma';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wanuvqejxogotqrxmdck.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_bYvknsun39Hg3d4xYQKSVA_7-IiLCCb';

async function verifyAdmin(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized: Missing token');
  }
  const token = authHeader.split(' ')[1];

  const supabaseServer = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false }
  });

  const { data: { user }, error } = await supabaseServer.auth.getUser(token);
  if (error || !user) {
    throw new Error('Unauthorized: Invalid token');
  }

  const adminProfile = await prisma.profile.findUnique({
    where: { id: user.id }
  });

  if (!adminProfile || adminProfile.role !== 'admin' || adminProfile.email !== 'tuanphamabcxyz123@gmail.com') {
    throw new Error('Forbidden: Admin access required');
  }

  return user;
}

export async function GET(request: Request) {
  try {
    // Authenticate admin first.
    // Note: If calling directly from browser link, the token can be passed in search params for convenience.
    const { searchParams } = new URL(request.url);
    const paramToken = searchParams.get('token');
    
    if (paramToken) {
      const supabaseServer = createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false }
      });
      const { data: { user }, error } = await supabaseServer.auth.getUser(paramToken);
      if (error || !user) {
        return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
      }
      const adminProfile = await prisma.profile.findUnique({
        where: { id: user.id }
      });
      if (!adminProfile || adminProfile.role !== 'admin' || adminProfile.email !== 'tuanphamabcxyz123@gmail.com') {
        return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
      }
    } else {
      await verifyAdmin(request);
    }

    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const headers = [
      "Mã Đơn Hàng",
      "Tên Khách Hàng",
      "Số Điện Thoại",
      "Địa Chỉ Giao Hàng",
      "Ghi Chú",
      "Phương Thức Thanh Toán",
      "Trạng Thái Thanh Toán",
      "Trạng Thái Đơn Hàng",
      "Tổng Tiền (VNĐ)",
      "Ngày Tạo Đơn"
    ].join(",");

    const rows = orders.map((o) => {
      return [
        o.id,
        o.customerName.replace(/"/g, '""'),
        o.customerPhone,
        o.customerAddress.replace(/"/g, '""'),
        (o.customerNote || '').replace(/"/g, '""'),
        o.paymentMethod,
        o.paymentStatus,
        o.orderStatus,
        o.totalAmount,
        o.createdAt.toLocaleString('vi-VN')
      ]
        .map((val) => `"${val}"`)
        .join(",");
    });

    const csvContent = "\ufeff" + [headers, ...rows].join("\n");

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename=danh-sach-don-hang.csv'
      }
    });
  } catch (error: any) {
    console.error('Error in GET /api/admin/orders/export:', error);
    return NextResponse.json({ error: error.message }, { status: error.message.includes('Unauthorized') ? 401 : error.message.includes('Forbidden') ? 403 : 500 });
  }
}
