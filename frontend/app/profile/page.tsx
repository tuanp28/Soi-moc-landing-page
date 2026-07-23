'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';
import { supabase } from '@/src/lib/supabase';
import { LogOut, User as UserIcon, Calendar, Mail, ShieldCheck, ShoppingBag, Eye, Award, ExternalLink, Gift, Lock, CheckCircle, Copy, Sparkles, Clock, Crown, Gem, Camera, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_note: string | null;
  payment_method: string;
  payment_status: string;
  order_status: string;
  total_amount: number;
  created_at: string;
}

export default function ProfilePage() {
  const { user, profile, session, signOut, refreshProfile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Anniversary simulation and claims states
  const [simulatedDaysAgo, setSimulatedDaysAgo] = useState<number>(0);
  const [claimingMilestone, setClaimingMilestone] = useState<string | null>(null);
  const [copiedMilestone, setCopiedMilestone] = useState<string | null>(null);
  const [claimSuccessData, setClaimSuccessData] = useState<{
    milestone: string;
    voucherCode: string;
    giftDescription: string;
  } | null>(null);

  // Coupon storage states
  interface Coupon {
    id: string;
    code: string;
    discountType: string;
    discountValue: number;
    minOrderValue: number;
    maxDiscountAmount: number | null;
    limitPerUser: number | null;
    expiryDate: string;
    isUsed?: boolean;
  }
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loadingCoupons, setLoadingCoupons] = useState(true);
  const [copiedCouponCode, setCopiedCouponCode] = useState<string | null>(null);

  // Points redemption states
  const [redeemingOption, setRedeemingOption] = useState<number | null>(null);
  const [redeemSuccessVoucher, setRedeemSuccessVoucher] = useState<string | null>(null);
  const [redeemError, setRedeemError] = useState<string | null>(null);

  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2097152) {
      alert('Dung lượng ảnh đại diện không được vượt quá 2MB.');
      return;
    }

    setUploadingAvatar(true);
    try {
      const fileExt = file.name.split('.').pop();
      const randomName = Math.random().toString(36).substring(2);
      const fileName = `${user?.id || 'user'}_${randomName}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        throw new Error(`Lỗi tải lên: ${uploadError.message}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const response = await fetch('/api/profile/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          avatarUrl: publicUrl
        })
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Cập nhật ảnh đại diện thất bại.');
      }

      await refreshProfile();
      alert('Cập nhật ảnh đại diện thành công!');
    } catch (err: any) {
      console.error('Error uploading avatar:', err);
      alert(err.message || 'Có lỗi xảy ra khi cập nhật ảnh đại diện.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Parse user metadata & date details
  const fullName = profile?.fullName || user?.user_metadata?.full_name || 'Khách hàng Sợi Mộc';
  const email = profile?.email || user?.email || 'N/A';
  const userId = profile?.id || user?.id || 'N/A';
  const role = profile?.role || 'customer';
  const vipLevel = profile?.vipLevel || 'normal';
  const avatarUrl = profile?.avatarUrl || user?.user_metadata?.avatar_url || null;

  // Calculate effective registration date based on simulation state
  const effectiveCreatedAt = (simulatedDaysAgo > 0)
    ? new Date(Date.now() - simulatedDaysAgo * 24 * 60 * 60 * 1000)
    : (profile?.createdAt ? new Date(profile.createdAt) : (user?.created_at ? new Date(user.created_at) : new Date()));

  const joinDate = effectiveCreatedAt.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const now = new Date();
  const diffTime = Math.abs(now.getTime() - effectiveCreatedAt.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Calculate total spent on completed orders
  const completedOrders = orders.filter(o => o.order_status === 'completed');
  const totalSpent = completedOrders.reduce((sum, order) => sum + order.total_amount, 0);

  // VIP upgrade levels configuration
  const VIP_TIERS = {
    silver: 500000,
    gold: 1500000,
    diamond: 3000000
  };

  // Determine next tier status
  let nextTier = 'silver';
  let targetSpend = VIP_TIERS.silver;
  let currentTierLabel = 'Tiêu chuẩn (Normal)';
  let nextTierLabel = 'Thành viên Bạc (Silver)';

  if (vipLevel === 'diamond') {
    nextTier = 'max';
    targetSpend = VIP_TIERS.diamond;
    currentTierLabel = 'Thành viên Kim Cương (Diamond)';
    nextTierLabel = '';
  } else if (vipLevel === 'gold') {
    nextTier = 'diamond';
    targetSpend = VIP_TIERS.diamond;
    currentTierLabel = 'Thành viên Vàng (Gold)';
    nextTierLabel = 'Thành viên Kim Cương (Diamond)';
  } else if (vipLevel === 'silver') {
    nextTier = 'gold';
    targetSpend = VIP_TIERS.gold;
    currentTierLabel = 'Thành viên Bạc (Silver)';
    nextTierLabel = 'Thành viên Vàng (Gold)';
  }

  // Calculate progress percent to next tier
  const progressPercent = Math.min((totalSpent / targetSpend) * 100, 100);
  const remainingSpend = Math.max(targetSpend - totalSpent, 0);

  const handleClaimGift = async (milestone: string) => {
    if (!session) return;
    setClaimingMilestone(milestone);
    try {
      const payload: any = { milestone };
      if (simulatedDaysAgo > 0) {
        payload.simulatedCreatedAt = effectiveCreatedAt.toISOString();
      }
      
      const response = await fetch('/api/profile/claim-gift', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      if (response.ok && data.success) {
        setClaimSuccessData({
          milestone,
          voucherCode: data.voucherCode,
          giftDescription: data.giftDescription
        });
        await refreshProfile();
      } else {
        alert(data.error || 'Có lỗi xảy ra khi nhận quà.');
      }
    } catch (err) {
      console.error('Error claiming gift:', err);
      alert('Lỗi kết nối hệ thống.');
    } finally {
      setClaimingMilestone(null);
    }
  };

  const handleCopyVoucher = (code: string, milestone: string) => {
    navigator.clipboard.writeText(code);
    setCopiedMilestone(milestone);
    setTimeout(() => {
      setCopiedMilestone(null);
    }, 2000);
  };

  // Card Number simulation based on UUID hash
  const cardNumber = `SM-${userId.substring(0, 4)}-${userId.substring(9, 13)}-${userId.substring(19, 23)}`.toUpperCase();

  // Dynamic card colors & labels based on VIP Level
  const getVipCardStyles = (level: string) => {
    switch (level) {
      case 'diamond':
        return {
          gradient: 'from-[#0f172a] via-[#1e293b] to-[#0f172a] border-cyan-500/30',
          badgeBg: 'bg-cyan-500/20 border-cyan-400/40 text-cyan-200',
          badgeText: 'Kim Cương',
          highlightText: 'Giảm 15% tất cả đơn hàng',
          goldHighlight: 'text-cyan-400',
          glowColor: 'rgba(6,182,212,0.15)'
        };
      case 'gold':
        return {
          gradient: 'from-[#2d1e08] via-[#523d1c] to-[#2d1e08] border-[#C8953A]/30',
          badgeBg: 'bg-[#C8953A]/25 border-[#C8953A]/40 text-[#FAF6EE]',
          badgeText: 'Vàng',
          highlightText: 'Giảm 10% tất cả đơn hàng',
          goldHighlight: 'text-[#C8953A]',
          glowColor: 'rgba(200,149,58,0.25)'
        };
      case 'silver':
        return {
          gradient: 'from-[#27272a] via-[#3f3f46] to-[#27272a] border-stone-400/30',
          badgeBg: 'bg-stone-500/20 border-stone-400/40 text-stone-200',
          badgeText: 'Bạc',
          highlightText: 'Giảm 5% tất cả đơn hàng',
          goldHighlight: 'text-stone-300',
          glowColor: 'rgba(214,211,209,0.15)'
        };
      default:
        return {
          gradient: 'from-[#1a3817] via-[#2D5A27] to-[#142812] border-brand-green/20',
          badgeBg: 'bg-emerald-500/20 border-emerald-400/30 text-emerald-250',
          badgeText: 'Tiêu Chuẩn',
          highlightText: 'Tích điểm thành viên',
          goldHighlight: 'text-emerald-400',
          glowColor: 'rgba(52,211,153,0.15)'
        };
    }
  };

  const cardStyle = getVipCardStyles(vipLevel);

  // Fetch past orders from backend API
  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!session) return;
      setLoadingOrders(true);
      try {
        const response = await fetch('/api/orders', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });
        if (response.ok) {
          const resData = await response.json();
          setOrders(resData.orders || []);
        } else {
          throw new Error('Failed to fetch orders from API');
        }
      } catch (err) {
        console.error('Failed to fetch user orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchUserOrders();
  }, [session]);

  // Fetch coupons from backend API
  useEffect(() => {
    const fetchCoupons = async () => {
      if (!session) return;
      setLoadingCoupons(true);
      try {
        const response = await fetch('/api/coupons', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });
        if (response.ok) {
          const resData = await response.json();
          setCoupons(resData.coupons || []);
        }
      } catch (err) {
        console.error('Failed to fetch coupons:', err);
      } finally {
        setLoadingCoupons(false);
      }
    };

    fetchCoupons();
  }, [session, profile?.claimedGifts]);

  const handleCancelOrder = async (orderId: string) => {
    if (!session) return;
    if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) return;

    try {
      const response = await fetch('/api/orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          orderId,
          field: 'order_status',
          status: 'cancelled'
        })
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        setOrders(prev =>
          prev.map(o => (o.id === orderId ? { ...o, order_status: 'cancelled' } : o))
        );
        alert('Hủy đơn hàng thành công!');
      } else {
        alert('Hủy đơn hàng thất bại: ' + (resData.error || 'Lỗi không xác định'));
      }
    } catch (err) {
      console.error('Failed to cancel order:', err);
      alert('Không thể kết nối đến máy chủ.');
    }
  };

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCouponCode(code);
    setTimeout(() => {
      setCopiedCouponCode(null);
    }, 2000);
  };

  const handleRedeemPoints = async (option: number) => {
    if (!session) return;
    setRedeemingOption(option);
    setRedeemError(null);
    setRedeemSuccessVoucher(null);
    try {
      const response = await fetch('/api/profile/redeem-points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ option })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setRedeemSuccessVoucher(data.coupon.code);
        await refreshProfile();
        // Refresh coupons list
        const resC = await fetch('/api/coupons', {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        });
        if (resC.ok) {
          const dataC = await resC.json();
          setCoupons(dataC.coupons || []);
        }
      } else {
        setRedeemError(data.error || 'Quy đổi điểm thưởng thất bại.');
      }
    } catch (err) {
      console.error('Error redeeming points:', err);
      setRedeemError('Lỗi hệ thống khi quy đổi.');
    } finally {
      setRedeemingOption(null);
    }
  };

  const getClaimedVouchers = () => {
    if (!profile?.claimedGifts) return [];
    const claimedList = profile.claimedGifts.split(',').map((s: string) => s.trim()).filter(Boolean);
    
    return claimedList.map((milestone: string) => {
      if (milestone === '1_month') {
        return {
          code: 'SM1MONTH',
          name: 'Voucher Kỷ Niệm 1 Tháng',
          description: 'Giảm giá 20.000đ khi mua hàng.',
          expiry: 'Vĩnh viễn',
          milestone
        };
      }
      if (milestone === '6_months') {
        return {
          code: 'SM6MONTHS',
          name: 'Voucher Kỷ Niệm 6 Tháng',
          description: 'Giảm giá 50.000đ khi đặt hàng.',
          expiry: 'Vĩnh viễn',
          milestone
        };
      }
      if (milestone === '1_year') {
        let code = 'SM1YEAR';
        let desc = 'Voucher 100K chúc mừng thành viên';
        if (vipLevel === 'diamond') {
          code = 'SM1YEAR_DIAMOND';
          desc = 'Voucher 300K chúc mừng thành viên Kim Cương';
        } else if (vipLevel === 'gold') {
          code = 'SM1YEAR_GOLD';
          desc = 'Voucher 200K chúc mừng thành viên Vàng';
        } else if (vipLevel === 'silver') {
          code = 'SM1YEAR_SILVER';
          desc = 'Voucher 100K chúc mừng thành viên Bạc';
        }
        return {
          code,
          name: 'Voucher Kỷ Niệm 1 Năm',
          description: desc,
          expiry: 'Vĩnh viễn',
          milestone
        };
      }
      return null;
    }).filter(Boolean);
  };

  const getOrderStatusLabel = (status: string) => {
    switch (status) {
      case 'waiting_confirm': return 'Chờ xác nhận';
      case 'confirmed': return 'Đã xác nhận';
      case 'shipping': return 'Đang giao hàng';
      case 'completed': return 'Thành công';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'waiting_confirm': return 'bg-amber-50 text-amber-800 border-amber-250';
      case 'confirmed': return 'bg-sky-50 text-sky-850 border-sky-200';
      case 'shipping': return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'completed': return 'bg-emerald-50 text-emerald-850 border-emerald-250';
      case 'cancelled': return 'bg-rose-50 text-rose-800 border-rose-250';
      default: return 'bg-neutral-50 text-neutral-800 border-neutral-200';
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-[85vh] bg-[#F9F4EC] py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-5 md:px-10 space-y-10">
          
          {/* Header row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#2D5A27]/10 pb-6">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full border-2 border-[#2D5A27]/25 overflow-hidden group bg-[#2D5A27]/5 flex items-center justify-center text-[#2D5A27]">
                {uploadingAvatar ? (
                  <Loader2 className="w-6 h-6 animate-spin text-[#2D5A27]" />
                ) : avatarUrl ? (
                  <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-8 h-8" />
                )}
                
                {/* Camera icon hover overlay */}
                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-white text-[8px] font-black uppercase tracking-wider select-none">
                  <Camera className="w-4 h-4 mb-0.5" />
                  <span>Đổi ảnh</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={uploadingAvatar}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[#1A1A1A] font-serif uppercase">
                  HỒ SƠ CỦA BẠN
                </h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[10px] font-black tracking-widest text-emerald-800 uppercase font-mono">
                    TÀI KHOẢN HOẠT ĐỘNG
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={signOut}
              className="inline-flex items-center gap-2 px-5 py-3 border border-rose-200 hover:bg-rose-50 hover:border-rose-300 text-rose-800 font-extrabold text-[10px] tracking-widest uppercase transition-all duration-300 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Đăng Xuất
            </button>
          </div>

          {/* Lưới 2 cột: Cột 1 (Thông tin thành viên & Thẻ), Cột 2 (Lịch sử đơn hàng) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Cột Trái (5 cols): Thẻ Club & Thông tin tài khoản */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Premium Club Card */}
              <motion.div
                initial={{ rotateY: -10, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className={`w-full aspect-[1.586/1] bg-gradient-to-br ${cardStyle.gradient} text-white p-6 md:p-8 relative overflow-hidden shadow-2xl flex flex-col justify-between border`}
                style={{ boxShadow: `0 25px 50px -12px ${cardStyle.glowColor}` }}
              >
                {/* Gloss sheen effect */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_60%)] pointer-events-none" />
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />

                <div className="flex justify-between items-start z-10">
                  <div className="space-y-1">
                    <p className={`text-[9px] font-black tracking-widest ${cardStyle.goldHighlight} uppercase font-mono`}>
                      SỢI MỘC CLUB MEMBER
                    </p>
                    <h2 className="text-xl font-bold font-serif tracking-tight">Sợi Mộc</h2>
                  </div>
                  
                  {/* VIP Badge */}
                  <div className={`flex items-center gap-1.5 ${cardStyle.badgeBg} border px-2.5 py-1 text-[8px] font-black tracking-wider uppercase font-mono`}>
                    <Award className={`w-3.5 h-3.5 ${cardStyle.goldHighlight}`} />
                    {cardStyle.badgeText}
                  </div>
                </div>

                {/* Card Number */}
                <div className="my-auto z-10">
                  <p className="font-mono text-base md:text-lg tracking-widest text-stone-100/90 font-bold select-all">
                    {cardNumber}
                  </p>
                </div>

                <div className="flex justify-between items-end z-10">
                  <div>
                    <p className="text-[8px] text-white/50 uppercase tracking-widest font-mono">Chủ thẻ</p>
                    <p className="text-xs font-extrabold uppercase tracking-wide mt-0.5">{fullName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] text-white/50 uppercase tracking-widest font-mono">Ưu đãi hiện tại</p>
                    <p className={`text-xs font-black ${cardStyle.goldHighlight} mt-0.5`}>{cardStyle.highlightText}</p>
                  </div>
                </div>
              </motion.div>

              {/* Tiến trình thăng cấp VIP */}
              <div className="bg-white border border-[#2D5A27]/10 p-6 md:p-8 shadow-xs space-y-6">
                <div className="flex items-center gap-2 pb-3 border-b border-[#2D5A27]/5">
                  <Award className="w-5 h-5 text-[#2D5A27]" />
                  <h3 className="font-extrabold text-sm uppercase tracking-widest font-mono">
                    Tiến trình thăng cấp VIP
                  </h3>
                </div>

                <div className="space-y-4">
                  {/* Hạng hiện tại và hạng tiếp theo */}
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[8px] text-[#5A5A5A]/70 uppercase tracking-widest font-bold font-mono">Cấp bậc hiện tại</p>
                      <p className="text-xs font-bold text-[#1A1A1A] mt-1">{currentTierLabel}</p>
                    </div>
                    {nextTier !== 'max' && (
                      <div className="text-right">
                        <p className="text-[8px] text-[#C8953A] uppercase tracking-widest font-bold font-mono">Cấp bậc tiếp theo</p>
                        <p className="text-xs font-bold text-[#C8953A] mt-1">{nextTierLabel}</p>
                      </div>
                    )}
                  </div>

                  {/* Tổng chi tiêu tích lũy */}
                  <div className="p-3 bg-[#FAF6EE] dark:bg-[#111510] border border-[#2D5A27]/20 dark:border-white/10 rounded-xs flex justify-between items-center text-xs">
                    <span className="font-medium text-stone-600 dark:text-stone-300 font-sans">Tích lũy hoàn thành:</span>
                    <span className="font-black text-[#2D5A27] dark:text-[#C8953A]">{totalSpent.toLocaleString('vi-VN')}đ</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="relative w-full h-3 bg-stone-200 dark:bg-[#111510] border border-stone-300 dark:border-white/10 rounded-full overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#2D5A27] to-[#C8953A] rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    
                    {nextTier !== 'max' ? (
                      <div className="flex justify-between items-center text-[10px] font-sans">
                        <span className="text-stone-500 dark:text-stone-400 font-medium">Mục tiêu: {targetSpend.toLocaleString('vi-VN')}đ</span>
                        <span className="text-stone-850 dark:text-stone-100 font-bold">Đạt {progressPercent.toFixed(0)}%</span>
                      </div>
                    ) : (
                      <div className="text-center text-[10px] text-emerald-800 dark:text-emerald-350 font-black tracking-wider uppercase font-mono bg-emerald-50 dark:bg-emerald-950/20 py-1 border border-emerald-250 dark:border-emerald-800">
                        Hạng cao nhất đạt được! 👑
                      </div>
                    )}
                  </div>

                  {/* Lời nhắn nâng hạng */}
                  {nextTier !== 'max' && (
                    <p className="text-[11px] text-[#5A5A5A] dark:text-stone-300 font-medium leading-relaxed font-sans border-t border-stone-100 dark:border-white/15 pt-3">
                      Bạn cần mua thêm <strong className="text-emerald-800 dark:text-[#C8953A] font-extrabold">{remainingSpend.toLocaleString('vi-VN')}đ</strong> từ các đơn hàng hoàn thành để nâng lên hạng <strong className="text-[#C8953A] font-extrabold">{nextTierLabel}</strong> và nhận ưu đãi giảm trực tiếp tốt hơn!
                    </p>
                  )}

                  {/* Danh sách các mốc thăng hạng để tham khảo (Bản nâng cấp thẩm mỹ cao) */}
                  <div className="space-y-3 pt-2">
                    <p className="text-[10px] font-black text-[#5A5A5A] dark:text-stone-350 uppercase tracking-widest font-mono text-center">
                      Bảng đặc quyền cấp bậc VIP
                    </p>
                    
                    <div className="space-y-2.5">
                      {/* Cấp Bạc */}
                      <div className="flex items-center justify-between p-2.5 bg-[#FAF6EE]/50 dark:bg-[#111510]/30 border border-stone-200/50 dark:border-white/5 hover:border-stone-300 dark:hover:border-white/10 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 flex items-center justify-center text-stone-500 dark:text-stone-350 shadow-inner">
                            <Award className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-extrabold text-stone-900 dark:text-stone-100">Hạng Bạc (Silver)</p>
                            <p className="text-[9px] text-stone-500 dark:text-stone-400 font-mono font-bold">Tích lũy từ 500.000đ</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400 text-[9px] font-black tracking-wider uppercase font-mono rounded-full">
                          GIẢM 5%
                        </span>
                      </div>

                      {/* Cấp Vàng */}
                      <div className="flex items-center justify-between p-2.5 bg-[#FAF6EE]/50 dark:bg-[#111510]/30 border border-stone-200/50 dark:border-white/5 hover:border-[#C8953A]/20 dark:hover:border-[#C8953A]/30 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-[#2d1e08] border border-[#C8953A]/30 flex items-center justify-center text-[#C8953A] shadow-inner">
                            <Crown className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-extrabold text-stone-900 dark:text-stone-100">Hạng Vàng (Gold)</p>
                            <p className="text-[9px] text-stone-500 dark:text-stone-400 font-mono font-bold">Tích lũy từ 2.000.000đ</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 bg-[#C8953A]/10 border border-[#C8953A]/30 text-[#C8953A] text-[9px] font-black tracking-wider uppercase font-mono rounded-full">
                          GIẢM 10%
                        </span>
                      </div>

                      {/* Cấp Kim Cương */}
                      <div className="flex items-center justify-between p-2.5 bg-[#FAF6EE]/50 dark:bg-[#111510]/30 border border-stone-200/50 dark:border-white/5 hover:border-cyan-500/20 dark:hover:border-cyan-500/30 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-cyan-50 dark:bg-[#0f172a] border border-cyan-500/30 flex items-center justify-center text-cyan-500 shadow-inner">
                            <Gem className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-extrabold text-stone-900 dark:text-stone-100">Hạng Kim Cương (Diamond)</p>
                            <p className="text-[9px] text-stone-500 dark:text-stone-400 font-mono font-bold">Tích lũy từ 5.000.000đ</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 bg-cyan-500/10 border border-cyan-550/30 text-cyan-500 dark:text-cyan-400 text-[9px] font-black tracking-wider uppercase font-mono rounded-full">
                          GIẢM 15%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Điểm Tích Lũy & Đổi Quà */}
              <div className="bg-white border border-[#2D5A27]/10 p-6 md:p-8 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-[#2D5A27]/5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#C8953A]" />
                    <h3 className="font-extrabold text-sm uppercase tracking-widest font-mono">
                      Tích Lũy Điểm Thưởng
                    </h3>
                  </div>
                  <div className="bg-[#2D5A27]/5 border border-[#2D5A27]/20 px-3 py-1 font-mono text-xs font-bold text-[#2D5A27]">
                    {profile?.points || 0} ĐIỂM
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] text-brand-muted leading-relaxed uppercase tracking-wider font-mono">
                    Tích lũy 1 điểm cho mỗi 1.000đ thanh toán đơn hàng. Sử dụng điểm thưởng của bạn để quy đổi lấy các mã giảm giá mua hàng đặc biệt:
                  </p>

                  {redeemError && (
                    <div className="p-3 bg-red-50 text-red-700 text-xs font-bold font-sans">
                      Lỗi: {redeemError}
                    </div>
                  )}

                  {redeemSuccessVoucher && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-2 relative">
                      <p className="font-extrabold uppercase tracking-wide">Quy đổi thành công!</p>
                      <p>Bạn nhận được mã voucher giảm giá:</p>
                      <div className="flex items-center justify-between bg-white border border-emerald-300 p-2 font-mono text-sm font-bold text-[#2D5A27]">
                        <span>{redeemSuccessVoucher}</span>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(redeemSuccessVoucher);
                            alert('Đã sao chép mã giảm giá!');
                          }}
                          className="text-[10px] font-black uppercase text-brand-muted hover:text-[#2D5A27]"
                        >
                          Sao chép
                        </button>
                      </div>
                      <p className="text-[10px] text-brand-muted italic mt-1">*Hạn sử dụng trong vòng 30 ngày kể từ lúc quy đổi.</p>
                      <button 
                        onClick={() => setRedeemSuccessVoucher(null)} 
                        className="absolute top-2 right-2 text-stone-400 hover:text-stone-600 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { points: 150, value: 15000, label: 'Voucher 15k' },
                      { points: 300, value: 35000, label: 'Voucher 35k' },
                      { points: 500, value: 60000, label: 'Voucher 60k' }
                    ].map((pkg) => {
                      const canRedeem = (profile?.points || 0) >= pkg.points;
                      return (
                        <div 
                          key={pkg.points} 
                          className={`p-3 border flex items-center justify-between transition-colors ${
                            canRedeem 
                              ? 'border-[#2D5A27]/20 bg-[#2D5A27]/5 hover:bg-[#2D5A27]/10' 
                              : 'border-stone-105 bg-stone-50/50 opacity-70'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <p className="text-xs font-black uppercase tracking-wider text-brand-charcoal">
                              {pkg.label}
                            </p>
                            <p className="text-[9px] text-brand-muted font-mono">
                              Yêu cầu: {pkg.points} điểm | Hạn dùng 30 ngày
                            </p>
                          </div>
                          <button
                            disabled={!canRedeem || redeemingOption !== null}
                            onClick={() => handleRedeemPoints(pkg.points)}
                            className={`px-3 py-2 text-[9px] font-black tracking-widest uppercase transition-all rounded-none ${
                              canRedeem 
                                ? 'bg-[#2D5A27] text-white hover:bg-[#1D4A17] cursor-pointer' 
                                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                            }`}
                          >
                            {redeemingOption === pkg.points ? 'Đang đổi...' : 'Đổi Quà'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Thông tin tài khoản */}
              <div className="bg-white border border-[#2D5A27]/10 p-6 md:p-8 shadow-xs space-y-5">
                <h3 className="text-xs font-black tracking-widest text-[#5A5A5A] uppercase font-mono border-b border-[#2D5A27]/5 pb-2">
                  Chi tiết tài khoản
                </h3>
                
                <div className="space-y-4 font-sans text-xs">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#2D5A27] shrink-0" />
                    <div>
                      <p className="text-[8px] text-[#5A5A5A]/70 uppercase tracking-wider font-bold">Email đăng nhập</p>
                      <p className="font-semibold text-[#1A1A1A] mt-0.5">{email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-[#2D5A27] shrink-0" />
                    <div>
                      <p className="text-[8px] text-[#5A5A5A]/70 uppercase tracking-wider font-bold">Ngày tham gia</p>
                      <p className="font-semibold text-[#1A1A1A] mt-0.5">{joinDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-[#2D5A27] shrink-0" />
                    <div>
                      <p className="text-[8px] text-[#5A5A5A]/70 uppercase tracking-wider font-bold">Trạng thái xác thực</p>
                      <p className="font-semibold text-emerald-800 mt-0.5">Đã xác minh tài khoản</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hành trình thành viên Sợi Mộc */}
              <div className="bg-white border border-[#2D5A27]/10 p-6 md:p-8 shadow-xs space-y-6">
                <div className="flex items-center gap-2 pb-3 border-b border-[#2D5A27]/5">
                  <Gift className="w-5 h-5 text-[#2D5A27]" />
                  <h3 className="font-extrabold text-sm uppercase tracking-widest font-mono">
                    Hành trình thành viên
                  </h3>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-[#5A5A5A] leading-relaxed font-sans">
                    Tính từ ngày đăng ký tài khoản, bạn đã đồng hành cùng Sợi Mộc được:
                  </p>
                  <p className="text-xl font-bold font-serif text-[#2D5A27]">
                    {diffDays} ngày
                  </p>
                </div>

                {/* Timeline vertical container */}
                <div className="relative border-l border-[#2D5A27]/10 pl-6 ml-3 space-y-8 py-2">
                  
                  {/* Milestone 1: 1 Tháng */}
                  {(() => {
                    const milestone = '1_month';
                    const claimedList = profile?.claimedGifts ? profile.claimedGifts.split(',').map((s: string) => s.trim()) : [];
                    const isClaimed = claimedList.includes(milestone);
                    const isEligible = diffDays >= 30;
                    const isClaimable = !isClaimed && isEligible;
                    const isLocked = !isClaimed && !isEligible;
                    const daysRemaining = 30 - diffDays;

                    return (
                      <div className="relative">
                        {/* Timeline Circle */}
                        <div className={`absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full border-2 bg-white flex items-center justify-center ${
                          isClaimed ? 'border-emerald-600 bg-emerald-50 text-emerald-600' :
                          isClaimable ? 'border-[#C8953A] animate-pulse bg-amber-50 text-[#C8953A]' :
                          'border-stone-300 text-stone-400'
                        }`}>
                          {isClaimed ? (
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <div className={`w-1.5 h-1.5 rounded-full ${isClaimable ? 'bg-[#C8953A]' : 'bg-stone-300'}`} />
                          )}
                        </div>

                        {/* Milestone details */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-extrabold text-xs text-stone-900 uppercase">
                              Mốc: 1 Tháng (30 ngày)
                            </h4>
                            {isClaimed && (
                              <span className="text-[9px] font-black text-emerald-800 tracking-wider uppercase font-mono bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                                Đã nhận
                              </span>
                            )}
                            {isLocked && (
                              <span className="inline-flex items-center gap-1 text-[9px] text-stone-500 font-bold bg-stone-100 px-2 py-0.5 border border-stone-200 uppercase font-mono">
                                <Lock className="w-2.5 h-2.5" />
                                Còn {daysRemaining} ngày
                              </span>
                            )}
                            {isClaimable && (
                              <span className="inline-flex items-center gap-1 text-[9px] text-amber-800 font-black tracking-wider bg-amber-100 px-2 py-0.5 border border-amber-300 uppercase font-mono animate-bounce">
                                Khả dụng
                              </span>
                            )}
                          </div>

                          <p className="text-[11px] text-stone-500 font-medium">
                            Phần quà: Voucher giảm giá 20.000đ khi mua hàng.
                          </p>

                          {isClaimable && (
                            <button
                              onClick={() => handleClaimGift(milestone)}
                              disabled={claimingMilestone !== null}
                              className="mt-1 px-4 py-2 bg-[#C8953A] hover:bg-[#b08130] disabled:bg-stone-300 text-white font-extrabold text-[10px] tracking-widest uppercase transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                            >
                              {claimingMilestone === milestone ? (
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Sparkles className="w-3 h-3" />
                              )}
                              NHẬN QUÀ 1 THÁNG
                            </button>
                          )}

                          {isClaimed && (
                            <div className="mt-1 p-2 bg-[#FAF6EE] border border-stone-200/60 rounded-xs flex items-center justify-between gap-3 max-w-xs">
                              <code className="font-mono text-xs font-bold text-[#2D5A27]">SM1MONTH</code>
                              <button
                                onClick={() => handleCopyVoucher('SM1MONTH', milestone)}
                                className="inline-flex items-center gap-1 text-[9px] font-black text-[#2D5A27] uppercase tracking-wider hover:underline"
                              >
                                <Copy className="w-3 h-3" />
                                {copiedMilestone === milestone ? 'Đã sao chép' : 'Sao chép'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Milestone 2: 6 Tháng */}
                  {(() => {
                    const milestone = '6_months';
                    const claimedList = profile?.claimedGifts ? profile.claimedGifts.split(',').map((s: string) => s.trim()) : [];
                    const isClaimed = claimedList.includes(milestone);
                    const isEligible = diffDays >= 180;
                    const isClaimable = !isClaimed && isEligible;
                    const isLocked = !isClaimed && !isEligible;
                    const daysRemaining = 180 - diffDays;

                    return (
                      <div className="relative">
                        {/* Timeline Circle */}
                        <div className={`absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full border-2 bg-white flex items-center justify-center ${
                          isClaimed ? 'border-emerald-600 bg-emerald-50 text-emerald-600' :
                          isClaimable ? 'border-[#C8953A] animate-pulse bg-amber-50 text-[#C8953A]' :
                          'border-stone-300 text-stone-400'
                        }`}>
                          {isClaimed ? (
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <div className={`w-1.5 h-1.5 rounded-full ${isClaimable ? 'bg-[#C8953A]' : 'bg-stone-300'}`} />
                          )}
                        </div>

                        {/* Milestone details */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-extrabold text-xs text-stone-900 uppercase">
                              Mốc: 6 Tháng (180 ngày)
                            </h4>
                            {isClaimed && (
                              <span className="text-[9px] font-black text-emerald-800 tracking-wider uppercase font-mono bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                                Đã nhận
                              </span>
                            )}
                            {isLocked && (
                              <span className="inline-flex items-center gap-1 text-[9px] text-stone-500 font-bold bg-stone-100 px-2 py-0.5 border border-stone-200 uppercase font-mono">
                                <Lock className="w-2.5 h-2.5" />
                                Còn {daysRemaining} ngày
                              </span>
                            )}
                            {isClaimable && (
                              <span className="inline-flex items-center gap-1 text-[9px] text-amber-800 font-black tracking-wider bg-amber-100 px-2 py-0.5 border border-amber-300 uppercase font-mono animate-bounce">
                                Khả dụng
                              </span>
                            )}
                          </div>

                          <p className="text-[11px] text-stone-500 font-medium">
                            Phần quà: Voucher giảm giá 50.000đ khi đặt hàng.
                          </p>

                          {isClaimable && (
                            <button
                              onClick={() => handleClaimGift(milestone)}
                              disabled={claimingMilestone !== null}
                              className="mt-1 px-4 py-2 bg-[#C8953A] hover:bg-[#b08130] disabled:bg-stone-300 text-white font-extrabold text-[10px] tracking-widest uppercase transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                            >
                              {claimingMilestone === milestone ? (
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Sparkles className="w-3 h-3" />
                              )}
                              NHẬN QUÀ 6 THÁNG
                            </button>
                          )}

                          {isClaimed && (
                            <div className="mt-1 p-2 bg-[#FAF6EE] border border-stone-200/60 rounded-xs flex items-center justify-between gap-3 max-w-xs">
                              <code className="font-mono text-xs font-bold text-[#2D5A27]">SM6MONTHS</code>
                              <button
                                onClick={() => handleCopyVoucher('SM6MONTHS', milestone)}
                                className="inline-flex items-center gap-1 text-[9px] font-black text-[#2D5A27] uppercase tracking-wider hover:underline"
                              >
                                <Copy className="w-3 h-3" />
                                {copiedMilestone === milestone ? 'Đã sao chép' : 'Sao chép'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Milestone 3: 1 Năm */}
                  {(() => {
                    const milestone = '1_year';
                    const claimedList = profile?.claimedGifts ? profile.claimedGifts.split(',').map((s: string) => s.trim()) : [];
                    const isClaimed = claimedList.includes(milestone);
                    const isEligible = diffDays >= 365;
                    const isClaimable = !isClaimed && isEligible;
                    const isLocked = !isClaimed && !isEligible;
                    const daysRemaining = 365 - diffDays;

                    let oneYearVoucher = 'SM1YEAR';
                    if (vipLevel === 'diamond') oneYearVoucher = 'SM1YEAR_DIAMOND';
                    else if (vipLevel === 'gold') oneYearVoucher = 'SM1YEAR_GOLD';
                    else if (vipLevel === 'silver') oneYearVoucher = 'SM1YEAR_SILVER';

                    const getOneYearRewardLabel = (vip: string) => {
                      switch (vip) {
                        case 'diamond': return 'Bộ Hộp Quà Tặng Cao Cấp Diamond Edition + Voucher 300K';
                        case 'gold': return 'Hộp Quà Đặc Biệt Gold Edition + Voucher 200K';
                        case 'silver': return 'Bộ Quà Bạc Silver Edition + Voucher 100K';
                        default: return 'Voucher 100K chúc mừng thành viên';
                      }
                    };

                    return (
                      <div className="relative">
                        {/* Timeline Circle */}
                        <div className={`absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full border-2 bg-white flex items-center justify-center ${
                          isClaimed ? 'border-emerald-600 bg-emerald-50 text-emerald-600' :
                          isClaimable ? 'border-[#C8953A] animate-pulse bg-amber-50 text-[#C8953A]' :
                          'border-stone-300 text-stone-400'
                        }`}>
                          {isClaimed ? (
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <div className={`w-1.5 h-1.5 rounded-full ${isClaimable ? 'bg-[#C8953A]' : 'bg-stone-300'}`} />
                          )}
                        </div>

                        {/* Milestone details */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-extrabold text-xs text-stone-900 uppercase">
                              Mốc: 1 Năm (365 ngày)
                            </h4>
                            {isClaimed && (
                              <span className="text-[9px] font-black text-emerald-800 tracking-wider uppercase font-mono bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                                Đã nhận
                              </span>
                            )}
                            {isLocked && (
                              <span className="inline-flex items-center gap-1 text-[9px] text-stone-500 font-bold bg-stone-100 px-2 py-0.5 border border-stone-200 uppercase font-mono">
                                <Lock className="w-2.5 h-2.5" />
                                Còn {daysRemaining} ngày
                              </span>
                            )}
                            {isClaimable && (
                              <span className="inline-flex items-center gap-1 text-[9px] text-amber-800 font-black tracking-wider bg-amber-100 px-2 py-0.5 border border-amber-300 uppercase font-mono animate-bounce">
                                Khả dụng
                              </span>
                            )}
                          </div>

                          <p className="text-[11px] text-stone-500 font-medium">
                            Phần quà: {getOneYearRewardLabel(vipLevel)}
                          </p>

                          {isClaimable && (
                            <button
                              onClick={() => handleClaimGift(milestone)}
                              disabled={claimingMilestone !== null}
                              className="mt-1 px-4 py-2 bg-[#C8953A] hover:bg-[#b08130] disabled:bg-stone-300 text-white font-extrabold text-[10px] tracking-widest uppercase transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                            >
                              {claimingMilestone === milestone ? (
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Sparkles className="w-3 h-3" />
                              )}
                              NHẬN QUÀ 1 NĂM
                            </button>
                          )}

                          {isClaimed && (
                            <div className="mt-1 p-2 bg-[#FAF6EE] border border-stone-200/60 rounded-xs flex items-center justify-between gap-3 max-w-xs">
                              <code className="font-mono text-xs font-bold text-[#2D5A27]">{oneYearVoucher}</code>
                              <button
                                onClick={() => handleCopyVoucher(oneYearVoucher, milestone)}
                                className="inline-flex items-center gap-1 text-[9px] font-black text-[#2D5A27] uppercase tracking-wider hover:underline"
                              >
                                <Copy className="w-3 h-3" />
                                {copiedMilestone === milestone ? 'Đã sao chép' : 'Sao chép'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                </div>
              </div>

              {/* Bản điều khiển giả lập (chỉ hiển thị ở dev) */}
              {process.env.NODE_ENV !== 'production' && (
                <div className="p-4 bg-amber-50 border border-dashed border-amber-300 text-stone-900 space-y-3">
                  <div className="flex items-center gap-1.5 text-amber-800 font-bold">
                    <Clock className="w-4 h-4" />
                    <span className="text-[10px] font-black tracking-wider uppercase font-mono">BẢN ĐIỀU KHIỂN GIẢ LẬP (DEV ONLY)</span>
                  </div>
                  <p className="text-[10px] text-stone-600 leading-relaxed font-medium">
                    Hãy điều chỉnh tuổi tài khoản để kiểm nghiệm nhanh giao diện nhận quà kỷ niệm mà không cần chờ đợi.
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <label className="text-[10px] font-bold text-stone-700 shrink-0">Giả lập:</label>
                    <select
                      value={simulatedDaysAgo}
                      onChange={(e) => setSimulatedDaysAgo(Number(e.target.value))}
                      className="w-full text-xs p-2 bg-white border border-stone-300 text-stone-855 focus:outline-none focus:border-[#C8953A]"
                    >
                      <option value={0}>Mặc định (Từ cơ sở dữ liệu)</option>
                      <option value={30}>Đã tham gia 30 ngày (Đạt mốc 1 tháng)</option>
                      <option value={185}>Đã tham gia 185 ngày (Đạt mốc 1 & 6 tháng)</option>
                      <option value={370}>Đã tham gia 370 ngày (Đạt cả 3 mốc)</option>
                    </select>
                  </div>
                </div>
              )}

            </div>

            {/* Cột Phải (7 cols): Ví Voucher & Lịch sử đơn hàng */}
            <div className="lg:col-span-7 bg-white border border-[#2D5A27]/10 p-6 md:p-8 shadow-xs flex flex-col justify-between">
              
              <div>
                {/* Ví Voucher & Mã giảm giá */}
                <div className="mb-8 pb-8 border-b border-[#2D5A27]/10">
                  <div className="flex items-center gap-2 mb-6 pb-3 border-b border-[#2D5A27]/5">
                    <Gift className="w-5 h-5 text-[#2D5A27]" />
                    <h3 className="font-extrabold text-sm uppercase tracking-widest font-mono">
                      Ví Voucher & Mã giảm giá
                    </h3>
                  </div>

                  <div className="space-y-6">
                    {/* Nhóm 1: Voucher hành trình thành viên đã nhận */}
                    <div>
                      <h4 className="text-[10px] font-black tracking-widest text-[#5a5a5a] uppercase font-mono mb-3">
                        Voucher hành trình thành viên ({getClaimedVouchers().length})
                      </h4>
                      
                      {getClaimedVouchers().length === 0 ? (
                        <div className="p-4 bg-[#FAF6EE]/50 border border-dashed border-stone-300 text-center text-xs text-stone-500 font-medium">
                          Bạn chưa nhận phần quà kỷ niệm nào. Đạt mốc thời gian tham gia ở mục "Hành trình thành viên" để nhận nhé!
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {getClaimedVouchers().map((voucher: any) => voucher && (
                            <div key={voucher.code} className="bg-gradient-to-br from-[#2D5A27]/5 to-[#2D5A27]/10 border border-[#2D5A27]/15 p-3 flex flex-col justify-between relative overflow-hidden group">
                              {/* ticket dashed border */}
                              <div className="absolute top-0 bottom-0 left-0 w-1 border-r border-dashed border-[#2D5A27]/30" />
                              <div className="pl-3 space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] font-extrabold text-[#2D5A27] uppercase tracking-wide">
                                    {voucher.name}
                                  </span>
                                  <span className="text-[8px] font-black tracking-wider uppercase bg-[#2D5A27]/10 text-[#2D5A27] px-1.5 py-0.5 font-mono">
                                    Hành Trình
                                  </span>
                                </div>
                                <p className="text-[11px] font-bold text-stone-850">{voucher.description}</p>
                                <div className="pt-2 flex justify-between items-center gap-3">
                                  <code className="font-mono text-xs font-black text-[#2D5A27]">{voucher.code}</code>
                                  <button
                                    onClick={() => handleCopyCoupon(voucher.code)}
                                    className="inline-flex items-center gap-1 text-[9px] font-black text-[#2D5A27] uppercase tracking-wider hover:underline cursor-pointer"
                                  >
                                    <Copy className="w-3 h-3" />
                                    {copiedCouponCode === voucher.code ? 'Đã copy' : 'Copy mã'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Nhóm 2: Mã giảm giá công khai đang áp dụng */}
                    <div>
                      <h4 className="text-[10px] font-black tracking-widest text-[#5a5a5a] uppercase font-mono mb-3">
                        Ưu đãi mã giảm giá hiện có ({coupons.length})
                      </h4>

                      {loadingCoupons ? (
                        <div className="py-6 flex flex-col items-center justify-center gap-2">
                          <div className="w-6 h-6 border-2 border-[#2D5A27] border-t-transparent rounded-full animate-spin" />
                          <p className="text-[9px] font-mono font-bold tracking-widest text-[#5A5A5A] uppercase">
                            Đang tải ưu đãi...
                          </p>
                        </div>
                      ) : coupons.length === 0 ? (
                        <div className="p-4 bg-[#FAF6EE]/50 border border-dashed border-stone-300 text-center text-xs text-stone-500 font-medium">
                          Hiện chưa có mã giảm giá công khai nào đang hoạt động.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {coupons.map((coupon) => (
                            <div 
                              key={coupon.id} 
                              className={`p-3 border flex flex-col justify-between relative overflow-hidden group ${
                                coupon.isUsed 
                                  ? 'bg-stone-50 border-stone-200 opacity-60' 
                                  : 'bg-[#FAF6EE] border-amber-900/10 hover:border-[#C8953A]/30 transition-all'
                              }`}
                            >
                              <div className="absolute top-0 bottom-0 left-0 w-1 border-r border-dashed border-stone-300" />
                              <div className="pl-3 space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] font-extrabold text-[#C8953A] uppercase tracking-wide">
                                    {coupon.discountType === 'percentage' ? `Giảm ${coupon.discountValue}%` : `Giảm ${coupon.discountValue.toLocaleString('vi-VN')}đ`}
                                  </span>
                                  {coupon.isUsed ? (
                                    <span className="text-[8px] font-bold tracking-wider uppercase bg-stone-200 text-stone-600 px-1.5 py-0.5 font-mono">
                                      Đã dùng
                                    </span>
                                  ) : (
                                    <span className="text-[8px] font-black tracking-wider uppercase bg-[#C8953A]/10 text-[#C8953A] px-1.5 py-0.5 font-mono">
                                      Mã Công Khai
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] font-bold text-stone-850">
                                  {coupon.discountType === 'percentage' 
                                    ? `Giảm ${coupon.discountValue}% đơn tối thiểu ${coupon.minOrderValue.toLocaleString('vi-VN')}đ${coupon.maxDiscountAmount ? ` (tối đa ${coupon.maxDiscountAmount.toLocaleString('vi-VN')}đ)` : ''}.`
                                    : `Giảm ${coupon.discountValue.toLocaleString('vi-VN')}đ đơn tối thiểu ${coupon.minOrderValue.toLocaleString('vi-VN')}đ.`
                                  }
                                </p>
                                <div className="pt-2 flex justify-between items-center gap-3">
                                  <code className="font-mono text-xs font-black text-[#2D5A27]">{coupon.code}</code>
                                  {coupon.isUsed ? (
                                    <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">
                                      Đã dùng
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => handleCopyCoupon(coupon.code)}
                                      className="inline-flex items-center gap-1 text-[9px] font-black text-[#2D5A27] uppercase tracking-wider hover:underline cursor-pointer"
                                    >
                                      <Copy className="w-3 h-3" />
                                      {copiedCouponCode === coupon.code ? 'Đã copy' : 'Copy mã'}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-6 pb-3 border-b border-[#2D5A27]/5">
                  <ShoppingBag className="w-5 h-5 text-[#2D5A27]" />
                  <h3 className="font-extrabold text-sm uppercase tracking-widest font-mono">
                    Lịch sử đặt hàng
                  </h3>
                </div>

                {loadingOrders ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 border-3 border-[#2D5A27] border-t-transparent rounded-full animate-spin" />
                    <p className="text-[10px] font-mono font-bold tracking-widest text-[#5A5A5A] uppercase animate-pulse">
                      Đang tải lịch sử đơn...
                    </p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="py-16 text-center space-y-4">
                    <div className="text-4xl text-stone-300">📦</div>
                    <p className="text-xs text-[#5A5A5A] font-medium max-w-sm mx-auto leading-relaxed">
                      Bạn chưa thực hiện bất kỳ giao dịch mua hàng nào. Hãy khám phá danh mục để chọn sản phẩm mộc mạc tốt cho sức khỏe!
                    </p>
                    <a
                      href="/products"
                      className="inline-flex items-center gap-1.5 px-6 py-3 bg-[#2D5A27] hover:bg-[#1f3e1b] text-white text-xs font-black tracking-widest uppercase transition-colors"
                    >
                      MUA SẮM NGAY
                    </a>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="p-4 border border-stone-200 hover:border-[#2D5A27]/20 bg-[#FAF6EE]/20 hover:bg-[#FAF6EE]/40 transition-colors flex justify-between items-center gap-4 group"
                      >
                        <div className="space-y-1.5">
                          <p className="font-mono text-xs font-extrabold text-brand-charcoal">
                            #{order.id}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-stone-500 font-medium">
                              {new Date(order.created_at).toLocaleDateString('vi-VN')}
                            </span>
                            <span className={`text-[8px] font-black tracking-wider uppercase px-2 py-0.5 border font-mono ${getOrderStatusColor(order.order_status)}`}>
                              {getOrderStatusLabel(order.order_status)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-[8px] text-stone-500 uppercase tracking-widest font-mono">Tổng cộng</p>
                            <p className="text-sm font-extrabold text-[#2D5A27]">
                              {order.total_amount.toLocaleString('vi-VN')}đ
                            </p>
                          </div>
                          
                          {order.order_status === 'waiting_confirm' && (
                            <button
                              onClick={() => handleCancelOrder(order.id)}
                              className="px-2.5 py-1.5 border border-rose-300 hover:bg-rose-600 hover:text-white transition-all text-[9px] font-black tracking-wider uppercase bg-white text-rose-600 cursor-pointer rounded-none"
                            >
                              Hủy đơn
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 border border-stone-200 group-hover:border-[#2D5A27] text-stone-500 group-hover:text-[#2D5A27] transition-all bg-white hover:shadow-2xs cursor-pointer"
                            title="Xem chi tiết đơn hàng"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Modal chi tiết đơn hàng */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-5 backdrop-blur-xs select-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-[#2D5A27]/10 w-full max-w-lg p-6 relative overflow-hidden shadow-2xl space-y-6"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2D5A27] via-[#C8953A] to-[#2D5A27]" />
              
              <div className="flex justify-between items-start pb-2.5 border-b border-stone-200/60">
                <div>
                  <h4 className="font-serif text-lg font-bold text-stone-900 uppercase">
                    CHI TIẾT ĐƠN HÀNG
                  </h4>
                  <p className="font-mono text-xs font-black text-brand-green mt-0.5">
                    #{selectedOrder.id}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-stone-400 hover:text-stone-900 border border-transparent hover:border-stone-200 transition-all cursor-pointer font-extrabold text-xs"
                >
                  ĐÓNG
                </button>
              </div>

              <div className="space-y-4 text-xs leading-relaxed font-sans">
                {/* Thông tin nhận hàng */}
                <div className="space-y-1">
                  <p className="text-[9px] font-black tracking-widest text-[#5A5A5A] uppercase font-mono">Thông tin nhận hàng</p>
                  <div className="p-3 bg-[#FAF6EE] space-y-1">
                    <p><span className="font-bold">Người nhận:</span> {selectedOrder.customer_name}</p>
                    <p><span className="font-bold">Điện thoại:</span> {selectedOrder.customer_phone}</p>
                    <p><span className="font-bold">Địa chỉ:</span> {selectedOrder.customer_address}</p>
                    {selectedOrder.customer_note && <p><span className="font-bold">Ghi chú:</span> {selectedOrder.customer_note}</p>}
                  </div>
                </div>

                {/* Thanh toán & Vận chuyển */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-black tracking-widest text-[#5A5A5A] uppercase font-mono">Phương thức thanh toán</p>
                    <p className="font-bold text-stone-800">{selectedOrder.payment_method} (COD)</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-black tracking-widest text-[#5A5A5A] uppercase font-mono">Trạng thái thanh toán</p>
                    <p className="font-bold text-amber-700">Chưa thanh toán</p>
                  </div>
                </div>

                {/* Tổng tiền */}
                <div className="pt-4 border-t border-stone-200/60 flex justify-between items-end">
                  <div>
                    <p className="text-[9px] font-black tracking-widest text-[#5A5A5A] uppercase font-mono">Tổng đơn hàng</p>
                    <p className="text-xl font-serif font-black text-brand-green mt-0.5">
                      {selectedOrder.total_amount.toLocaleString('vi-VN')}đ
                    </p>
                  </div>

                  <a
                    href="https://zalo.me/0377159498"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 bg-[#0068FF] hover:bg-[#0052cc] text-white font-extrabold text-[9px] tracking-widest uppercase flex items-center gap-1 hover:shadow-sm"
                  >
                    NHẮN HỖ TRỢ ZALO
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal chúc mừng nhận quà kỷ niệm thành công */}
      <AnimatePresence>
        {claimSuccessData && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-5 backdrop-blur-xs select-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-[#2D5A27]/10 w-full max-w-md p-6 relative overflow-hidden shadow-2xl space-y-6 text-center"
            >
              {/* Top border decoration */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#C8953A] via-yellow-400 to-[#C8953A]" />
              
              {/* Confetti / Sparkle animation decoration */}
              <div className="flex justify-center pt-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
                  className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 shadow-inner"
                >
                  <Sparkles className="w-8 h-8" />
                </motion.div>
              </div>

              <div className="space-y-2 text-center">
                <h4 className="font-serif text-xl font-black text-[#2D5A27] tracking-tight uppercase">
                  Chúc Mừng Kỷ Niệm!
                </h4>
                <p className="text-xs text-stone-500 font-medium">
                  Bạn đã nhận thành công phần quà cho mốc{' '}
                  <span className="font-bold text-[#C8953A]">
                    {claimSuccessData.milestone === '1_month' ? '1 Tháng' : 
                     claimSuccessData.milestone === '6_months' ? '6 Tháng' : '1 Năm'}
                  </span>
                </p>
              </div>

              <div className="p-4 bg-[#FAF6EE] border border-stone-200/60 space-y-3 rounded-xs text-center">
                <p className="text-xs text-stone-700 font-bold leading-relaxed font-sans">
                  {claimSuccessData.giftDescription}
                </p>
                
                <div className="flex flex-col items-center gap-1.5 pt-1.5 border-t border-stone-200/60">
                  <span className="text-[9px] text-stone-400 uppercase tracking-widest font-mono">Mã Voucher Của Bạn</span>
                  <div className="flex items-center gap-3">
                    <code className="font-mono text-sm font-black text-[#2D5A27] tracking-wider select-all">
                      {claimSuccessData.voucherCode}
                    </code>
                    <button
                      onClick={() => handleCopyVoucher(claimSuccessData.voucherCode, 'modal')}
                      className="p-1.5 border border-stone-200 hover:border-[#2D5A27] text-stone-500 hover:text-[#2D5A27] bg-white transition-colors cursor-pointer rounded-xs"
                      title="Sao chép mã"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {copiedMilestone === 'modal' && (
                    <span className="text-[9px] text-emerald-800 font-bold font-mono">
                      Đã sao chép vào bộ nhớ tạm!
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => setClaimSuccessData(null)}
                className="w-full py-3 bg-[#2D5A27] hover:bg-[#1f3e1b] text-white font-extrabold text-xs tracking-widest uppercase transition-colors cursor-pointer"
              >
                ĐÓNG
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ProtectedRoute>
  );
}
