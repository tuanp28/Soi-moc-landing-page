import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import prisma from '@/src/lib/prisma';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wanuvqejxogotqrxmdck.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_bYvknsun39Hg3d4xYQKSVA_7-IiLCCb';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];

    // Create a one-off Supabase Server Client to fetch the user
    const supabaseServer = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    });

    const { data: { user }, error } = await supabaseServer.auth.getUser(token);
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    // Check database profile
    let profile = await prisma.profile.findUnique({
      where: { id: user.id },
    });

    // Auto-create profile on first registration/login
    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          id: user.id,
          email: user.email!,
          fullName: user.user_metadata?.full_name || user.user_metadata?.name || 'Khách hàng Sợi Mộc',
          avatarUrl: user.user_metadata?.avatar_url || null,
          role: 'customer',
          vipLevel: 'normal',
          claimedGifts: '',
        },
      });
    }

    // Auto-upgrade VIP Level based on total spending of COMPLETED orders
    try {
      const completedOrders = await prisma.order.findMany({
        where: {
          userId: user.id,
          orderStatus: 'completed',
        },
      });

      const totalSpent = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0);

      const vipWeights: Record<string, number> = {
        normal: 0,
        silver: 1,
        gold: 2,
        diamond: 3,
      };

      let targetVipLevel = 'normal';
      if (totalSpent >= 5000000) {
        targetVipLevel = 'diamond';
      } else if (totalSpent >= 2000000) {
        targetVipLevel = 'gold';
      } else if (totalSpent >= 500000) {
        targetVipLevel = 'silver';
      }

      if (profile) {
        const currentWeight = vipWeights[profile.vipLevel] || 0;
        const targetWeight = vipWeights[targetVipLevel] || 0;

        if (targetWeight > currentWeight) {
          profile = await prisma.profile.update({
            where: { id: user.id },
            data: {
              vipLevel: targetVipLevel as any,
            },
          });
        }
      }
    } catch (err) {
      console.error('Error auto-upgrading VIP level:', err);
    }

    // Set secure cookies for routing middleware
    const response = NextResponse.json({ success: true, profile });
    
    response.cookies.set('soimoc-role', profile.role, {
      path: '/',
      maxAge: 604800, // 7 days
      sameSite: 'lax',
      httpOnly: false, // Middleware needs access
    });
    
    response.cookies.set('soimoc-vip-level', profile.vipLevel, {
      path: '/',
      maxAge: 604800,
      sameSite: 'lax',
      httpOnly: false, // Middleware needs access
    });

    return response;
  } catch (err: any) {
    console.error('Error in GET /api/profile/me:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
