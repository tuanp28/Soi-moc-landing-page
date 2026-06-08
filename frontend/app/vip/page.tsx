'use client';

import React from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { 
  Award, 
  Sparkles, 
  Crown, 
  Percent, 
  Package, 
  Gem, 
  BadgeCheck, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/app/components/ProtectedRoute';

interface VipProduct {
  id: string;
  name: string;
  image: string;
  originalPrice: number;
  description: string;
  isExclusive: boolean;
}

const vipProducts: VipProduct[] = [
  {
    id: "vip-1",
    name: "Phở Ngô Cao Cấp - VIP Special Box (Hộp Quà Tặng)",
    image: "/images/product-combo.jpg",
    originalPrice: 180000,
    description: "Phiên bản giới hạn tuyển chọn những sợi phở ngô mộc mạc tốt nhất từ Hà Giang. Thích hợp làm quà tặng cao cấp cho gia đình.",
    isExclusive: true
  },
  {
    id: "vip-2",
    name: "Bún Ngô Thượng Hạng - Organic Export Edition",
    image: "/images/bun-ngo-details.jpg",
    originalPrice: 150000,
    description: "Sản xuất theo tiêu chuẩn hữu cơ xuất khẩu, sợi bún ngô dai ngon mộc mạc đặc biệt giàu dinh dưỡng hơn.",
    isExclusive: true
  },
  {
    id: "vip-3",
    name: "Bột Ngô Hữu Cơ Hà Giang - Dinh Dưỡng Toàn Diện",
    image: "/images/phở-ngô-nguyên-liệu.jpg",
    originalPrice: 95000,
    description: "Bột ngô xay đá truyền thống nguyên cám, giữ trọn vẹn chất xơ, vitamin và khoáng chất tự nhiên.",
    isExclusive: false
  }
];

function VipDashboard() {
  const { profile } = useAuth();
  const vipLevel = profile?.vipLevel || 'normal';

  // Get discount rate based on VIP tier
  const getDiscountRate = (level: string) => {
    switch (level) {
      case 'diamond': return 0.15;
      case 'gold': return 0.10;
      case 'silver': return 0.05;
      default: return 0.00;
    }
  };

  const discountRate = getDiscountRate(vipLevel);
  const discountPercent = Math.round(discountRate * 100);

  const getVipTheme = (level: string) => {
    switch (level) {
      case 'diamond':
        return {
          gradient: 'from-[#0f172a] via-[#1e293b] to-[#0f172a] border-cyan-500/30',
          badgeText: 'Kim Cương (Diamond)',
          textColor: 'text-cyan-400',
          glowBg: 'bg-cyan-500/10',
          badgeBg: 'bg-cyan-500/20 text-cyan-200 border-cyan-400/30',
          slogan: 'Trải nghiệm đỉnh cao của dịch vụ và đặc quyền thượng lưu'
        };
      case 'gold':
        return {
          gradient: 'from-[#2d1e08] via-[#523d1c] to-[#2d1e08] border-[#C8953A]/30',
          badgeText: 'Vàng (Gold)',
          textColor: 'text-[#C8953A]',
          glowBg: 'bg-[#C8953A]/10',
          badgeBg: 'bg-[#C8953A]/25 text-[#FAF6EE] border-[#C8953A]/40',
          slogan: 'Hội viên cao cấp cùng những chương trình quà tặng giá trị'
        };
      case 'silver':
        return {
          gradient: 'from-[#27272a] via-[#3f3f46] to-[#27272a] border-stone-400/30',
          badgeText: 'Bạc (Silver)',
          textColor: 'text-stone-300',
          glowBg: 'bg-stone-500/10',
          badgeBg: 'bg-stone-500/20 text-stone-200 border-stone-400/40',
          slogan: 'Khởi đầu tích lũy ưu đãi hấp dẫn dành riêng cho hội viên'
        };
      default:
        return {
          gradient: 'from-[#1a3817] via-[#2D5A27] to-[#142812] border-brand-green/20',
          badgeText: 'Nhân Sự Sợi Mộc',
          textColor: 'text-emerald-400',
          glowBg: 'bg-emerald-500/10',
          badgeBg: 'bg-emerald-500/20 text-emerald-250 border-emerald-400/30',
          slogan: 'Đặc quyền trải nghiệm sản phẩm tối đa dành cho nhân viên'
        };
    }
  };

  const theme = getVipTheme(vipLevel);

  const calculateVipPrice = (price: number) => {
    return Math.round(price * (1 - discountRate));
  };

  return (
    <div className="bg-[#F9F4EC] dark:bg-[#111510] text-[#1A1A1A] dark:text-stone-200 min-h-screen py-20 px-5 md:px-10 font-sans transition-colors duration-300 overflow-hidden relative">
      
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/10 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-[500px] h-[500px] rounded-full bg-[#C8953A]/5 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* VIP Club Header Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`w-full bg-gradient-to-br ${theme.gradient} text-white border p-8 md:p-10 shadow-2xl relative flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_60%)] pointer-events-none" />
          
          <div className="space-y-4">
            <div className={`inline-flex items-center gap-2 ${theme.badgeBg} border px-3.5 py-1.5 text-[10px] font-black tracking-widest uppercase font-mono`}>
              <Crown className="w-4 h-4" />
              SỢI MỘC VIP CLUB
            </div>
            
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-bold font-serif uppercase tracking-tight">
                Xin Chào, {profile?.fullName}!
              </h2>
              <p className="text-sm font-medium text-stone-300 max-w-lg leading-relaxed">
                Hạng thành viên của bạn là <span className={`font-black ${theme.textColor} uppercase font-mono`}>{theme.badgeText}</span>. {theme.slogan}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0 bg-white/5 border border-white/10 p-6 backdrop-blur-xs">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-[#C8953A] flex items-center justify-center font-bold text-xl">
              <Percent className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[9px] text-stone-300 uppercase tracking-widest font-mono">Đặc quyền giảm giá</p>
              <h3 className="text-2xl font-black text-white font-sans mt-0.5">-{discountPercent}% OFF</h3>
              <p className="text-[8px] text-stone-400">Áp dụng trực tiếp vào giỏ hàng</p>
            </div>
          </div>
        </motion.div>

        {/* Benefits & Perks Showcase grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Perk 1: VIP Prices */}
          <div className="bg-white dark:bg-[#171E15] border border-[#2D5A27]/10 dark:border-white/10 p-6 space-y-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-wider font-mono">Chiết khấu trực tiếp</h3>
            <p className="text-xs text-brand-muted leading-relaxed font-medium">
              Tất cả các sản phẩm trên website sẽ tự động giảm từ 5% đến 15% cho bạn khi mua sắm tại giỏ hàng. Bạn không cần phải nhập mã giảm giá.
            </p>
          </div>

          {/* Perk 2: Exclusive Products */}
          <div className="bg-white dark:bg-[#171E15] border border-[#2D5A27]/10 dark:border-white/10 p-6 space-y-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-cyan-50 dark:bg-cyan-950/20 text-cyan-700 dark:text-cyan-400 flex items-center justify-center shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-wider font-mono">Sản phẩm độc quyền</h3>
            <p className="text-xs text-brand-muted leading-relaxed font-medium">
              Quyền mua các dòng sản phẩm giới hạn (Special Editions, Combo Quà tặng) chỉ dành riêng cho hội viên VIP. Người dùng phổ thông sẽ không thể nhìn thấy hoặc đặt hàng.
            </p>
          </div>

          {/* Perk 3: Support Priority */}
          <div className="bg-white dark:bg-[#171E15] border border-[#2D5A27]/10 dark:border-white/10 p-6 space-y-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-wider font-mono">Đội ngũ CSKH ưu tiên</h3>
            <p className="text-xs text-brand-muted leading-relaxed font-medium">
              Đơn hàng của hội viên VIP luôn được xử lý và vận chuyển ưu tiên hàng đầu, đi kèm kênh liên lạc Zalo Hotline tư vấn trực tiếp 24/7.
            </p>
          </div>
        </div>

        {/* Dynamic Pricing and Exclusive Products Showcase */}
        <div className="space-y-6">
          <div className="border-b border-[#2D5A27]/10 dark:border-white/10 pb-4">
            <span className="text-[9px] font-black tracking-widest text-[#2D5A27] dark:text-brand-green-light uppercase font-mono">VIP PRODUCTS CATALOG</span>
            <h2 className="text-xl sm:text-2xl font-bold font-serif uppercase text-brand-charcoal dark:text-white mt-1">Sản Phẩm Độc Quyền & Giá Ưu Đãi VIP</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {vipProducts.map((product) => {
              const vipPrice = calculateVipPrice(product.originalPrice);
              return (
                <div 
                  key={product.id}
                  className="bg-white dark:bg-[#171E15] border border-[#2D5A27]/10 dark:border-white/10 shadow-xs flex flex-col justify-between overflow-hidden relative group"
                >
                  {/* Badge Exclusive */}
                  {product.isExclusive && (
                    <div className="absolute top-3 left-3 bg-cyan-600/90 text-white border border-cyan-400/20 px-2 py-1 text-[8px] font-black tracking-wider uppercase font-mono z-10 flex items-center gap-1 shadow-sm">
                      <Gem className="w-3 h-3" />
                      Chỉ cho VIP
                    </div>
                  )}

                  {/* Product image mockup */}
                  <div className="aspect-square bg-brand-green-pale dark:bg-stone-900 border-b border-brand-green/5 dark:border-white/5 relative overflow-hidden flex items-center justify-center text-5xl">
                    🌾
                  </div>

                  {/* Product Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <h3 className="font-extrabold text-sm text-[#1A1A1A] dark:text-stone-200 line-clamp-2 leading-relaxed">
                        {product.name}
                      </h3>
                      <p className="text-[11px] text-brand-muted leading-relaxed font-medium line-clamp-3">
                        {product.description}
                      </p>
                    </div>

                    {/* Price calculation block */}
                    <div className="pt-4 border-t border-brand-green/5 dark:border-white/5 flex items-end justify-between">
                      <div>
                        <p className="text-[8px] text-brand-muted uppercase tracking-widest font-mono">Giá thường</p>
                        <p className="text-xs text-[#5A5A5A] dark:text-stone-400 font-sans font-bold line-through mt-0.5">
                          {product.originalPrice.toLocaleString('vi-VN')}đ
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[8px] text-[#C8953A] uppercase tracking-widest font-bold font-mono">Giá VIP của bạn</p>
                        <p className="text-base font-black text-brand-green dark:text-brand-green-light font-sans mt-0.5">
                          {vipPrice.toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Membership tiers comparison table */}
        <div className="space-y-6">
          <div className="border-b border-[#2D5A27]/10 dark:border-white/10 pb-4">
            <span className="text-[9px] font-black tracking-widest text-[#2D5A27] dark:text-brand-green-light uppercase font-mono">VIP CLUB LEVELS</span>
            <h2 className="text-xl sm:text-2xl font-bold font-serif uppercase text-brand-charcoal dark:text-white mt-1">So Sánh Quyền Lợi Hội Viên</h2>
          </div>

          <div className="bg-white dark:bg-[#171E15] border border-[#2D5A27]/10 dark:border-white/10 overflow-x-auto shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#2D5A27]/5 dark:bg-[#2D5A27]/10 border-b border-[#2D5A27]/10 dark:border-white/10 text-[9px] font-black tracking-widest text-[#5A5A5A] dark:text-stone-400 uppercase font-mono">
                  <th className="p-4.5">Hạng Thành Viên</th>
                  <th className="p-4.5">Mức Chiết Khấu</th>
                  <th className="p-4.5">Quà Tặng Sinh Nhật</th>
                  <th className="p-4.5">Sản Phẩm Độc Quyền</th>
                  <th className="p-4.5">Dịch Vụ Ưu Tiên</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2D5A27]/5 dark:divide-white/5 text-[#5A5A5A] dark:text-stone-300 font-medium">
                {/* Normal */}
                <tr className={vipLevel === 'normal' ? 'bg-[#2D5A27]/3 dark:bg-white/5 font-extrabold' : ''}>
                  <td className="p-4.5 font-bold text-[#1A1A1A] dark:text-stone-200">
                    Tiêu Chuẩn (Normal)
                  </td>
                  <td className="p-4.5">0%</td>
                  <td className="p-4.5">Không</td>
                  <td className="p-4.5 text-rose-500">✕ Không</td>
                  <td className="p-4.5">Tiêu chuẩn</td>
                </tr>

                {/* Silver */}
                <tr className={vipLevel === 'silver' ? 'bg-stone-500/10 font-extrabold' : ''}>
                  <td className="p-4.5 font-bold text-stone-600 dark:text-stone-200">
                    Thành Viên Bạc (Silver)
                  </td>
                  <td className="p-4.5 font-mono font-bold text-stone-700 dark:text-stone-300">5%</td>
                  <td className="p-4.5">Voucher 50K</td>
                  <td className="p-4.5 text-cyan-600">✓ Có quyền mua</td>
                  <td className="p-4.5">Hỗ trợ nhanh</td>
                </tr>

                {/* Gold */}
                <tr className={vipLevel === 'gold' ? 'bg-[#C8953A]/10 font-extrabold' : ''}>
                  <td className="p-4.5 font-bold text-[#C8953A]">
                    Thành Viên Vàng (Gold)
                  </td>
                  <td className="p-4.5 font-mono font-bold text-[#C8953A]">10%</td>
                  <td className="p-4.5">Hộp quà đặc biệt + 100K</td>
                  <td className="p-4.5 text-cyan-600">✓ Có quyền mua</td>
                  <td className="p-4.5 font-bold text-brand-green dark:text-brand-green-light">✓ CSKH Ưu tiên</td>
                </tr>

                {/* Diamond */}
                <tr className={vipLevel === 'diamond' ? 'bg-cyan-500/5 font-extrabold' : ''}>
                  <td className="p-4.5 font-bold text-cyan-500">
                    Thành Viên Kim Cương (Diamond)
                  </td>
                  <td className="p-4.5 font-mono font-bold text-cyan-500">15%</td>
                  <td className="p-4.5">Bộ Combo Premium + 200K</td>
                  <td className="p-4.5 text-cyan-600">✓ Có quyền mua</td>
                  <td className="p-4.5 font-bold text-cyan-500">👑 CSKH Cao Cấp 24/7</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function VipPage() {
  return (
    <ProtectedRoute allowedVipLevels={['silver', 'gold', 'diamond']}>
      <VipDashboard />
    </ProtectedRoute>
  );
}
