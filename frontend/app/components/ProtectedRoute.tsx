'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('customer' | 'vip' | 'staff' | 'manager' | 'admin')[];
  allowedVipLevels?: ('normal' | 'silver' | 'gold' | 'diamond')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles, 
  allowedVipLevels 
}) => {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (profile) {
        // Enforce role access control list
        if (allowedRoles && !allowedRoles.includes(profile.role)) {
          router.push('/');
        }
        // Enforce VIP access level checks
        if (allowedVipLevels) {
          const isVip = 
            profile.role === 'vip' || 
            profile.role === 'staff' || 
            profile.role === 'manager' || 
            profile.role === 'admin' || 
            profile.vipLevel !== 'normal';
            
          if (!isVip) {
            router.push('/');
          }
        }
      }
    }
  }, [user, profile, loading, router, allowedRoles, allowedVipLevels]);

  if (loading || (user && !profile)) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#F9F4EC] gap-4">
        <div className="w-10 h-10 border-4 border-[#2D5A27] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-black tracking-widest text-[#5A5A5A] uppercase font-mono animate-pulse">
          Đang xác thực thông tin...
        </p>
      </div>
    );
  }

  // Pre-render checks matching security policy
  if (!user) return null;
  
  if (profile) {
    if (allowedRoles && !allowedRoles.includes(profile.role)) return null;
    if (allowedVipLevels) {
      const isVip = 
        profile.role === 'vip' || 
        profile.role === 'staff' || 
        profile.role === 'manager' || 
        profile.role === 'admin' || 
        profile.vipLevel !== 'normal';
      if (!isVip) return null;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
