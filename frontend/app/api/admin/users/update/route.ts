import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import prisma from '@/src/lib/prisma';

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

    // Verify requesting user is admin
    const adminProfile = await prisma.profile.findUnique({
      where: { id: user.id },
    });

    if (!adminProfile || adminProfile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { targetUserId, role, vipLevel } = body;

    if (!targetUserId) {
      return NextResponse.json({ error: 'Bad Request: Missing targetUserId' }, { status: 400 });
    }

    // Update user profile role and VIP tier
    const updatedProfile = await prisma.profile.update({
      where: { id: targetUserId },
      data: {
        ...(role && { role }),
        ...(vipLevel && { vipLevel }),
      },
    });

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (err: any) {
    console.error('Error in POST /api/admin/users/update:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
