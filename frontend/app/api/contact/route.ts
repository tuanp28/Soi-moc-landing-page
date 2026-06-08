import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message, userId } = body;

    // Server-side validation
    const nameTrimmed = name && typeof name === 'string' ? name.trim() : '';
    if (!nameTrimmed) {
      return NextResponse.json({ success: false, error: 'Họ và tên không được để trống.' }, { status: 400 });
    } else if (!/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝàáâãèéêìíòóôõùúýĂăĐđĨĩŨũƠơƯưẠ-ỹ\s]+$/.test(nameTrimmed)) {
      return NextResponse.json({ success: false, error: 'Họ và tên chỉ được chứa chữ cái và khoảng trắng.' }, { status: 400 });
    } else if (nameTrimmed.split(/\s+/).length < 2) {
      return NextResponse.json({ success: false, error: 'Vui lòng nhập đầy đủ cả họ và tên.' }, { status: 400 });
    }
    
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: 'Email không hợp lệ.' }, { status: 400 });
    }

    const cleanPhone = phone && typeof phone === 'string' ? phone.replace(/[\s().-]/g, '') : '';
    if (!phone || typeof phone !== 'string' || phone.trim() === '') {
      return NextResponse.json({ success: false, error: 'Số điện thoại không được để trống.' }, { status: 400 });
    } else if (!/^(0|84|\+84)[35789][0-9]{8}$|^(0|84|\+84)2[0-9]{9}$/.test(cleanPhone)) {
      return NextResponse.json({ success: false, error: 'Số điện thoại không hợp lệ (ví dụ: 0912 345 678).' }, { status: 400 });
    }

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json({ success: false, error: 'Nội dung liên hệ không được để trống.' }, { status: 400 });
    }

    // Check if duplicate contact already exists
    const existingContact = await prisma.contact.findFirst({
      where: {
        OR: [
          { email: email.trim() },
          { phone: cleanPhone }
        ]
      }
    });

    if (existingContact) {
      return NextResponse.json({ 
        success: false, 
        error: 'Thông tin của bạn đã được ghi nhận trước đó.' 
      }, { status: 400 });
    }

    // Save database entry via Prisma Client
    const contact = await prisma.contact.create({
      data: {
        name: nameTrimmed,
        email: email.trim(),
        phone: cleanPhone,
        subject: subject && typeof subject === 'string' && subject.trim() !== '' ? subject.trim() : null,
        message: message.trim(),
        userId: userId && typeof userId === 'string' ? userId : null
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Liên hệ đã được gửi thành công',
      data: contact 
    });
  } catch (error: any) {
    console.error('Error in POST /api/contact:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Đã xảy ra lỗi hệ thống khi gửi thông tin liên hệ. Vui lòng thử lại sau.' 
    }, { status: 500 });
  }
}
