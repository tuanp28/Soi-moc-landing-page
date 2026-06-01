'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Flame, Shield, Activity } from 'lucide-react';

const LeafSVG: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 8C8 10 5.9 16.1 5.1 19C7.4 18.2 13.5 16 15.5 7.1C16.2 4.1 18.3 2 18.3 2S16.2 4.1 17 8Z" />
    <path d="M2 22C2 22 5.5 17.5 11.5 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#F2EADF] via-[#FAF6EE] to-[#F2EADF] pt-24 lg:pt-32 pb-16 border-b border-brand-green/10">
      {/* Background Graphic Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#2D5A2703_1px,transparent_1px),linear-gradient(to_bottom,#2D5A2703_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_20%,#F9F4EC_90%] pointer-events-none" />

      {/* Glowing Ambient Mesh Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[380px] h-[380px] rounded-full bg-brand-green/12 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[480px] h-[480px] rounded-full bg-brand-gold/15 blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-1/3 w-80 h-80 rounded-full bg-rose-200/8 blur-3xl pointer-events-none" />

      {/* Floating Organic Leaves */}
      <motion.div
        animate={{
          y: [0, -18, 0],
          x: [0, 12, 0],
          rotate: [0, 30, 0]
        }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        className="absolute top-1/4 left-[8%] text-brand-green/15 w-8 h-8 pointer-events-none hidden lg:block"
      >
        <LeafSVG className="w-full h-full text-brand-green/10" />
      </motion.div>
      <motion.div
        animate={{
          y: [0, 24, 0],
          x: [0, -15, 0],
          rotate: [0, -45, 0]
        }}
        transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
        className="absolute bottom-1/4 right-[10%] text-brand-gold/15 w-10 h-10 pointer-events-none hidden lg:block"
      >
        <LeafSVG className="w-full h-full text-brand-gold/10" />
      </motion.div>

      {/* Decorative Giant Background Slogan */}
      <div className="absolute -left-10 bottom-10 text-[12vw] font-black leading-none text-brand-green/[0.04] select-none tracking-tighter uppercase font-sans">
        JUST EAT IT
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 py-10">
        
        {/* Text Content */}
        <div className="lg:col-span-8 flex flex-col justify-center space-y-6 text-left">
          
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-brand-green-pale border border-brand-green/20 px-3 py-1.5 w-fit"
          >
            <Flame className="w-4 h-4 text-brand-green animate-pulse" />
            <span className="text-[10px] font-black tracking-widest text-brand-green uppercase font-mono">
              SIÊU THỰC PHẨM THẾ HỆ MỚI
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-black tracking-tight leading-[1.25] uppercase font-serif"
          >
            <span className="block text-3xl sm:text-4xl md:text-6xl xl:text-7xl text-brand-green mb-3 md:mb-5">
              NĂNG LƯỢNG MỘC
            </span>
            <span className="block text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-brand-gold relative w-fit pb-2 select-none whitespace-nowrap mt-1 md:mt-2">
              DINH DƯỠNG SẠCH TỪ THIÊN NHIÊN
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                className="absolute bottom-0 left-0 w-full h-[3px] bg-brand-gold origin-left rounded-full shadow-[0_0_12px_rgba(200,149,58,0.6)]"
              />
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-brand-muted text-sm md:text-base max-w-xl leading-relaxed font-medium"
          >
            Được chế biến từ hạt ngô tẻ đặc sản Cao Bằng qua công nghệ sấy lạnh khép kín 36 giờ, sợi phở ngô Sợi Mộc mang lại nguồn dinh dưỡng sạch từ thiên nhiên nhờ nguồn Carb phức hợp hấp thu chậm và chất xơ dồi dào, tiếp thêm năng lượng sạch lành cho ngày dài năng động.
          </motion.p>

          {/* Technical Specs Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-3 gap-4 border-y border-brand-green/10 py-4 max-w-lg font-mono text-[10px] tracking-widest text-brand-muted uppercase"
          >
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-brand-green" />
              <div>
                <p className="text-brand-charcoal font-bold">100% TỰ NHIÊN</p>
                <p className="text-[8px] text-brand-muted/70">Không chất bảo quản</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 border-x border-brand-green/10 px-4">
              <Activity className="w-4 h-4 text-brand-green" />
              <div>
                <p className="text-brand-charcoal font-bold">SLOW CARBS</p>
                <p className="text-[8px] text-brand-muted/70">Ổn định đường huyết</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 pl-2">
              <Flame className="w-4 h-4 text-brand-green" />
              <div>
                <p className="text-brand-charcoal font-bold">GLUTEN FREE</p>
                <p className="text-[8px] text-brand-muted/70">Nhẹ bụng, dễ tiêu</p>
              </div>
            </div>
          </motion.div>

          {/* Action CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center gap-4 pt-4"
          >
            <Link
              href="/products"
              className="px-8 py-4 bg-brand-green hover:bg-brand-green-hover text-white font-extrabold text-xs tracking-widest transition-colors flex items-center gap-2 uppercase group rounded-none"
            >
              XEM SẢN PHẨM PREMIUM
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 border border-brand-green/20 hover:border-brand-green text-brand-green hover:text-white font-extrabold text-xs tracking-widest transition-all duration-300 uppercase rounded-none"
            >
              TÌM HIỂU CÂU CHUYỆN
            </Link>
          </motion.div>
        </div>

        {/* Floating Product Image Showcase */}
        <div className="lg:col-span-4 relative flex justify-center items-center h-[350px] md:h-[450px]">
          {/* Spotlight behind product */}
          <div className="absolute w-[300px] h-[300px] rounded-full bg-brand-gold/15 blur-2xl pointer-events-none" />

          {/* Decorative Background Ring */}
          <div className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full border-4 border-dashed border-brand-green/5 animate-[spin_60s_linear_infinite]" />
          
          {/* Main Product Image Container */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
            className="relative w-64 h-64 md:w-80 md:h-80 z-20"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
              whileHover={{ scale: 1.05, rotate: 2, boxShadow: "0 30px 60px rgba(45, 90, 39, 0.2)" }}
              className="w-full h-full cursor-grab active:cursor-grabbing transition-shadow duration-300"
            >
              <img
                src="/images/pho1.jpg"
                alt="Phở Ngô Khô Sợi Mộc"
                className="w-full h-full object-cover shadow-xl rounded-none border border-brand-green/10"
              />
              {/* Corner Badges */}
              <div className="absolute -top-3 -right-3 bg-brand-gold text-white px-3 py-1 text-[9px] font-black tracking-widest uppercase font-mono shadow-sm">
                BEST SELLER
              </div>
              <div className="absolute -bottom-3 -left-3 bg-brand-cream border border-brand-green/20 text-brand-green px-3 py-1 text-[9px] font-black tracking-widest uppercase font-mono shadow-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-ping" />
                SẴN HÀNG
              </div>
            </motion.div>
          </motion.div>

          {/* Floating Decorative Badges */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="absolute top-12 left-6 bg-brand-cream border border-brand-green/10 px-3 py-2 z-30 shadow-md"
          >
            <p className="text-[8px] text-brand-muted font-bold uppercase tracking-wider">Hàm lượng xơ</p>
            <p className="text-xs font-black text-brand-green">4.2g / 100g</p>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
            className="absolute bottom-12 right-6 bg-brand-cream border border-brand-green/10 px-3 py-2 z-30 shadow-md"
          >
            <p className="text-[8px] text-brand-muted font-bold uppercase tracking-wider">Quy trình sấy</p>
            <p className="text-xs font-black text-brand-charcoal">SẤY LẠNH 36H</p>
          </motion.div>
        </div>

      </div>
    </section>
  );
};
export default Hero;
