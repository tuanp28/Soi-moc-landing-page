import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import prisma from '@/src/lib/prisma';
import { getAllDbProductsAdmin } from '@/app/data/productsDb';
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

// GET all products (including inactive ones)
export async function GET(request: Request) {
  try {
    // Staff, Manager, Admin can GET
    await verifyUserAndRole(request, ['staff', 'manager', 'admin']);
    const products = await getAllDbProductsAdmin();
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    console.error('Error in GET /api/admin/products:', error);
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

// POST create product
export async function POST(request: Request) {
  try {
    // Only Manager and Admin can POST
    const { profile } = await verifyUserAndRole(request, ['manager', 'admin']);
    const body = await request.json();
    const {
      id,
      name,
      tagline,
      description,
      details,
      image,
      images,
      features,
      cookingTime,
      nutrition,
      sizes,
      category,
      badge
    } = body;

    if (!id || !name || !image || !sizes || !category) {
      return NextResponse.json({ error: 'Missing required product fields' }, { status: 400 });
    }

    // Check if product ID already exists
    const existing = await prisma.product.findUnique({
      where: { id }
    });
    if (existing) {
      return NextResponse.json({ error: 'Mã sản phẩm (ID) đã tồn tại trên hệ thống.' }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: {
        id,
        name,
        tagline: tagline || '',
        description: description || '',
        details: details || '',
        image,
        imagesJson: JSON.stringify(images || []),
        featuresJson: JSON.stringify(features || []),
        cookingTime: cookingTime || '15 phút',
        calories: nutrition?.calories || '',
        carbs: nutrition?.carbs || '',
        protein: nutrition?.protein || '',
        fiber: nutrition?.fiber || '',
        fat: nutrition?.fat || '',
        sizesJson: JSON.stringify(sizes),
        category,
        badge: badge || null,
        isActive: true
      }
    });

    // Write audit log
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';
    await logAuditEvent(
      profile.id,
      profile.email,
      'CREATE_PRODUCT',
      { id, name, category, sizes },
      ip
    );

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error: any) {
    console.error('Error in POST /api/admin/products:', error);
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

// PUT update product
export async function PUT(request: Request) {
  try {
    // Only Manager and Admin can PUT
    const { profile } = await verifyUserAndRole(request, ['manager', 'admin']);
    const body = await request.json();
    const {
      id,
      name,
      tagline,
      description,
      details,
      image,
      images,
      features,
      cookingTime,
      nutrition,
      sizes,
      category,
      badge,
      isActive
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing product ID' }, { status: 400 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(tagline !== undefined && { tagline }),
        ...(description !== undefined && { description }),
        ...(details !== undefined && { details }),
        ...(image && { image }),
        ...(images && { imagesJson: JSON.stringify(images) }),
        ...(features && { featuresJson: JSON.stringify(features) }),
        ...(cookingTime !== undefined && { cookingTime }),
        ...(nutrition && {
          calories: nutrition.calories || '',
          carbs: nutrition.carbs || '',
          protein: nutrition.protein || '',
          fiber: nutrition.fiber || '',
          fat: nutrition.fat || ''
        }),
        ...(sizes && { sizesJson: JSON.stringify(sizes) }),
        ...(category && { category }),
        ...(badge !== undefined && { badge: badge || null }),
        ...(isActive !== undefined && { isActive })
      }
    });

    // Write audit log
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';
    await logAuditEvent(
      profile.id,
      profile.email,
      'UPDATE_PRODUCT',
      { id, name: updatedProduct.name, isActive },
      ip
    );

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error: any) {
    console.error('Error in PUT /api/admin/products:', error);
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

// DELETE permanently delete product
export async function DELETE(request: Request) {
  try {
    // Only Manager and Admin can DELETE
    const { profile } = await verifyUserAndRole(request, ['manager', 'admin']);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing product ID parameter' }, { status: 400 });
    }

    // Permanently delete from database
    const deletedProduct = await prisma.product.delete({
      where: { id }
    });

    // Write audit log
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';
    await logAuditEvent(
      profile.id,
      profile.email,
      'DELETE_PRODUCT',
      { id, name: deletedProduct.name },
      ip
    );

    return NextResponse.json({ success: true, message: 'Đã xóa sản phẩm thành công.' });
  } catch (error: any) {
    console.error('Error in DELETE /api/admin/products:', error);
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
