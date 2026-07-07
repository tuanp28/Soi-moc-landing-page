import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import prisma from '@/src/lib/prisma';
import { logAuditEvent } from '@/src/lib/audit';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wanuvqejxogotqrxmdck.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_bYvknsun39Hg3d4xYQKSVA_7-IiLCCb';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];

    const supabaseServer = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    });

    const { data: { user }, error } = await supabaseServer.auth.getUser(token);
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    // Verify requesting user is the sole system admin
    const adminProfile = await prisma.profile.findUnique({
      where: { id: user.id },
    });

    if (!adminProfile || adminProfile.role !== 'admin' || adminProfile.email !== 'tuanphamabcxyz123@gmail.com') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { targetUserId, role, vipLevel } = body;

    if (!targetUserId) {
      return NextResponse.json({ error: 'Bad Request: Missing targetUserId' }, { status: 400 });
    }

    // Fetch target user profile to verify constraints
    const targetProfile = await prisma.profile.findUnique({
      where: { id: targetUserId },
    });

    if (!targetProfile) {
      return NextResponse.json({ error: 'Not Found: Target user not found' }, { status: 404 });
    }

    // 1. Prevent changing the role of the sole admin
    if (targetProfile.email === 'tuanphamabcxyz123@gmail.com' && role && role !== 'admin') {
      return NextResponse.json({ error: 'Không thể hạ quyền của tài khoản Admin duy nhất.' }, { status: 400 });
    }

    // 2. Prevent promoting any other user to admin
    if (role === 'admin' && targetProfile.email !== 'tuanphamabcxyz123@gmail.com') {
      return NextResponse.json({ error: 'Chỉ cho phép duy nhất một tài khoản Admin trên hệ thống.' }, { status: 400 });
    }

    // Update user profile role and VIP tier
    const updatedProfile = await prisma.profile.update({
      where: { id: targetUserId },
      data: {
        ...(role && { role }),
        ...(vipLevel && { vipLevel }),
      },
    });

    // Write audit log
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';
    await logAuditEvent(
      adminProfile.id,
      adminProfile.email,
      'UPDATE_USER_ROLE_VIP',
      { targetUserId, targetEmail: targetProfile.email, role, vipLevel },
      ip
    );

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (err: any) {
    console.error('Error in POST /api/admin/users/update:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
