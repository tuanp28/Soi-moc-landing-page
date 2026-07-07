import { NextResponse } from 'next/server';
import { getDbProducts } from '@/app/data/productsDb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await getDbProducts();
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    console.error('Error fetching products via API:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
