import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import prisma from '@/src/lib/prisma';
import { logAuditEvent } from '@/src/lib/audit';

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

// GET coupons
export async function GET(request: Request) {
  try {
    // Staff, Manager, Admin can view
    await verifyUserAndRole(request, ['staff', 'manager', 'admin']);
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, coupons });
  } catch (error: any) {
    console.error('Error in GET /api/admin/coupons:', error);
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

// POST create coupon
export async function POST(request: Request) {
  try {
    // Only Manager and Admin can POST
    const { profile } = await verifyUserAndRole(request, ['manager', 'admin']);
    const body = await request.json();
    const {
      code,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscountAmount,
      usageLimit,
      limitPerUser,
      startDate,
      expiryDate,
      isActive
    } = body;

    if (!code || !discountType || discountValue === undefined || !startDate || !expiryDate) {
      return NextResponse.json({ error: 'Missing required coupon fields' }, { status: 400 });
    }

    const upperCode = code.toUpperCase().trim();

    // Check unique
    const existing = await prisma.coupon.findUnique({
      where: { code: upperCode }
    });
    if (existing) {
      return NextResponse.json({ error: 'Mã giảm giá đã tồn tại.' }, { status: 400 });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: upperCode,
        discountType,
        discountValue: parseFloat(discountValue),
        minOrderValue: minOrderValue ? parseFloat(minOrderValue) : 0,
        maxDiscountAmount: maxDiscountAmount ? parseFloat(maxDiscountAmount) : null,
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        limitPerUser: limitPerUser ? parseInt(limitPerUser) : null,
        startDate: new Date(startDate),
        expiryDate: new Date(expiryDate),
        isActive: isActive !== undefined ? isActive : true
      }
    });

    // Write audit log
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';
    await logAuditEvent(
      profile.id,
      profile.email,
      'CREATE_COUPON',
      { code: upperCode, discountType, discountValue },
      ip
    );

    return NextResponse.json({ success: true, coupon });
  } catch (error: any) {
    console.error('Error in POST /api/admin/coupons:', error);
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

// PUT update coupon
export async function PUT(request: Request) {
  try {
    // Only Manager and Admin can PUT
    const { profile } = await verifyUserAndRole(request, ['manager', 'admin']);
    const body = await request.json();
    const {
      id,
      code,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscountAmount,
      usageLimit,
      limitPerUser,
      startDate,
      expiryDate,
      isActive
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing coupon ID' }, { status: 400 });
    }

    const updatedCoupon = await prisma.coupon.update({
      where: { id },
      data: {
        ...(code && { code: code.toUpperCase().trim() }),
        ...(discountType && { discountType }),
        ...(discountValue !== undefined && { discountValue: parseFloat(discountValue) }),
        ...(minOrderValue !== undefined && { minOrderValue: parseFloat(minOrderValue) }),
        ...(maxDiscountAmount !== undefined && { maxDiscountAmount: maxDiscountAmount ? parseFloat(maxDiscountAmount) : null }),
        ...(usageLimit !== undefined && { usageLimit: usageLimit ? parseInt(usageLimit) : null }),
        ...(limitPerUser !== undefined && { limitPerUser: limitPerUser ? parseInt(limitPerUser) : null }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(expiryDate && { expiryDate: new Date(expiryDate) }),
        ...(isActive !== undefined && { isActive })
      }
    });

    // Write audit log
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';
    await logAuditEvent(
      profile.id,
      profile.email,
      'UPDATE_COUPON',
      { id, code: updatedCoupon.code, isActive },
      ip
    );

    return NextResponse.json({ success: true, coupon: updatedCoupon });
  } catch (error: any) {
    console.error('Error in PUT /api/admin/coupons:', error);
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

// DELETE coupon
export async function DELETE(request: Request) {
  try {
    // Only Manager and Admin can DELETE
    const { profile } = await verifyUserAndRole(request, ['manager', 'admin']);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing coupon ID parameter' }, { status: 400 });
    }

    const deletedCoupon = await prisma.coupon.delete({
      where: { id }
    });

    // Write audit log
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';
    await logAuditEvent(
      profile.id,
      profile.email,
      'DELETE_COUPON',
      { id, code: deletedCoupon.code },
      ip
    );

    return NextResponse.json({ success: true, message: 'Đã xóa mã giảm giá thành công.' });
  } catch (error: any) {
    console.error('Error in DELETE /api/admin/coupons:', error);
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
