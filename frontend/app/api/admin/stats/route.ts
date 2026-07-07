import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import prisma from '@/src/lib/prisma';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wanuvqejxogotqrxmdck.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_bYvknsun39Hg3d4xYQKSVA_7-IiLCCb';

// Helper to authenticate user and check role
async function verifyUserAndRole(request: Request, allowedRoles: ('customer' | 'vip' | 'staff' | 'manager' | 'admin')[]) {
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

  const profile = await prisma.profile.findUnique({
    where: { id: user.id }
  });

  if (!profile) {
    throw new Error('Forbidden: Profile not found');
  }

  const isStrictAdmin = profile.role === 'admin' && profile.email === 'tuanphamabcxyz123@gmail.com';
  const hasAccess = allowedRoles.includes(profile.role) || isStrictAdmin;

  if (!hasAccess) {
    throw new Error('Forbidden: Insufficient permissions');
  }

  return { user, profile };
}

export async function GET(request: Request) {
  try {
    const { profile } = await verifyUserAndRole(request, ['staff', 'manager', 'admin']);

    // 1. Fetch metric counts
    const totalUsers = await prisma.profile.count();
    const totalProducts = await prisma.product.count();
    
    // Get orders
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'asc' }
    });

    const totalOrders = orders.length;

    // Filter paid/completed orders for revenue
    const revenueOrders = orders.filter(o => 
      o.orderStatus === 'completed' || o.paymentStatus === 'paid'
    );
    
    // Redact revenue for staff role
    const isStaff = profile.role === 'staff';
    const totalRevenue = isStaff ? 0 : revenueOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    // 2. Generate daily chart data for last 30 days
    const chartData: { date: string; revenue: number; orders: number }[] = [];
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dateString = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
      
      // Filter orders on this day
      const dayOrders = orders.filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate.getDate() === d.getDate() &&
               orderDate.getMonth() === d.getMonth() &&
               orderDate.getFullYear() === d.getFullYear();
      });

      const dayRevenueOrders = dayRevenueOrdersFilter(dayOrders);
      const dayRevenue = isStaff ? 0 : dayRevenueOrders.reduce((sum, o) => sum + o.totalAmount, 0);

      chartData.push({
        date: dateString,
        revenue: dayRevenue,
        orders: dayOrders.length
      });
    }

    // 3. Category distribution
    const products = await prisma.product.findMany();
    const categoryStats = {
      corn: products.filter(p => p.category === 'corn').length,
      specialty: products.filter(p => p.category === 'specialty').length
    };

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        totalUsers,
        totalProducts,
        chartData,
        categoryStats
      }
    });
  } catch (error: any) {
    console.error('Error in GET /api/admin/stats:', error);
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

function dayRevenueOrdersFilter(dayOrders: any[]) {
  return dayOrders.filter(o => 
    o.orderStatus === 'completed' || o.paymentStatus === 'paid'
  );
}
