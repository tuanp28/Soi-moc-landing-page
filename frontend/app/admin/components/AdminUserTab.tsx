'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Award, 
  ShieldCheck, 
  RefreshCw, 
  Search, 
  UserPlus,
  Mail,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  role: 'customer' | 'vip' | 'staff' | 'manager' | 'admin';
  vipLevel: 'normal' | 'silver' | 'gold' | 'diamond';
  createdAt: string;
}

export function AdminUserTab() {
  const { session, profile: adminProfile } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [vipFilter, setVipFilter] = useState<string>('all');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchUsers = async () => {
    if (!session) return;
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setUsers(data.users);
      } else {
        setMessage({ type: 'error', text: data.error || 'Không thể tải danh sách người dùng.' });
      }
    } catch (err) {
      console.error('Fetch users error:', err);
      setMessage({ type: 'error', text: 'Không thể kết nối đến máy chủ.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [session]);

  const handleUpdateUser = async (targetUserId: string, field: 'role' | 'vipLevel', newValue: string) => {
    if (!session) return;
    setActionLoadingId(targetUserId);
    setMessage(null);

    try {
      const payload = {
        targetUserId,
        [field]: newValue,
      };

      const response = await fetch('/api/admin/users/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setUsers(prev =>
          prev.map(u => (u.id === targetUserId ? { ...u, [field]: newValue as any } : u))
        );
        setMessage({ type: 'success', text: `Đã cập nhật thông tin thành công.` });
        setTimeout(() => setMessage(null), 4000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Cập nhật thất bại.' });
      }
    } catch (err) {
      console.error('Update user error:', err);
      setMessage({ type: 'error', text: 'Đã xảy ra lỗi khi gửi yêu cầu cập nhật.' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const totalCount = users.length;
  const vipCount = users.filter(u => u.role === 'vip' || u.vipLevel !== 'normal').length;
  const staffCount = users.filter(u => u.role === 'staff' || u.role === 'manager' || u.role === 'admin').length;
  const normalCount = users.filter(u => u.role === 'customer' && u.vipLevel === 'normal').length;

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesVip = vipFilter === 'all' || user.vipLevel === vipFilter;

    return matchesSearch && matchesRole && matchesVip;
  });

  return (
    <div className="space-y-8 font-sans">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#2D5A27]/10 dark:border-white/10 pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#1A1A1A] dark:text-white font-sans uppercase">
            Quản lý người dùng & VIP
          </h2>
          <p className="text-xs text-brand-muted mt-1">Cấp quyền nhân viên hoặc điều chỉnh thủ công thứ hạng VIP của tài khoản.</p>
        </div>

        <button
          onClick={fetchUsers}
          className="w-fit flex items-center justify-center gap-2 px-5 py-3 border border-[#2D5A27]/20 hover:border-[#2D5A27] bg-white dark:bg-stone-900 text-xs font-bold tracking-wider uppercase hover:shadow-xs active:scale-95 transition-all cursor-pointer rounded-none text-[#1A1A1A] dark:text-stone-200"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Tải lại danh sách
        </button>
      </div>

      {message && (
        <div className={`p-4 border text-xs font-bold ${
          message.type === 'success' 
            ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300' 
            : 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
        }`}>
          {message.text}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-[#171E15] border border-[#2D5A27]/10 dark:border-white/10 p-6 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <p className="text-[10px] text-brand-muted uppercase tracking-wider font-bold font-sans">Tổng Thành Viên</p>
            <h3 className="text-xl md:text-2xl font-bold text-[#1A1A1A] dark:text-white font-sans">{totalCount} Khách</h3>
            <p className="text-[8px] text-brand-muted">Người dùng đã đăng nhập</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#171E15] border border-[#2D5A27]/10 dark:border-white/10 p-6 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <p className="text-[10px] text-brand-muted uppercase tracking-wider font-bold font-sans">Thành viên VIP</p>
            <h3 className="text-xl md:text-2xl font-bold text-[#C8953A] dark:text-amber-400 font-sans">{vipCount} VIP</h3>
            <p className="text-[8px] text-[#C8953A]">Hạng Bạc/Vàng/Kim Cương</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/20 text-[#C8953A] flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#171E15] border border-[#2D5A27]/10 dark:border-white/10 p-6 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <p className="text-[10px] text-brand-muted uppercase tracking-wider font-bold font-sans">Nhân viên & Admin</p>
            <h3 className="text-xl md:text-2xl font-bold text-indigo-800 dark:text-indigo-400 font-sans">{staffCount} Nhân Sự</h3>
            <p className="text-[8px] text-brand-muted">Có quyền quản lý hệ thống</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/20 text-indigo-800 dark:text-indigo-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#171E15] border border-[#2D5A27]/10 dark:border-white/10 p-6 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <p className="text-[10px] text-brand-muted uppercase tracking-wider font-bold font-sans">Hạng Tiêu Chuẩn</p>
            <h3 className="text-xl md:text-2xl font-bold text-stone-700 dark:text-stone-300 font-sans">{normalCount} Thường</h3>
            <p className="text-[8px] text-brand-muted">Tài khoản chưa tích lũy</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 flex items-center justify-center">
            <UserPlus className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filters and search */}
      <div className="bg-white dark:bg-[#171E15] border border-[#2D5A27]/10 dark:border-white/10 p-6 flex flex-col lg:flex-row items-center gap-4 justify-between shadow-xs">
        <div className="relative w-full lg:max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5A5A5A]/60 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm theo Tên, Email hoặc UID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#F9F4EC]/40 dark:bg-stone-900 border border-[#2D5A27]/10 dark:border-white/10 text-sm text-[#1A1A1A] dark:text-stone-200 outline-none rounded-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-brand-muted tracking-wider">Lọc Vai Trò:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-[#2D5A27]/10 dark:border-white/10 bg-white dark:bg-stone-950 text-stone-700 dark:text-stone-300 rounded-none outline-none cursor-pointer"
            >
              <option value="all">Tất cả</option>
              <option value="customer">Khách hàng</option>
              <option value="vip">VIP</option>
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-brand-muted tracking-wider">Lọc VIP:</span>
            <select
              value={vipFilter}
              onChange={(e) => setVipFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-[#2D5A27]/10 dark:border-white/10 bg-white dark:bg-stone-950 text-stone-700 dark:text-stone-300 rounded-none outline-none cursor-pointer"
            >
              <option value="all">Tất cả</option>
              <option value="normal">Tiêu chuẩn</option>
              <option value="silver">Bạc (Silver)</option>
              <option value="gold">Vàng (Gold)</option>
              <option value="diamond">Kim cương (Diamond)</option>
            </select>
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white dark:bg-[#171E15] border border-[#2D5A27]/10 dark:border-white/10 overflow-hidden shadow-md">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-[#2D5A27] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-bold tracking-wider text-[#5A5A5A] uppercase font-sans animate-pulse">
              Đang tải danh sách người dùng...
            </p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-24 text-center text-[#5A5A5A]/60 uppercase tracking-wider text-xs font-mono">
            Không tìm thấy thành viên nào phù hợp.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#2D5A27]/5 dark:bg-[#2D5A27]/10 border-b border-[#2D5A27]/10 dark:border-white/10 text-[10px] font-bold tracking-wider text-[#5A5A5A] dark:text-stone-400 uppercase font-sans">
                  <th className="p-4.5">Avatar</th>
                  <th className="p-4.5">Họ và Tên</th>
                  <th className="p-4.5">Email liên hệ</th>
                  <th className="p-4.5">Ngày Tham Gia</th>
                  <th className="p-4.5">Vai Trò (Role)</th>
                  <th className="p-4.5">Hạng VIP (VIP Level)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2D5A27]/5 dark:divide-white/5 text-xs">
                {filteredUsers.map((user) => (
                  <tr 
                    key={user.id}
                    className="hover:bg-[#F9F4EC]/30 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4.5">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.fullName}
                          className="w-9 h-9 rounded-full border border-brand-green/20"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-brand-green-pale text-brand-green border border-brand-green/20 flex items-center justify-center font-bold">
                          {user.fullName.substring(0, 1).toUpperCase()}
                        </div>
                      )}
                    </td>

                    <td className="p-4.5 font-bold text-[#1A1A1A] dark:text-stone-200">
                      {user.fullName}
                    </td>

                    <td className="p-4.5 text-[#5A5A5A] dark:text-stone-400 font-mono text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#5A5A5A]/60" />
                        {user.email}
                      </div>
                    </td>

                    <td className="p-4.5 text-[#5A5A5A] dark:text-stone-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#5A5A5A]/60" />
                        {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                      </div>
                    </td>

                    <td className="p-4.5">
                      <select
                        disabled={actionLoadingId === user.id}
                        value={user.role}
                        onChange={(e) => handleUpdateUser(user.id, 'role', e.target.value)}
                        className={`px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider border rounded-none bg-white dark:bg-stone-900 cursor-pointer ${
                          user.role === 'admin' ? 'text-amber-800 border-amber-300 bg-amber-50 dark:text-amber-450 dark:border-amber-950 dark:bg-amber-950/20' :
                          user.role === 'manager' ? 'text-indigo-800 border-indigo-300 bg-indigo-50 dark:text-indigo-450 dark:border-indigo-950 dark:bg-indigo-950/20' :
                          user.role === 'staff' ? 'text-blue-800 border-blue-200 bg-blue-50 dark:text-blue-450 dark:border-blue-950 dark:bg-blue-950/20' :
                          user.role === 'vip' ? 'text-cyan-800 border-cyan-300 bg-cyan-50 dark:text-cyan-450 dark:border-cyan-950 dark:bg-cyan-950/20' :
                          'text-stone-700 border-stone-300 bg-stone-50 dark:text-stone-400 dark:border-stone-850 dark:bg-stone-950'
                        }`}
                      >
                        <option value="customer">Customer</option>
                        <option value="vip">VIP</option>
                        <option value="staff">Staff</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    <td className="p-4.5">
                      <select
                        disabled={actionLoadingId === user.id}
                        value={user.vipLevel}
                        onChange={(e) => handleUpdateUser(user.id, 'vipLevel', e.target.value)}
                        className={`px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider border rounded-none bg-white dark:bg-stone-900 cursor-pointer ${
                          user.vipLevel === 'diamond' ? 'text-cyan-800 border-cyan-300 bg-cyan-50 dark:text-cyan-450 dark:border-cyan-950 dark:bg-cyan-950/20' :
                          user.vipLevel === 'gold' ? 'text-amber-700 border-amber-300 bg-amber-50 dark:text-amber-450 dark:border-amber-950 dark:bg-amber-950/20' :
                          user.vipLevel === 'silver' ? 'text-stone-600 border-stone-300 bg-stone-50 dark:text-stone-400 dark:border-stone-850 dark:bg-stone-950' :
                          'text-emerald-800 border-emerald-300 bg-emerald-50 dark:text-emerald-450 dark:border-emerald-950 dark:bg-emerald-950/10'
                        }`}
                      >
                        <option value="normal">Normal</option>
                        <option value="silver">Silver</option>
                        <option value="gold">Gold</option>
                        <option value="diamond">Diamond</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
