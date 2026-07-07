'use client';

import React, { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { 
  BarChart2, 
  Package, 
  Tag, 
  Users, 
  LogOut,
  ShieldAlert
} from 'lucide-react';
import ProtectedRoute from '@/app/components/ProtectedRoute';

// Import Tabs
import { AdminDashboardOverview } from './components/AdminDashboardOverview';
import { AdminProductTab } from './components/AdminProductTab';
import { AdminVoucherTab } from './components/AdminVoucherTab';
import { AdminUserTab } from './components/AdminUserTab';
import { AdminAuditLogTab } from './components/AdminAuditLogTab';

type ActiveTab = 'overview' | 'products' | 'vouchers' | 'users' | 'audit-logs';

function AdminPortal() {
  const { profile: adminProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  const isStrictAdmin = adminProfile?.role === 'admin' && adminProfile?.email === 'tuanphamabcxyz123@gmail.com';

  const menuItems = [
    { id: 'overview', label: 'TỔNG QUAN', icon: BarChart2 },
    { id: 'products', label: 'SẢN PHẨM', icon: Package },
    { id: 'vouchers', label: 'VOUCHERS', icon: Tag },
    ...(isStrictAdmin ? [
      { id: 'users', label: 'HỘI VIÊN & VIP', icon: Users },
      { id: 'audit-logs', label: 'NHẬT KÝ THAO TÁC', icon: ShieldAlert }
    ] : [])
  ] as const;

  // Safe fallback if tab gets hidden dynamically
  const currentTab = menuItems.some(item => item.id === activeTab) ? activeTab : 'overview';

  return (
    <div className="bg-[#F9F4EC] dark:bg-[#111510] text-[#1A1A1A] dark:text-stone-200 min-h-[90vh] transition-colors duration-300 font-sans flex flex-col lg:flex-row">
      
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-64 bg-white dark:bg-[#171E15] border-b lg:border-b-0 lg:border-r border-[#2D5A27]/10 dark:border-white/10 p-6 flex flex-col justify-between">
        <div className="space-y-8">
          
          {/* Admin Info Profile */}
          <div className="border-b border-[#2D5A27]/10 dark:border-white/10 pb-6">
            <span className="text-[10px] font-bold tracking-widest text-[#2D5A27] dark:text-brand-green-light uppercase font-sans">
              {adminProfile?.role === 'admin' ? 'Quản Trị Viên' : adminProfile?.role === 'manager' ? 'Quản Lý' : 'Nhân Viên'}
            </span>
            <h1 className="text-md font-bold tracking-tight text-[#1A1A1A] dark:text-white font-sans uppercase mt-1 truncate" title={adminProfile?.fullName}>
              {adminProfile?.fullName || 'Nhân viên Sợi Mộc'}
            </h1>
            <p className="text-[10px] font-sans text-brand-muted truncate mt-0.5">{adminProfile?.email}</p>
          </div>

          {/* Menu Items */}
          <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as ActiveTab)}
                  className={`flex items-center gap-3 px-4 py-3 text-xs font-bold tracking-wider uppercase rounded-none transition-all cursor-pointer whitespace-nowrap lg:w-full border-b-2 lg:border-b-0 lg:border-l-2 ${
                    currentTab === item.id
                      ? 'bg-[#2D5A27]/5 border-[#2D5A27] text-[#2D5A27] dark:bg-white/5 dark:border-brand-green-light dark:text-brand-green-light font-extrabold'
                      : 'border-transparent text-brand-muted hover:text-brand-charcoal dark:hover:text-stone-200 hover:bg-stone-50 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Back to Home Link */}
        <div className="pt-6 border-t border-[#2D5A27]/10 dark:border-white/10 mt-6 lg:mt-0 hidden lg:block">
          <a
            href="/"
            className="flex items-center gap-3 px-4 py-2 text-xs font-bold tracking-wider uppercase text-brand-muted hover:text-[#2D5A27] dark:hover:text-brand-green-light transition-colors"
          >
            <LogOut className="w-4 h-4 rotate-180" />
            VỀ TRANG CHỦ
          </a>
        </div>

      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        {currentTab === 'overview' && <AdminDashboardOverview />}
        {currentTab === 'products' && <AdminProductTab />}
        {currentTab === 'vouchers' && <AdminVoucherTab />}
        {isStrictAdmin && currentTab === 'users' && <AdminUserTab />}
        {isStrictAdmin && currentTab === 'audit-logs' && <AdminAuditLogTab />}
      </div>

    </div>
  );
}

export default function AdminPortalPage() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'manager', 'staff']}>
      <AdminPortal />
    </ProtectedRoute>
  );
}
