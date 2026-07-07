'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Shield, RefreshCw, Clock, Terminal, Globe } from 'lucide-react';

interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  details: string;
  ipAddress: string | null;
  createdAt: string;
}

export function AdminAuditLogTab() {
  const { session } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const response = await fetch('/api/admin/audit-logs', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [session]);

  const translateAction = (action: string) => {
    switch (action) {
      case 'CREATE_PRODUCT': return 'Tạo sản phẩm';
      case 'UPDATE_PRODUCT': return 'Cập nhật sản phẩm';
      case 'DELETE_PRODUCT': return 'Xóa sản phẩm';
      case 'CREATE_COUPON': return 'Tạo mã giảm giá';
      case 'UPDATE_COUPON': return 'Cập nhật mã giảm giá';
      case 'DELETE_COUPON': return 'Xóa mã giảm giá';
      case 'UPDATE_USER_ROLE_VIP': return 'Thay đổi vai trò/VIP';
      case 'UPDATE_ORDER_STATUS': return 'Cập nhật TT đơn hàng';
      case 'UPDATE_ORDER_PAYMENT': return 'Cập nhật TT thanh toán';
      default: return action;
    }
  };

  const getActionBadgeColor = (action: string) => {
    if (action.startsWith('CREATE')) return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    if (action.startsWith('DELETE')) return 'bg-red-50 text-red-800 border-red-200';
    if (action.startsWith('UPDATE_USER')) return 'bg-purple-50 text-purple-800 border-purple-200';
    return 'bg-amber-50 text-amber-800 border-amber-200';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-[#2D5A27] dark:text-brand-green-light uppercase font-sans">
            Bảo Mật Hệ Thống
          </span>
          <h2 className="text-xl font-bold tracking-tight text-[#1A1A1A] dark:text-white font-sans uppercase">
            Nhật Ký Thao Tác (Audit Logs)
          </h2>
          <p className="text-[10px] text-brand-muted uppercase font-sans mt-0.5">
            Lịch sử thao tác ghi đè của các tài khoản Admin/Staff/Manager
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="flex items-center gap-2 px-3 py-2 border border-[#2D5A27]/25 hover:bg-[#2D5A27]/5 text-xs font-bold tracking-wider uppercase transition-all rounded-none bg-white dark:bg-stone-900 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Làm mới
        </button>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center bg-white dark:bg-[#171E15] border border-[#2D5A27]/10 dark:border-white/10 gap-3">
          <div className="w-8 h-8 border-4 border-[#2D5A27] border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-bold tracking-wider text-brand-muted uppercase font-sans">
            Đang tải nhật ký...
          </p>
        </div>
      ) : logs.length === 0 ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center bg-white dark:bg-[#171E15] border border-[#2D5A27]/10 dark:border-white/10 text-center p-8">
          <Shield className="w-12 h-12 text-stone-300 dark:text-stone-700 mb-3" />
          <p className="text-xs font-bold text-stone-500 uppercase tracking-widest font-mono">
            Chưa có ghi chép nhật ký nào được ghi nhận.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#171E15] border border-[#2D5A27]/10 dark:border-white/10 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF6EE] dark:bg-[#111510] text-brand-muted font-sans font-bold uppercase text-[10px] tracking-wider border-b border-[#2D5A27]/10 dark:border-white/10">
                  <th className="p-4">Thời gian</th>
                  <th className="p-4">Tài khoản</th>
                  <th className="p-4">Hành động</th>
                  <th className="p-4">Chi tiết thao tác</th>
                  <th className="p-4">Địa chỉ IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-white/5 font-sans">
                {logs.map((log) => {
                  let formattedDetails = log.details;
                  try {
                    const parsed = JSON.parse(log.details);
                    formattedDetails = Object.entries(parsed)
                      .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`)
                      .join(' | ');
                  } catch (e) {
                    // Use raw text if not JSON
                  }

                  return (
                    <tr key={log.id} className="hover:bg-stone-50/50 dark:hover:bg-white/5 transition-colors">
                      <td className="p-4 whitespace-nowrap text-[10px] font-mono text-brand-muted">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          {new Date(log.createdAt).toLocaleString('vi-VN')}
                        </div>
                      </td>
                      <td className="p-4 font-bold text-brand-charcoal dark:text-stone-200">
                        {log.userEmail}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 border text-[9px] font-bold font-mono uppercase tracking-wider ${getActionBadgeColor(log.action)}`}>
                          {translateAction(log.action)}
                        </span>
                      </td>
                      <td className="p-4 max-w-xs md:max-w-md truncate text-stone-600 dark:text-stone-400 font-mono text-[10px]" title={log.details}>
                        <div className="flex items-center gap-1">
                          <Terminal className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                          <span className="truncate">{formattedDetails}</span>
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap font-mono text-[10px] text-brand-muted">
                        <div className="flex items-center gap-1">
                          <Globe className="w-3.5 h-3.5 text-stone-400" />
                          {log.ipAddress || 'N/A'}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
