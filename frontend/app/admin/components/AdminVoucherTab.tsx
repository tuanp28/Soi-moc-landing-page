'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ToggleLeft, 
  ToggleRight, 
  Search, 
  X, 
  AlertCircle,
  Loader2,
  Tag
} from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

interface CouponData {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscountAmount: number | null;
  usageLimit: number | null;
  usedCount: number;
  limitPerUser: number | null;
  startDate: string;
  expiryDate: string;
  isActive: boolean;
}

interface CouponFormData {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscountAmount: number | null;
  usageLimit: number | null;
  limitPerUser: number | null;
  startDate: string;
  expiryDate: string;
  isActive: boolean;
}

const emptyCoupon: CouponFormData = {
  id: '',
  code: '',
  discountType: 'percentage',
  discountValue: 10,
  minOrderValue: 0,
  maxDiscountAmount: null,
  usageLimit: null,
  limitPerUser: 1,
  startDate: new Date().toISOString().substring(0, 16), // datetime-local format
  expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 16),
  isActive: true
};

export function AdminVoucherTab() {
  const { session, profile } = useAuth();
  const isStaff = profile?.role === 'staff';
  const [coupons, setCoupons] = useState<CouponData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState(emptyCoupon);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const fetchCoupons = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const response = await fetch('/api/admin/coupons', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setCoupons(data.coupons);
      }
    } catch (err) {
      console.error('Error fetching admin coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [session]);

  const handleOpenCreate = () => {
    setFormData(emptyCoupon);
    setFormMode('create');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: CouponData) => {
    setFormData({
      id: c.id,
      code: c.code,
      discountType: c.discountType,
      discountValue: c.discountValue,
      minOrderValue: c.minOrderValue,
      maxDiscountAmount: c.maxDiscountAmount,
      usageLimit: c.usageLimit,
      limitPerUser: c.limitPerUser || 1,
      startDate: new Date(c.startDate).toISOString().substring(0, 16),
      expiryDate: new Date(c.expiryDate).toISOString().substring(0, 16),
      isActive: c.isActive
    });
    setFormMode('edit');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleToggleActive = async (c: CouponData) => {
    if (!session) return;
    try {
      const response = await fetch('/api/admin/coupons', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ id: c.id, isActive: !c.isActive }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setCoupons(prev => prev.map(item => item.id === c.id ? { ...item, isActive: !c.isActive } : item));
      }
    } catch (err) {
      console.error('Error toggling active:', err);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!session || !window.confirm('Bạn có chắc chắn muốn XÓA VĨNH VIỄN mã giảm giá này?')) return;
    try {
      const response = await fetch(`/api/admin/coupons?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setCoupons(prev => prev.filter(c => c.id !== id));
      } else {
        alert(data.error || 'Xóa mã giảm giá thất bại.');
      }
    } catch (err) {
      console.error('Error deleting coupon:', err);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setFormSubmitting(true);
    setFormError(null);

    if (!formData.code.trim() || formData.discountValue === undefined) {
      setFormError('Vui lòng điền mã code và giá trị giảm.');
      setFormSubmitting(false);
      return;
    }

    try {
      const url = '/api/admin/coupons';
      const method = formMode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setIsModalOpen(false);
        fetchCoupons(); // Refresh
      } else {
        setFormError(data.error || 'Lưu voucher thất bại.');
      }
    } catch (err) {
      console.error('Submit coupon error:', err);
      setFormError('Lỗi kết nối đến máy chủ.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#2D5A27]/10 dark:border-white/10 pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#1A1A1A] dark:text-white font-sans uppercase">
            Quản lý Mã Giảm Giá
          </h2>
          <p className="text-xs text-brand-muted mt-1">Tạo các chương trình khuyến mãi, thiết lập mã coupon giảm giá và theo dõi lượt sử dụng.</p>
        </div>

        {!isStaff && (
          <button
            onClick={handleOpenCreate}
            className="w-fit flex items-center justify-center gap-2 px-5 py-3 bg-[#2D5A27] hover:bg-[#20401b] dark:bg-brand-green-light dark:hover:bg-brand-green text-white dark:text-stone-900 text-xs font-bold tracking-wider uppercase hover:shadow-xs active:scale-95 transition-all cursor-pointer rounded-none"
          >
            <Plus className="w-4 h-4" />
            Tạo mã Voucher mới
          </button>
        )}
      </div>

      {/* Search bar */}
      <div className="bg-white dark:bg-[#171E15] border border-[#2D5A27]/10 dark:border-white/10 p-6 flex items-center shadow-xs">
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#5A5A5A]/60 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm voucher theo mã CODE..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#F9F4EC]/40 dark:bg-stone-900 border border-[#2D5A27]/10 dark:border-white/10 text-sm text-[#1A1A1A] dark:text-stone-200 outline-none rounded-none"
          />
        </div>
      </div>

      {/* Table view */}
      <div className="bg-white dark:bg-[#171E15] border border-[#2D5A27]/10 dark:border-white/10 overflow-hidden shadow-md">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-10 h-10 text-[#2D5A27] animate-spin" />
            <p className="text-xs font-black tracking-widest text-[#5A5A5A] uppercase font-mono">
              Đang tải danh sách mã giảm giá...
            </p>
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="py-24 text-center text-[#5A5A5A]/60 uppercase tracking-wider text-xs font-mono">
            Không tìm thấy mã giảm giá nào.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#2D5A27]/5 dark:bg-[#2D5A27]/10 border-b border-[#2D5A27]/10 dark:border-white/10 text-[10px] font-bold tracking-wider text-[#5A5A5A] dark:text-stone-400 uppercase font-sans">
                  <th className="p-4.5">Mã Code</th>
                  <th className="p-4.5">Mức Giảm</th>
                  <th className="p-4.5">Yêu cầu tối thiểu</th>
                  <th className="p-4.5">Lượt Dùng</th>
                  <th className="p-4.5">Thời Gian Chạy</th>
                  <th className="p-4.5">Trạng Thái</th>
                  {!isStaff && <th className="p-4.5 text-right">Thao Tác</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2D5A27]/5 dark:divide-white/5 text-xs">
                {filteredCoupons.map((c) => (
                  <tr key={c.id} className="hover:bg-[#F9F4EC]/30 dark:hover:bg-white/5 transition-colors">
                    {/* Code */}
                    <td className="p-4.5 font-bold font-mono text-[#2D5A27] dark:text-brand-green-light flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5" />
                      {c.code}
                    </td>

                    {/* Value */}
                    <td className="p-4.5 font-bold">
                      {c.discountType === 'percentage' 
                        ? `${c.discountValue}%` 
                        : `${c.discountValue.toLocaleString('vi-VN')}đ`
                      }
                      {c.maxDiscountAmount && (
                        <div className="text-[9px] text-brand-muted font-normal font-mono">
                          (Tối đa: {c.maxDiscountAmount.toLocaleString('vi-VN')}đ)
                        </div>
                      )}
                    </td>

                    {/* Min Order Value */}
                    <td className="p-4.5 font-sans">
                      {c.minOrderValue > 0 
                        ? `${c.minOrderValue.toLocaleString('vi-VN')}đ` 
                        : 'Không có'
                      }
                    </td>

                    {/* Usage count */}
                    <td className="p-4.5 font-sans">
                      {c.usedCount}
                      {c.usageLimit && ` / ${c.usageLimit}`}
                      <div className="text-[8px] text-brand-muted">lượt sử dụng</div>
                    </td>

                    {/* Validity dates */}
                    <td className="p-4.5 text-[10px] text-stone-600 dark:text-stone-400">
                      <div>Từ: {new Date(c.startDate).toLocaleString('vi-VN')}</div>
                      <div>Đến: {new Date(c.expiryDate).toLocaleString('vi-VN')}</div>
                    </td>

                    {/* Status toggler */}
                    <td className="p-4.5">
                      <button 
                        disabled={isStaff}
                        onClick={() => handleToggleActive(c)}
                        className={`flex items-center gap-1 transition-colors ${
                          isStaff ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'
                        } ${
                          c.isActive && new Date(c.expiryDate) > new Date() ? 'text-brand-green' : 'text-stone-400'
                        }`}
                      >
                        {c.isActive && new Date(c.expiryDate) > new Date() ? (
                          <>
                            <ToggleRight className="w-7 h-7" />
                            <span className="text-[10px] font-bold uppercase font-sans">Đang Kích Hoạt</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-7 h-7" />
                            <span className="text-[10px] font-bold uppercase font-sans">Vô Hiệu Hóa</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Action buttons */}
                    {!isStaff && (
                      <td className="p-4.5 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleOpenEdit(c)}
                            className="p-2 border border-[#2D5A27]/10 dark:border-white/10 hover:border-brand-green hover:text-brand-green text-stone-600 dark:text-stone-300 transition-all cursor-pointer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCoupon(c.id)}
                            className="p-2 border border-rose-200 dark:border-rose-950/40 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-400 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#F9F4EC] dark:bg-[#111510] text-[#1A1A1A] dark:text-stone-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#2D5A27]/20 dark:border-white/15 shadow-2xl relative font-sans">
            
            <div className="flex items-center justify-between border-b border-[#2D5A27]/10 dark:border-white/10 p-6">
              <h3 className="text-lg font-bold font-serif uppercase tracking-wider text-[#2D5A27] dark:text-brand-green-light">
                {formMode === 'create' ? 'Tạo Voucher mới' : 'Chỉnh sửa Voucher'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mx-6 mt-6 p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Code */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-brand-muted tracking-wider mb-1">Mã Giảm Giá (Code)</label>
                  <input
                    type="text"
                    placeholder="vd: SOIMOC100K, EATCLEAN15"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                    className="w-full px-4.5 py-3 bg-white dark:bg-stone-900 border border-[#2D5A27]/10 dark:border-white/10 outline-none text-sm font-bold font-mono uppercase"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-brand-muted tracking-wider mb-1">Loại Giảm Giá</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData(prev => ({ ...prev, discountType: e.target.value as any }))}
                    className="w-full px-4 py-3 bg-white dark:bg-stone-900 border border-[#2D5A27]/10 dark:border-white/10 outline-none text-xs cursor-pointer"
                  >
                    <option value="percentage">Phần trăm (%)</option>
                    <option value="fixed">Số tiền mặt định mức (VNĐ)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Value */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-brand-muted tracking-wider mb-1">Giá trị giảm</label>
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData(prev => ({ ...prev, discountValue: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 bg-white dark:bg-stone-900 border border-[#2D5A27]/10 dark:border-white/10 outline-none text-xs font-mono"
                  />
                </div>

                {/* Min Order Value */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-brand-muted tracking-wider mb-1">Giá trị đơn tối thiểu (VNĐ)</label>
                  <input
                    type="number"
                    value={formData.minOrderValue}
                    onChange={(e) => setFormData(prev => ({ ...prev, minOrderValue: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 bg-white dark:bg-stone-900 border border-[#2D5A27]/10 dark:border-white/10 outline-none text-xs font-mono"
                  />
                </div>

                {/* Max Discount Amount */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-brand-muted tracking-wider mb-1">Mức giảm tối đa (VNĐ)</label>
                  <input
                    type="number"
                    placeholder="Không giới hạn"
                    value={formData.maxDiscountAmount || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxDiscountAmount: e.target.value ? parseFloat(e.target.value) : null }))}
                    className="w-full px-4 py-3 bg-white dark:bg-stone-900 border border-[#2D5A27]/10 dark:border-white/10 outline-none text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Usage limit */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-brand-muted tracking-wider mb-1">Tổng lượt dùng tối đa</label>
                  <input
                    type="number"
                    placeholder="Không giới hạn"
                    value={formData.usageLimit || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: e.target.value ? parseInt(e.target.value) : null }))}
                    className="w-full px-4 py-3 bg-white dark:bg-stone-900 border border-[#2D5A27]/10 dark:border-white/10 outline-none text-xs font-mono"
                  />
                </div>

                {/* Limit per user */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-brand-muted tracking-wider mb-1">Giới hạn / Người dùng</label>
                  <input
                    type="number"
                    placeholder="vd: 1"
                    value={formData.limitPerUser || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, limitPerUser: e.target.value ? parseInt(e.target.value) : null }))}
                    className="w-full px-4 py-3 bg-white dark:bg-stone-900 border border-[#2D5A27]/10 dark:border-white/10 outline-none text-xs font-mono"
                  />
                </div>

                {/* Active check */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-brand-muted tracking-wider mb-3">Kích hoạt ngay</label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="w-4.5 h-4.5 accent-brand-green border border-stone-300 outline-none cursor-pointer"
                    />
                    Cho phép áp dụng mã này
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-[#2D5A27]/10 dark:border-white/10 pt-6">
                {/* Start Date */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-brand-muted tracking-wider mb-1">Ngày bắt đầu áp dụng</label>
                  <input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-4 py-3 bg-white dark:bg-stone-900 border border-[#2D5A27]/10 dark:border-white/10 outline-none text-xs"
                  />
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-brand-muted tracking-wider mb-1">Ngày kết thúc (Hết hạn)</label>
                  <input
                    type="datetime-local"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                    className="w-full px-4 py-3 bg-white dark:bg-stone-900 border border-[#2D5A27]/10 dark:border-white/10 outline-none text-xs"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-[#2D5A27]/10 dark:border-white/10 pt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 border border-stone-300 dark:border-stone-750 bg-white dark:bg-stone-950 text-xs font-black uppercase tracking-widest hover:bg-stone-50 transition-colors rounded-none cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="flex items-center gap-2 px-6 py-3 bg-[#2D5A27] hover:bg-[#20401b] text-white text-xs font-black uppercase tracking-widest transition-colors rounded-none disabled:opacity-50 cursor-pointer"
                >
                  {formSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Lưu Voucher
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
