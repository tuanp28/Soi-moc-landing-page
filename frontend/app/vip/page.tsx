'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { 
  Sparkles, 
  Crown, 
  Percent, 
  TrendingUp, 
  Award, 
  ChevronRight, 
  Zap, 
  ShieldCheck, 
  Gift, 
  Phone,
  HelpCircle,
  Clock,
  Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProtectedRoute from '@/app/components/ProtectedRoute';

function VipDashboard() {
  const { profile, session } = useAuth();
  const vipLevel = profile?.vipLevel || 'normal';
  
  // Total spent state and loading
  const [totalSpent, setTotalSpent] = useState(0);
  const [loadingSpent, setLoadingSpent] = useState(true);

  // Card interactive tilt states
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [cardGlowStyle, setCardGlowStyle] = useState({ opacity: 0, x: 0, y: 0 });

  // Fetch orders to calculate real total spent
  useEffect(() => {
    const fetchOrdersAndCalculateSpent = async () => {
      if (!session) return;
      try {
        setLoadingSpent(true);
        const res = await fetch('/api/orders', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.orders) {
            // Calculate total of paid or completed orders
            const sum = data.orders
              .filter((o: any) => o.payment_status === 'paid' || o.order_status === 'completed')
              .reduce((acc: number, o: any) => acc + Number(o.total_amount), 0);
            setTotalSpent(sum);
          }
        }
      } catch (err) {
        console.error('Failed to load spent history:', err);
      } finally {
        setLoadingSpent(false);
      }
    };
    fetchOrdersAndCalculateSpent();
  }, [session]);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    
    // Rotate calculations
    const rotX = -((y - box.height / 2) / (box.height / 2)) * 10; // Max 10 deg
    const rotY = ((x - box.width / 2) / (box.width / 2)) * 10;
    
    setRotateX(rotX);
    setRotateY(rotY);
    setCardGlowStyle({
      opacity: 0.6,
      x: x,
      y: y
    });
  };

  const handleCardMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setCardGlowStyle(prev => ({ ...prev, opacity: 0 }));
  };

  // Tier Threshold Configurations
  const thresholds = {
    silver: 500000,      // 500k
    gold: 1500000,       // 1.5M
    diamond: 3000000     // 3M
  };

  // Get current progression details
  const getProgressDetails = () => {
    if (vipLevel === 'normal') {
      const nextVal = thresholds.silver;
      const progressPercent = Math.min(100, Math.max(0, (totalSpent / nextVal) * 100));
      return {
        nextTier: 'Hạng Bạc (Silver)',
        needed: nextVal - totalSpent,
        percent: progressPercent,
        currentMin: 0,
        nextMin: nextVal
      };
    } else if (vipLevel === 'silver') {
      const prevVal = thresholds.silver;
      const nextVal = thresholds.gold;
      const progressPercent = Math.min(100, Math.max(0, ((totalSpent - prevVal) / (nextVal - prevVal)) * 100));
      return {
        nextTier: 'Hạng Vàng (Gold)',
        needed: nextVal - totalSpent,
        percent: progressPercent,
        currentMin: prevVal,
        nextMin: nextVal
      };
    } else if (vipLevel === 'gold') {
      const prevVal = thresholds.gold;
      const nextVal = thresholds.diamond;
      const progressPercent = Math.min(100, Math.max(0, ((totalSpent - prevVal) / (nextVal - prevVal)) * 100));
      return {
        nextTier: 'Hạng Kim Cương (Diamond)',
        needed: nextVal - totalSpent,
        percent: progressPercent,
        currentMin: prevVal,
        nextMin: nextVal
      };
    }
    // Diamond
    return {
      nextTier: 'Đạt cấp tối đa',
      needed: 0,
      percent: 100,
      currentMin: thresholds.diamond,
      nextMin: thresholds.diamond
    };
  };

  const progress = getProgressDetails();

  // Get discount rate based on VIP tier
  const getDiscountRate = (level: string) => {
    switch (level) {
      case 'diamond': return 0.15;
      case 'gold': return 0.10;
      case 'silver': return 0.05;
      default: return 0.00;
    }
  };

  const discountPercent = Math.round(getDiscountRate(vipLevel) * 100);

  // VIP Tier Theme Definition
  const getTierTheme = (level: string) => {
    switch (level) {
      case 'diamond':
        return {
          id: 'diamond',
          bodyBg: 'bg-[#030712] text-slate-100',
          textColor: 'text-cyan-400',
          borderColor: 'border-cyan-500/25',
          bannerGradient: 'from-[#030712] via-[#091e3a] to-[#0c0d16] border-cyan-500/30',
          badgeText: 'Hội Viên Kim Cương',
          badgeBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
          glowColor: 'rgba(34, 211, 238, 0.15)',
          progressColor: 'bg-gradient-to-r from-cyan-500 to-indigo-500',
          progressBg: 'bg-cyan-950/40 border-cyan-900/30',
          cardBg: 'bg-gradient-to-br from-[#0c162d] via-[#102446] to-[#080d19] border-cyan-400/40 shadow-[0_0_30px_rgba(6,182,212,0.15)]',
          slogan: 'Quyền năng đỉnh cao – Khẳng định vị thế thượng lưu',
          pageHeading: 'text-white',
          pageLabel: 'text-cyan-400/80',
          cardBgClass: 'bg-[#0b1329]/65 border-cyan-500/20 text-slate-200',
          cardTitleClass: 'text-white',
          cardDescClass: 'text-slate-400',
          perks: [
            { icon: Percent, title: 'Chiết khấu 15%', desc: 'Tự động giảm giá 15% tất cả sản phẩm trực tiếp vào giỏ hàng.' },
            { icon: Gift, title: 'Hộp Quà Cao Cấp Thường Niên', desc: 'Nhận bộ quà tặng cao cấp Sợi Mộc trị giá 200.000đ dịp sinh nhật.' },
            { icon: Phone, title: 'Hotline CSKH Riêng 24/7', desc: 'Kênh liên lạc riêng tư và ưu tiên phản hồi cuộc gọi trong vòng 1 phút.' },
            { icon: Clock, title: 'Đóng Gói Siêu Tốc', desc: 'Đơn hàng của bạn sẽ được xử lý trước mọi đơn hàng khác trên hệ thống.' }
          ]
        };
      case 'gold':
        return {
          id: 'gold',
          bodyBg: 'bg-[#0f0a02] text-stone-100',
          textColor: 'text-[#C8953A]',
          borderColor: 'border-[#C8953A]/25',
          bannerGradient: 'from-[#170f03] via-[#352510] to-[#0f0a02] border-[#C8953A]/30',
          badgeText: 'Hội Viên Vàng',
          badgeBg: 'bg-[#C8953A]/10 text-amber-300 border-[#C8953A]/30',
          glowColor: 'rgba(200, 149, 58, 0.15)',
          progressColor: 'bg-gradient-to-r from-amber-500 via-[#C8953A] to-yellow-600',
          progressBg: 'bg-[#211606] border-[#3a2912]',
          cardBg: 'bg-gradient-to-br from-[#281c0c] via-[#4a3617] to-[#1a1106] border-[#C8953A]/40 shadow-[0_0_30px_rgba(200,149,58,0.15)]',
          slogan: 'Hành trình thượng hạng – Đẳng cấp vàng ngọc cùng Sợi Mộc',
          pageHeading: 'text-white',
          pageLabel: 'text-[#C8953A]/80',
          cardBgClass: 'bg-[#1e1305]/75 border-[#C8953A]/25 text-stone-200',
          cardTitleClass: 'text-white',
          cardDescClass: 'text-stone-350',
          perks: [
            { icon: Percent, title: 'Chiết khấu 10%', desc: 'Tự động giảm giá 10% tất cả sản phẩm trực tiếp vào giỏ hàng.' },
            { icon: Gift, title: 'Hộp Quà Thượng Hạng', desc: 'Nhận hộp quà tặng Sợi Mộc trị giá 100.000đ vào dịp sinh nhật.' },
            { icon: Zap, title: 'Vận Chuyển Ưu Tiên', desc: 'Hỗ trợ xử lý đóng hàng trước tiên và hỗ trợ giao hàng hỏa tốc.' },
            { icon: ShieldCheck, title: 'Chính Sách Linh Hoạt', desc: 'Đặc quyền đổi trả hàng không cần lý do trong vòng 10 ngày.' }
          ]
        };
      case 'silver':
        return {
          id: 'silver',
          bodyBg: 'bg-[#0a0a0a] text-zinc-100',
          textColor: 'text-stone-300',
          borderColor: 'border-zinc-700/50',
          bannerGradient: 'from-[#0e0e0f] via-[#242427] to-[#0e0e0f] border-zinc-700/40',
          badgeText: 'Hội Viên Bạc',
          badgeBg: 'bg-zinc-800/40 text-stone-200 border-zinc-700/40',
          glowColor: 'rgba(255, 255, 255, 0.08)',
          progressColor: 'bg-gradient-to-r from-zinc-550 via-zinc-400 to-zinc-600',
          progressBg: 'bg-[#18181b] border-zinc-800',
          cardBg: 'bg-gradient-to-br from-[#1e1e24] via-[#2a2a33] to-[#121217] border-zinc-600/45 shadow-[0_0_30px_rgba(255,255,255,0.06)]',
          slogan: 'Khởi đầu tối ưu – Bền bỉ chất lượng cùng Sợi Mộc',
          pageHeading: 'text-white',
          pageLabel: 'text-zinc-400',
          cardBgClass: 'bg-[#141416]/75 border-zinc-700/50 text-zinc-200',
          cardTitleClass: 'text-white',
          cardDescClass: 'text-zinc-400',
          perks: [
            { icon: Percent, title: 'Chiết khấu 5%', desc: 'Tự động giảm giá 5% tất cả sản phẩm trực tiếp vào giỏ hàng.' },
            { icon: Gift, title: 'Ưu Đãi Sinh Nhật', desc: 'Voucher mua hàng 50.000đ gửi trực tiếp vào tài khoản vào ngày sinh nhật.' },
            { icon: ShieldCheck, title: 'Hỗ Trợ Nhanh Chóng', desc: 'Đội ngũ hỗ trợ trả lời ưu tiên hơn hạng Standard trên hệ thống.' },
            { icon: Award, title: 'Tích Lũy Ưu Tiên', desc: 'Tích lũy chi tiêu nhanh hơn để thăng cấp lên VIP Vàng.' }
          ]
        };
      default:
        // Admin or Staff
        if (profile && ['staff', 'manager', 'admin'].includes(profile.role)) {
          return {
            id: 'staff',
            bodyBg: 'bg-[#030d05] text-[#e2f0e3]',
            textColor: 'text-emerald-400',
            borderColor: 'border-emerald-500/25',
            bannerGradient: 'from-[#030d05] via-[#102d13] to-[#041005] border-emerald-550/30',
            badgeText: 'Đội Ngũ Nhân Sự',
            badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
            glowColor: 'rgba(16, 185, 129, 0.1)',
            progressColor: 'bg-gradient-to-r from-emerald-550 to-teal-500',
            progressBg: 'bg-[#041407] border-emerald-950',
            cardBg: 'bg-gradient-to-br from-[#041607] via-[#0b2911] to-[#020d04] border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.15)]',
            slogan: 'Đồng hành xây dựng Sợi Mộc vươn tầm nông sản Việt',
            pageHeading: 'text-white',
            pageLabel: 'text-emerald-400/80',
            cardBgClass: 'bg-[#041407]/75 border-emerald-800/30 text-[#e2f0e3]',
            cardTitleClass: 'text-white',
            cardDescClass: 'text-emerald-300/80',
            perks: [
              { icon: Briefcase, title: 'Ưu đãi nội bộ', desc: 'Giảm giá nội bộ tối đa áp dụng trực tiếp cho tất cả nhân sự.' },
              { icon: ShieldCheck, title: 'Quyền Quản Lý', desc: 'Truy cập các tính năng kiểm soát sản phẩm, doanh thu và đơn hàng.' },
              { icon: Sparkles, title: 'Quà Trình Làng', desc: 'Nhận trải nghiệm trước mọi sản phẩm hoặc phiên bản thử nghiệm mới.' },
              { icon: Phone, title: 'Hỗ Trợ Nhân Sự', desc: 'Hotline nội bộ giải đáp thắc mắc về đơn hàng và kỹ thuật.' }
            ]
          };
        }
        // Standard Member
        return {
          id: 'normal',
          bodyBg: 'bg-[#FAF6EE] text-[#1A1A1A] dark:bg-[#111510] dark:text-stone-200',
          textColor: 'text-brand-green dark:text-brand-green-light',
          borderColor: 'border-brand-green/10 dark:border-white/10',
          bannerGradient: 'from-brand-green via-brand-green-hover to-[#142812] border-brand-green/30 text-white',
          badgeText: 'Thành Viên Tiêu Chuẩn',
          badgeBg: 'bg-brand-green/10 dark:bg-brand-green/20 text-brand-green dark:text-brand-green-light border-brand-green/20 dark:border-brand-green/30',
          glowColor: 'rgba(45, 90, 39, 0.05)',
          progressColor: 'bg-gradient-to-r from-[#2D5A27] to-[#C8953A]',
          progressBg: 'bg-white border-brand-green/15 dark:bg-stone-900 dark:border-white/10',
          cardBg: 'bg-gradient-to-br from-[#1e3c1a] via-[#2d5a27] to-[#122410] border-brand-green/45 text-white shadow-xl',
          slogan: 'Ăn sạch - Sống khỏe, bắt đầu tích lũy để thăng cấp VIP',
          pageHeading: 'text-brand-charcoal dark:text-white',
          pageLabel: 'text-[#5A5A5A] dark:text-stone-450',
          cardBgClass: 'bg-white border-brand-green/10 dark:bg-[#171E15] dark:border-white/10 text-[#1A1A1A] dark:text-stone-250',
          cardTitleClass: 'text-brand-charcoal dark:text-white',
          cardDescClass: 'text-brand-muted dark:text-stone-400',
          perks: [
            { icon: Percent, title: 'Chiết khấu 0%', desc: 'Đạt mức tích lũy 500k để nâng cấp lên Hạng Bạc và nhận giảm giá 5%.' },
            { icon: Gift, title: 'Quà Tặng Thường Niên', desc: 'Nhận thông báo quà tặng và khuyến mãi độc quyền từ hệ thống.' },
            { icon: ShieldCheck, title: 'Sản Phẩm An Toàn', desc: '100% ngô sạch Cao Bằng, không chất bảo quản, không phẩm màu.' },
            { icon: Clock, title: 'Giao Hàng COD', desc: 'Nhận hàng kiểm tra trước khi thanh toán tiền mặt toàn quốc.' }
          ]
        };
    }
  };

  const theme = getTierTheme(vipLevel);

  return (
    <div className={`min-h-screen py-24 px-5 md:px-10 font-sans transition-colors duration-500 overflow-hidden relative ${theme.bodyBg}`}>
      
      {/* Dynamic Background Glowing Orbs */}
      <div 
        className="absolute top-1/4 left-1/10 w-[450px] h-[450px] rounded-full blur-[140px] pointer-events-none transition-all duration-700 animate-pulse" 
        style={{ backgroundColor: theme.glowColor }}
      />
      <div 
        className="absolute bottom-1/4 right-1/10 w-[450px] h-[450px] rounded-full blur-[140px] pointer-events-none transition-all duration-700 animate-pulse" 
        style={{ backgroundColor: theme.glowColor }}
      />

      {/* Diagonal Tech-Grid lines for Diamond / cyber effect */}
      {theme.id === 'diamond' && (
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)] pointer-events-none" />
      )}
      
      {/* Gold sparkling particle stars overlay */}
      {theme.id === 'gold' && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(200,149,58,0.04)_1px,transparent_1px),radial-gradient(circle_at_75%_60%,rgba(200,149,58,0.04)_2px,transparent_2px)] bg-[size:100px_100px] pointer-events-none animate-pulse" />
      )}

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`w-full bg-gradient-to-br ${theme.bannerGradient} border p-8 md:p-10 shadow-2xl relative flex flex-col md:flex-row md:items-center justify-between gap-8 overflow-hidden`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_60%)] pointer-events-none" />
          
          <div className="space-y-4 max-w-xl">
            <div className={`inline-flex items-center gap-2 ${theme.badgeBg} border px-3 py-1.5 text-[9px] font-black tracking-widest uppercase font-mono`}>
              <Crown className="w-3.5 h-3.5" />
              SỢI MỘC VIP CLUB
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-extrabold font-serif uppercase tracking-tight text-white">
                {profile?.fullName}
              </h1>
              <p className="text-sm font-medium text-stone-300 leading-relaxed">
                Cấp độ thành viên: <span className={`font-black ${theme.textColor} uppercase font-mono`}>{theme.badgeText}</span>
                <span className="block text-xs mt-1.5 text-stone-400 italic font-sans">{theme.slogan}</span>
              </p>
            </div>
          </div>

          {/* Discount display */}
          <div className="flex items-center gap-4 shrink-0 bg-white/5 border border-white/10 p-5 md:p-6 backdrop-blur-xs min-w-[200px]">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${theme.badgeBg}`}>
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[8px] text-stone-300 uppercase tracking-widest font-mono">Đặc quyền giảm giá</p>
              <h3 className="text-2xl font-black text-white font-sans mt-0.5">-{discountPercent}% OFF</h3>
              <p className="text-[8px] text-stone-400">Tự động trừ ở giỏ hàng</p>
            </div>
          </div>
        </motion.div>

        {/* Interactive Card & Upgrade Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: 3D Tilting Membership Card (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <span className={`text-[9px] font-black tracking-widest uppercase font-mono mb-4 block ${theme.pageLabel}`}>
              THẺ THÀNH VIÊN VẬT LÝ (ẢNH 3D CHẠM VUỐT)
            </span>

            {/* 3D tilt Wrapper */}
            <div 
              className="w-full max-w-[360px] aspect-[1.58/1] relative cursor-pointer select-none"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              style={{
                transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                transformStyle: 'preserve-3d',
                transition: 'transform 0.1s ease-out'
              }}
            >
              {/* Membership Card Face */}
              <div className={`absolute inset-0 w-full h-full p-6 ${theme.cardBg} border rounded-2xl flex flex-col justify-between overflow-hidden relative`}>
                {/* Digital glowing shader line */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none" />
                
                {/* Holographic dynamic card glow spot */}
                <div 
                  className="absolute w-48 h-48 rounded-full blur-2xl pointer-events-none bg-white/10 mix-blend-screen transition-opacity duration-300"
                  style={{
                    left: cardGlowStyle.x - 96,
                    top: cardGlowStyle.y - 96,
                    opacity: cardGlowStyle.opacity
                  }}
                />

                {/* Top Bar of the Card */}
                <div className="flex justify-between items-start" style={{ transform: 'translateZ(30px)' }}>
                  <div>
                    <h4 className="text-[10px] font-black tracking-widest uppercase font-mono text-white/60">SỢI MỘC</h4>
                    <p className="text-[8px] font-medium tracking-wide text-white/40 uppercase font-mono">EST. 2026</p>
                  </div>
                  {theme.id === 'diamond' ? (
                    <div className="w-9 h-9 rounded-lg bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
                      <Crown className="w-5 h-5 animate-pulse" />
                    </div>
                  ) : theme.id === 'gold' ? (
                    <div className="w-9 h-9 rounded-lg bg-[#C8953A]/10 border border-[#C8953A]/30 flex items-center justify-center text-[#C8953A]">
                      <Crown className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white">
                      <Crown className="w-5 h-5" />
                    </div>
                  )}
                </div>

                {/* Middle: VIP Badge logo */}
                <div className="py-2" style={{ transform: 'translateZ(45px)' }}>
                  <span className={`text-xl md:text-2xl font-black uppercase font-serif tracking-widest ${theme.textColor} block shadow-sm`}>
                    {theme.badgeText.split(' ')[0]}
                  </span>
                  <span className="text-[8px] tracking-widest uppercase text-white/50 font-mono block mt-0.5">MEMBERSHIP CARD</span>
                </div>

                {/* Bottom Bar: Owner name & barcode */}
                <div className="flex justify-between items-end border-t border-white/10 pt-3" style={{ transform: 'translateZ(35px)' }}>
                  <div>
                    <p className="text-[7px] text-white/50 uppercase tracking-widest font-mono">Chủ thẻ</p>
                    <p className="text-xs font-bold text-white tracking-wide truncate max-w-[180px] mt-0.5">{profile?.fullName}</p>
                  </div>

                  <div className="text-right">
                    {theme.id === 'diamond' ? (
                      <div className="space-y-1">
                        <div className="h-4 w-20 bg-cyan-400/20 rounded-xs flex items-center justify-center font-mono text-[7px] text-cyan-300 font-extrabold uppercase border border-cyan-400/25">
                          ⚡ D-PLATINUM
                        </div>
                      </div>
                    ) : (
                      <div className="font-mono text-[8px] text-white/30 tracking-widest uppercase">
                        SM-{profile?.id ? profile.id.slice(0, 8).toUpperCase() : 'MEMBER'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Upgrade Meter & Stats (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className={`p-6 md:p-8 shadow-sm space-y-6 border ${theme.cardBgClass}`}>
              <div>
                <span className={`text-[9px] font-black tracking-widest uppercase font-mono ${theme.pageLabel}`}>UPGRADE PROGRESS</span>
                <h3 className={`text-xl font-bold font-serif uppercase mt-1 ${theme.cardTitleClass}`}>
                  Tiến độ thăng hạng hội viên
                </h3>
              </div>

              {loadingSpent ? (
                <div className="py-6 flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-mono text-stone-500 uppercase tracking-wider">Đang tính toán chi tiêu...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Spent counter */}
                  <div className="flex justify-between items-end text-xs">
                    <div>
                      <p className={`text-[9px] uppercase font-bold tracking-wider ${theme.cardDescClass}`}>Tổng chi tiêu đã ghi nhận</p>
                      <p className={`text-2xl font-black mt-1 ${theme.textColor} font-sans`}>
                        {totalSpent.toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className={`text-[9px] uppercase font-bold tracking-wider ${theme.cardDescClass}`}>Mục tiêu tiếp theo</p>
                      <p className={`font-bold mt-1 ${theme.cardTitleClass}`}>
                        {progress.nextTier === 'Đạt cấp tối đa' ? 'Cấp tối đa' : `${progress.nextMin.toLocaleString('vi-VN')}đ`}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className={`w-full h-3.5 rounded-full overflow-hidden p-0.5 border ${theme.progressBg}`}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress.percent}%` }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      className={`h-full rounded-full transition-all duration-300 ${theme.progressColor}`}
                    />
                  </div>

                  {/* Next Tier helper text */}
                  {progress.needed > 0 ? (
                    <p className={`text-[11px] font-medium leading-relaxed ${theme.cardDescClass}`}>
                      💡 Bạn chỉ cần chi tiêu thêm <strong className={`font-bold ${theme.textColor}`}>{progress.needed.toLocaleString('vi-VN')}đ</strong> nữa để nâng cấp tài khoản lên <strong className={`font-bold ${theme.cardTitleClass}`}>{progress.nextTier}</strong> và mở rộng đặc quyền!
                    </p>
                  ) : (
                    <p className="text-[11px] text-[#2D5A27] dark:text-brand-green-light font-bold flex items-center gap-1.5 leading-relaxed">
                      👑 Chúc mừng! Bạn đang sở hữu đặc quyền tối đa của hội viên <strong className="text-cyan-400 font-mono">DIAMOND</strong> tại Sợi Mộc.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Quick Info Box */}
            <div className={`p-5 border flex gap-3.5 items-start ${theme.cardBgClass}`}>
              <Zap className="w-5 h-5 text-[#C8953A] shrink-0 mt-0.5 animate-pulse" />
              <div className="space-y-1.5">
                <h4 className="font-extrabold uppercase text-[#C8953A] tracking-wider font-mono text-xs">Quy chế tự động thăng hạng</h4>
                <p className={`leading-relaxed text-xs ${theme.cardDescClass}`}>
                  Hệ thống sẽ tự động quét hóa đơn của bạn. Mọi giao dịch đặt mua hàng thành công và được xác nhận đã thanh toán (qua Web QR hoặc COD) sẽ ngay lập tức được cộng dồn vào tổng số chi tiêu của tài khoản để kích hoạt thăng cấp VIP.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Current VIP Benefits Perks Grid */}
        <div className="space-y-6 pt-6">
          <div className={`border-b ${theme.borderColor} pb-3.5`}>
            <span className={`text-[9px] font-black tracking-widest uppercase font-mono ${theme.pageLabel}`}>YOUR EXCLUSIVE PERKS</span>
            <h2 className={`text-2xl font-bold font-serif uppercase mt-1 ${theme.pageHeading}`}>Đặc quyền hội viên của bạn</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {theme.perks.map((perk, index) => {
              const Icon = perk.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-6 flex flex-col justify-between h-48 transition-all shadow-xs border ${theme.cardBgClass}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${theme.badgeBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className={`text-xs font-black uppercase tracking-wider font-mono ${theme.cardTitleClass}`}>{perk.title}</h4>
                    <p className={`text-[10px] font-medium leading-relaxed ${theme.cardDescClass}`}>{perk.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Comparison Table Section */}
        <div className="space-y-6 pt-10">
          <div className={`border-b ${theme.borderColor} pb-3.5`}>
            <span className={`text-[9px] font-black tracking-widest uppercase font-mono ${theme.pageLabel}`}>TIERS COMPARISON</span>
            <h2 className={`text-2xl font-bold font-serif uppercase mt-1 ${theme.pageHeading}`}>Bảng so sánh quyền lợi câu lạc bộ</h2>
          </div>

          <div className={`overflow-x-auto shadow-md border ${theme.cardBgClass}`}>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className={`border-b ${theme.borderColor} text-[9px] font-black tracking-widest uppercase font-mono ${theme.id !== 'normal' ? 'bg-white/5 text-stone-300' : 'bg-[#2D5A27]/5 dark:bg-[#2D5A27]/10 text-[#5A5A5A] dark:text-stone-400'}`}>
                  <th className="p-4.5">Hạng Thành Viên</th>
                  <th className="p-4.5">Mức Chiết Khấu</th>
                  <th className="p-4.5">Quà Tặng Sinh Nhật</th>
                  <th className="p-4.5">CSKH Ưu Tiên</th>
                  <th className="p-4.5">Ngưỡng Tích Lũy</th>
                </tr>
              </thead>
              <tbody className={`divide-y divide-stone-200/40 dark:divide-white/5 font-medium font-sans ${theme.id !== 'normal' ? 'text-stone-300' : 'text-[#5A5A5A] dark:text-stone-300'}`}>
                {/* Normal */}
                <tr className={vipLevel === 'normal' ? 'bg-[#2D5A27]/5 font-extrabold text-[#2D5A27] dark:text-brand-green-light' : ''}>
                  <td className={`p-4.5 font-bold ${theme.id !== 'normal' ? 'text-stone-200' : 'text-[#1A1A1A] dark:text-stone-200'}`}>
                    Standard (Tiêu chuẩn)
                  </td>
                  <td className="p-4.5 font-mono">0%</td>
                  <td className="p-4.5">Không</td>
                  <td className="p-4.5 text-stone-450">Thường</td>
                  <td className="p-4.5 font-mono">0đ</td>
                </tr>

                {/* Silver */}
                <tr className={vipLevel === 'silver' ? `bg-zinc-800/30 font-extrabold ${theme.id !== 'normal' ? 'text-white' : 'text-stone-300'}` : ''}>
                  <td className={`p-4.5 font-bold ${theme.id !== 'normal' ? 'text-stone-200' : 'text-stone-400 dark:text-stone-100'} flex items-center gap-1.5`}>
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-400" />
                    Hạng Bạc (Silver)
                  </td>
                  <td className="p-4.5 font-mono">5%</td>
                  <td className="p-4.5">Voucher 50K</td>
                  <td className="p-4.5">Phản hồi nhanh</td>
                  <td className="p-4.5 font-mono">500.000đ</td>
                </tr>

                {/* Gold */}
                <tr className={vipLevel === 'gold' ? 'bg-[#C8953A]/10 font-extrabold text-[#C8953A]' : ''}>
                  <td className="p-4.5 font-bold text-[#C8953A] flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    Hạng Vàng (Gold)
                  </td>
                  <td className="p-4.5 font-mono font-bold text-[#C8953A]">10%</td>
                  <td className="p-4.5">Hộp quà đặc biệt + 100K</td>
                  <td className="p-4.5 text-amber-500 dark:text-amber-400 font-bold">✓ CSKH Ưu tiên</td>
                  <td className="p-4.5 font-mono">1.500.000đ</td>
                </tr>

                {/* Diamond */}
                <tr className={vipLevel === 'diamond' ? 'bg-cyan-500/5 font-extrabold text-cyan-455' : ''}>
                  <td className="p-4.5 font-bold text-cyan-400 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                    Hạng Kim Cương (Diamond)
                  </td>
                  <td className="p-4.5 font-mono font-bold text-cyan-450">15%</td>
                  <td className="p-4.5">Bộ Combo Premium + 200K</td>
                  <td className="p-4.5 font-bold text-cyan-400">👑 CSKH Cao Cấp 24/7</td>
                  <td className="p-4.5 font-mono">3.000.000đ</td>
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
    <ProtectedRoute>
      <VipDashboard />
    </ProtectedRoute>
  );
}
