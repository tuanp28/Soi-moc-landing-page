'use client';

import React from 'react';
import { Product } from '../data/products';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Format prices
  const minPriceSize = product.sizes.reduce((prev, curr) => prev.price < curr.price ? prev : curr);
  const minPrice = minPriceSize.price;
  const maxPrice = Math.max(...product.sizes.map((s) => s.price));
  
  const hasDiscount = !!minPriceSize.originalPrice && minPriceSize.originalPrice > minPrice;
  const discountPercent = hasDiscount 
    ? Math.round(((minPriceSize.originalPrice! - minPrice) / minPriceSize.originalPrice!) * 100)
    : 0;

  const priceRange = minPrice === maxPrice 
    ? minPrice.toLocaleString('vi-VN') + 'đ'
    : `${minPrice.toLocaleString('vi-VN')}đ - ${maxPrice.toLocaleString('vi-VN')}đ`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(45, 90, 39, 0.12)", borderColor: "#4A7C3F" }}
      className="group relative flex flex-col justify-between bg-white border border-brand-green/10 h-full overflow-hidden"
    >
      {/* Badge (Best Seller, New, etc) */}
      {product.badge && (
        <div className="absolute top-4 left-4 bg-brand-green text-white px-2.5 py-1 text-[9px] font-black tracking-widest uppercase font-mono z-30 shadow-sm">
          {product.badge}
        </div>
      )}

      {/* Image Area */}
      <Link href={`/products/${product.id}`} className="block relative aspect-[3/4] overflow-hidden bg-white cursor-pointer border-b border-brand-green/5">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
          loading="lazy"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Shopee-style Discount Tag */}
        {hasDiscount && (
          <div 
            className="absolute top-0 right-2 bg-[#ffd839]/95 text-[#ee4d2d] z-20 flex flex-col items-center justify-center w-11 pt-2 pb-3 font-sans text-[10px] font-bold shadow-xs select-none"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 84%, 0 100%)' }}
          >
            <span className="text-[13px] font-black leading-none">{discountPercent}%</span>
            <span className="text-[9px] font-bold text-white bg-[#ee4d2d] px-1 rounded-[1.5px] uppercase leading-none py-0.5 mt-1 font-mono">GIẢM</span>
          </div>
        )}
        
        {/* Quick Tech Overlay */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 border border-brand-green/10 font-mono text-[8px] text-brand-muted tracking-wider uppercase font-semibold z-10">
          ⚡ {product.cookingTime}
        </div>
      </Link>

      {/* Product Content */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div className="space-y-2">
          {/* Category */}
          <span className="text-[9px] font-black tracking-widest text-brand-green font-mono uppercase">
            {product.category === 'corn' ? 'NGÔ SẠCH DINH DƯỠNG' : 'ĐẶC SẢN CAO BẰNG'}
          </span>
          
          {/* Title */}
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="text-lg font-black tracking-wide text-brand-charcoal uppercase font-serif hover:text-brand-green transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-brand-muted text-xs leading-relaxed line-clamp-2 font-medium">
            {product.description}
          </p>
        </div>

        {/* Bottom Area: Price & CTA */}
        <div className="mt-6 pt-4 border-t border-brand-green/5 flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-[9px] text-brand-muted/55 font-bold uppercase tracking-wider">Giá từ</p>
            {hasDiscount ? (
              <div className="flex items-baseline gap-2">
                <span className="text-lg sm:text-xl font-extrabold text-[#ee4d2d] dark:text-[#ff6046] font-sans leading-none">
                  {minPrice.toLocaleString('vi-VN')}đ
                </span>
                <span className="text-xs text-brand-muted/65 line-through font-medium font-sans">
                  {minPriceSize.originalPrice!.toLocaleString('vi-VN')}đ
                </span>
              </div>
            ) : (
              <p className="text-base sm:text-lg font-extrabold text-brand-charcoal font-sans">{priceRange}</p>
            )}
          </div>

          <Link
            href={`/products/${product.id}`}
            className="px-4 py-2.5 bg-brand-charcoal hover:bg-brand-green text-white hover:text-white transition-all duration-300 text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5 cursor-pointer hover:shadow-xs active:scale-95"
          >
            ĐẶT MUA
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
export default ProductCard;
