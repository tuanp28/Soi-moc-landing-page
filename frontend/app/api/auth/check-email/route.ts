import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: 'Email không hợp lệ.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    let exists = false;

    try {
      // Query auth.users directly to catch users who registered but haven't logged in yet (or have no profile record)
      const users = await prisma.$queryRaw<any[]>`
        SELECT id FROM auth.users WHERE email = ${cleanEmail} LIMIT 1
      `;
      exists = users && users.length > 0;
    } catch (dbError) {
      console.warn('Fallback: Querying auth.users failed, checking Profile table instead.', dbError);
      // Fallback: check Profile table
      const profile = await prisma.profile.findUnique({
        where: { email: cleanEmail },
      });
      exists = !!profile;
    }

    return NextResponse.json({ success: true, exists });
  } catch (error: any) {
    console.error('Error in POST /api/auth/check-email:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Đã xảy ra lỗi hệ thống khi kiểm tra email. Vui lòng thử lại sau.' 
    }, { status: 500 });
  }
}
