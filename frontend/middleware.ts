import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPath = pathname.startsWith('/admin');
  const isStaffPath = pathname.startsWith('/staff');
  const isVipPath = pathname.startsWith('/vip');

  if (isAdminPath || isStaffPath || isVipPath) {
    const token = request.cookies.get('soimoc-access-token')?.value;
    const role = request.cookies.get('soimoc-role')?.value || 'customer';
    const vipLevel = request.cookies.get('soimoc-vip-level')?.value || 'normal';

    // 1. If not authenticated at all, redirect to login
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 2. Protect Admin dashboard (Only Admin)
    if (isAdminPath) {
      if (role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    // 3. Protect Staff dashboard (Staff, Manager, Admin)
    if (isStaffPath) {
      if (role !== 'staff' && role !== 'manager' && role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    // 4. Protect VIP page (VIP roles or any tier higher than normal)
    if (isVipPath) {
      const isVipUser = 
        role === 'vip' || 
        role === 'staff' || 
        role === 'manager' || 
        role === 'admin' || 
        vipLevel !== 'normal';
      
      if (!isVipUser) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
  }

  return NextResponse.next();
}

// Map the matcher to intercept the protected routes
export const config = {
  matcher: [
    '/admin/:path*',
    '/staff/:path*',
    '/vip/:path*',
  ],
};
