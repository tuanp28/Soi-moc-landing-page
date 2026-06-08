'use client';

import React, { useState } from 'react';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

type CategoryFilter = 'all' | 'corn' | 'specialty';

const LeafSVG: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 8C8 10 5.9 16.1 5.1 19C7.4 18.2 13.5 16 15.5 7.1C16.2 4.1 18.3 2 18.3 2S16.2 4.1 17 8Z" />
    <path d="M2 22C2 22 5.5 17.5 11.5 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default function ProductsPage() {
  const [filter, setFilter] = useState<CategoryFilter>('all');

  const filteredProducts = products.filter((product) => {
    if (filter === 'all') return true;
    return product.category === filter;
  });

  const filterTabs = [
    { label: 'TẤT CẢ SẢN PHẨM', val: 'all' },
    { label: 'SẢN PHẨM TỪ NGÔ', val: 'corn' },
    { label: 'ĐẶC SẢN CAO BẰNG', val: 'specialty' },
  ];

  return (
    <div className="relative min-h-[90vh] bg-gradient-to-b from-[#F2EADF] via-[#FAF6EE] to-[#F2EADF] dark:from-[#151A13] dark:via-[#111510] dark:to-[#151A13] py-16 md:py-24 overflow-hidden font-sans text-brand-charcoal">
      
      {/* Background Graphic Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2ddd5_1px,transparent_1px),linear-gradient(to_bottom,#e2ddd5_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(250,246,238,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(250,246,238,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_30%,#F9F4EC_95%] dark:bg-radial-[circle_at_center,transparent_30%,#111510_95%] pointer-events-none" />

      {/* Decorative Dashed Arc Circles */}
      <div className="absolute top-[20%] right-[-100px] w-[500px] h-[500px] rounded-full border border-dashed border-[#2D5A27]/10 dark:border-white/5 pointer-events-none z-0" />
      <div className="absolute bottom-[20%] left-[-150px] w-[400px] h-[400px] rounded-full border border-dashed border-[#2D5A27]/8 dark:border-white/5 pointer-events-none z-0" />

      {/* Glowing Ambient Mesh Orbs */}
      <div className="absolute top-1/4 left-1/10 w-[350px] h-[350px] rounded-full bg-brand-green/8 dark:bg-brand-green/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-[450px] h-[450px] rounded-full bg-brand-gold/10 dark:bg-brand-gold/5 blur-3xl pointer-events-none" />

      {/* Drifting Organic Particles (Falling Blurry Green Leaves) */}
      <motion.div
        animate={{
          y: [-20, 800],
          x: [0, 40, 0],
          rotate: [0, 240],
          opacity: [0, 0.95, 0.95, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-[5%] left-[25%] w-5 h-3 bg-[#2D5A27]/40 dark:bg-brand-green/25 rounded-full blur-[1px] pointer-events-none z-0"
      />
      <motion.div
        animate={{
          y: [-20, 600],
          x: [0, -30, 0],
          rotate: [45, 285],
          opacity: [0, 0.95, 0.95, 0]
        }}
        transition={{ duration: 18, repeat: Infinity, delay: 5, ease: "linear" }}
        className="absolute top-[15%] left-[65%] w-4.5 h-2.5 bg-[#2D5A27]/35 dark:bg-brand-green/20 rounded-full blur-[1.2px] pointer-events-none z-0"
      />
      <motion.div
        animate={{
          y: [-20, 700],
          x: [0, 35, 0],
          rotate: [90, 330],
          opacity: [0, 0.95, 0.95, 0]
        }}
        transition={{ duration: 22, repeat: Infinity, delay: 10, ease: "linear" }}
        className="absolute top-[10%] left-[85%] w-3.5 h-2 bg-[#C8953A]/45 dark:bg-brand-gold/25 rounded-full blur-[0.8px] pointer-events-none z-0"
      />

      {/* Floating Organic Leaves */}
      <motion.div
        animate={{
          y: [0, -18, 0],
          x: [0, 12, 0],
          rotate: [0, 30, 0]
        }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        className="absolute top-[15%] left-[5%] text-brand-green/15 w-8 h-8 pointer-events-none hidden lg:block z-0"
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
        className="absolute bottom-[30%] right-[5%] text-brand-gold/15 w-10 h-10 pointer-events-none hidden lg:block z-0"
      >
        <LeafSVG className="w-full h-full text-brand-gold/10" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-5 md:px-10 relative z-10">
        
        {/* Header Block */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border-b border-brand-green/10 pb-10 mb-12"
        >
          <span className="block text-xs font-black tracking-widest text-brand-green uppercase font-mono">
            SHOP CATALOG
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-normal uppercase text-brand-charcoal mt-3 leading-[1.15] font-serif">
            SẢN PHẨM CỦA CHÚNG TÔI
          </h1>
          <p className="text-brand-muted text-sm font-medium mt-3 max-w-xl">
            Lựa chọn dinh dưỡng tối ưu từ hạt ngô quê và nông sản vùng cao Cao Bằng. 100% tự nhiên, sạch và lành.
          </p>
        </motion.div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap gap-2 md:gap-4 mb-12 border-b border-brand-green/10 pb-6">
          {filterTabs.map((tab) => (
            <button
              key={tab.val}
              onClick={() => setFilter(tab.val as CategoryFilter)}
              className={`px-5 py-3 text-[10px] font-black tracking-widest uppercase transition-all duration-300 cursor-pointer rounded-none relative border ${
                filter === tab.val
                  ? 'bg-brand-green text-white border-brand-green font-extrabold'
                  : 'bg-white text-brand-muted border-brand-green/10 hover:text-brand-charcoal hover:bg-brand-cream/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}

            {/* Teaser card for updates */}
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <div className="h-full w-full flex flex-col justify-center items-center p-8 bg-white border border-dashed border-brand-green/20 text-center space-y-4 min-h-[320px]">
                <div className="w-12 h-12 rounded-full bg-brand-green/5 flex items-center justify-center text-brand-green">
                  <span className="text-xl animate-pulse">✨</span>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black tracking-widest text-brand-green font-mono uppercase">COMING SOON</p>
                  <h3 className="text-base font-bold text-brand-charcoal uppercase font-serif">Đang Cập Nhật Sản Phẩm</h3>
                </div>
                <p className="text-[11px] text-brand-muted max-w-[200px] leading-relaxed font-medium">
                  Chúng tôi đang nghiên cứu thêm các dòng bún/phở ngô và đặc sản sạch Cao Bằng mới.
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-brand-muted uppercase tracking-widest font-mono text-xs">
            Không tìm thấy sản phẩm phù hợp.
          </div>
        )}

      </div>
    </div>
  );
}
