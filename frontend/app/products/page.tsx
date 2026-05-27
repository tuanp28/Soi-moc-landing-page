'use client';

import React, { useState } from 'react';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

type CategoryFilter = 'all' | 'corn' | 'specialty';

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
    <div className="bg-brand-cream text-brand-charcoal min-h-[80vh] py-16 font-sans">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        
        {/* Header Block */}
        <div className="border-b border-brand-green/10 pb-10 mb-12">
          <span className="block text-xs font-black tracking-widest text-brand-green uppercase font-mono">
            SHOP CATALOG
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-normal uppercase text-brand-charcoal mt-3 leading-[1.15] font-serif">
            SẢN PHẨM CỦA CHÚNG TÔI
          </h1>
          <p className="text-brand-muted text-sm font-medium mt-3 max-w-xl">
            Lựa chọn dinh dưỡng tối ưu từ hạt ngô quê và nông sản vùng cao Cao Bằng. 100% tự nhiên, sạch và lành.
          </p>
        </div>

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
