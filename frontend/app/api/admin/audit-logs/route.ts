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
    await verifyAdmin(request);

    // Fetch last 100 audit logs
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    console.error('Error in GET /api/admin/audit-logs:', error);
    return NextResponse.json(
      { error: error.message },
      { 
        status: error.message.includes('Unauthorized') 
          ? 401 
          : error.message.includes('Forbidden') 
            ? 403 
            : 500 
      }
    );
  }
}
