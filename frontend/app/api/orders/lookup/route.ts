import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, phone } = body;

    if (!orderId || typeof orderId !== 'string' || orderId.trim() === '') {
      return NextResponse.json({ success: false, error: 'Mã đơn hàng không được để trống.' }, { status: 400 });
    }

    if (!phone || typeof phone !== 'string' || phone.trim() === '') {
      return NextResponse.json({ success: false, error: 'Số điện thoại không được để trống.' }, { status: 400 });
    }

    const cleanOrderId = orderId.trim().toUpperCase();
    const cleanPhone = phone.replace(/[\s().-]/g, '');

    if (cleanPhone.length < 8) {
      return NextResponse.json({ success: false, error: 'Số điện thoại không hợp lệ.' }, { status: 400 });
    }

    // Query order from database
    const order = await prisma.order.findUnique({
      where: { id: cleanOrderId }
    });

    if (!order) {
      return NextResponse.json({ 
        success: false, 
        error: 'Không tìm thấy đơn hàng nào có mã này. Vui lòng kiểm tra lại.' 
      }, { status: 404 });
    }

    // Clean DB phone for comparison
    const dbPhoneClean = order.customerPhone.replace(/[\s().-]/g, '');

    // Check if phone matches (allowing match with or without country code prefixes like +84 / 84 / 0)
    const matchPhone = (p1: string, p2: string) => {
      const normalize = (p: string) => {
        if (p.startsWith('+84')) return '0' + p.slice(3);
        if (p.startsWith('84') && p.length > 9) return '0' + p.slice(2);
        return p;
      };
      return normalize(p1) === normalize(p2);
    };

    if (!matchPhone(dbPhoneClean, cleanPhone)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Số điện thoại không khớp với thông tin đặt hàng. Vui lòng kiểm tra lại.' 
      }, { status: 400 });
    }

    // Convert items JSON back to object
    let items = [];
    try {
      items = JSON.parse(order.itemsJson);
    } catch (e) {
      console.error('Error parsing itemsJson:', e);
    }

    const orderData = {
      id: order.id,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerAddress: order.customerAddress,
      customerNote: order.customerNote,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      items: items
    };

    return NextResponse.json({ success: true, order: orderData });
  } catch (error: any) {
    console.error('Error in POST /api/orders/lookup:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Đã xảy ra lỗi hệ thống khi tra cứu đơn hàng. Vui lòng thử lại sau.' 
    }, { status: 500 });
  }
}
