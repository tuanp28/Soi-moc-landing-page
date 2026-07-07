'use client';

import React from 'react';
import { Hero } from './components/Hero';
import { ValueShowcase } from './components/ValueShowcase';
import { Manifesto } from './components/Manifesto';
import { TechShowcase } from './components/TechShowcase';
import { ReviewSection } from './components/ReviewSection';
import { ProductCard } from './components/ProductCard';
import { products } from './data/products';
import { ArrowRight, Phone, Award } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [productsList, setProductsList] = React.useState(products);

  React.useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products) {
          setProductsList(data.products);
        }
      })
      .catch((err) => console.error('Error loading products for homepage:', err));
  }, []);

  // Select main corn products for the homepage highlight
  const featuredProducts = productsList.filter(p => p.category === 'corn');
  const specialtyProducts = productsList.filter(p => p.category === 'specialty');

  return (
    <div className="bg-brand-cream text-brand-charcoal min-h-screen font-sans">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Brand Slogan Running Marquee */}
      <div className="bg-brand-green text-white py-4 overflow-hidden whitespace-nowrap border-y border-brand-green-hover relative z-10 font-sans shadow-xs">
        <div className="inline-block animate-[marquee_25s_linear_infinite] uppercase font-black text-xs tracking-widest">
          <span>100% CORN POWDER // STONE GROUND TECHNOLOGY // GLUTEN-FREE // SLOW DIGESTING CARBS // 36H COLD DEHYDRATION // NO PRESERVATIVES // </span>
          <span>100% CORN POWDER // STONE GROUND TECHNOLOGY // GLUTEN-FREE // SLOW DIGESTING CARBS // 36H COLD DEHYDRATION // NO PRESERVATIVES // </span>
        </div>
      </div>

      {/* Custom Keyframes in Tailwind */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* 2.5. Value Proposition Grid Showcase */}
      <ValueShowcase />

      {/* 2.7. Special Promotions Section */}
      <section className="py-20 bg-brand-cream border-t border-brand-green/5 max-w-7xl mx-auto px-5 md:px-10">
        <div className="space-y-4 mb-12 text-center md:text-left">
          <span className="block text-xs font-black tracking-widest text-brand-green uppercase font-mono">
            SPECIAL PROMOTIONS
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-normal uppercase text-brand-charcoal font-serif">
            Chương Trình Ưu Đãi Đang Diễn Ra
          </h2>
          <p className="text-brand-muted text-sm max-w-xl font-medium">
            Tận hưởng các ưu đãi đặc biệt khi đặt mua bún/phở ngô sạch và dinh dưỡng trực tuyến tại website Sợi Mộc.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Promo 1: Buy 3 get 5% off */}
          <div className="bg-white border border-brand-green/10 flex flex-col justify-between group overflow-hidden hover:border-brand-green/30 transition-all duration-300">
            <div className="w-full relative bg-stone-100 overflow-hidden">
              <img
                src="/images/promo-combo-3.jpg"
                alt="Mua Combo 3 Sản Phẩm Giảm 5%"
                className="w-full h-auto block group-hover:scale-103 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-amber-500 text-black px-3 py-1.5 text-[10px] font-black tracking-widest uppercase font-mono">
                GIẢM 5%
              </div>
            </div>
            <div className="p-6 md:p-8 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="text-lg md:text-xl font-bold uppercase font-serif text-brand-charcoal">
                  Mua Combo 3 Sản Phẩm Giảm 5%
                </h3>
                <p className="text-xs text-brand-muted leading-relaxed font-medium">
                  Sức khỏe nhân ba, ưu đãi tối đa! Tiết kiệm ngay 5% trên tổng giá trị hàng khi chọn mua từ 3 sản phẩm Sợi Mộc bất kỳ (Bún Ngô, Bún Đen, Bún Cẩm, Bún Ngũ Sắc...). Hệ thống tự động áp dụng khi thêm vào giỏ hàng.
                </p>
              </div>
              <div className="pt-4 border-t border-brand-green/5">
                <button
                  onClick={() => {
                    const el = document.getElementById('products-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-4 bg-brand-green hover:bg-brand-green-hover text-white text-[10px] font-black tracking-widest uppercase transition-all duration-300 rounded-none cursor-pointer text-center"
                >
                  MUA NGAY - NHẬN ƯU ĐÃI!
                </button>
              </div>
            </div>
          </div>

          {/* Promo 2: Buy 5 Get 1 Free */}
          <div className="bg-white border border-brand-green/10 flex flex-col justify-between group overflow-hidden hover:border-brand-green/30 transition-all duration-300">
            <div className="w-full relative bg-stone-100 overflow-hidden">
              <img
                src="/images/promo-buy5get1.jpg"
                alt="Mua 5 Tặng 1 Gói Bún Ngô"
                className="w-full h-auto block group-hover:scale-103 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1.5 text-[10px] font-black tracking-widest uppercase font-mono">
                MUA 5 TẶNG 1
              </div>
            </div>
            <div className="p-6 md:p-8 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="text-lg md:text-xl font-bold uppercase font-serif text-brand-charcoal">
                  Siêu Khuyến Mại: Mua 5 Tặng 1
                </h3>
                <p className="text-xs text-brand-muted leading-relaxed font-medium">
                  Mua 5 sản phẩm Sợi Mộc bất kỳ (Bún Ngô, Bún Cẩm, Bún Đen, Bún Ngũ Sắc...) - Tặng ngay 1 gói Bún Ngô Cao Tuyền (500g) hảo hạng. Áp dụng tự động cộng quà khi đặt hàng trực tuyến trên website.
                </p>
              </div>
              <div className="pt-4 border-t border-brand-green/5">
                <button
                  onClick={() => {
                    const el = document.getElementById('products-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-4 bg-brand-green hover:bg-brand-green-hover text-white text-[10px] font-black tracking-widest uppercase transition-all duration-300 rounded-none cursor-pointer text-center"
                >
                  SĂN NGAY BẬT MÀU!
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Product Showcase Section */}
      <section id="products-section" className="py-24 max-w-7xl mx-auto px-5 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4">
            <span className="block text-xs font-black tracking-widest text-brand-green uppercase font-mono">
              FLAGSHIP FLAVORS
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-normal uppercase text-brand-charcoal leading-[1.15] font-serif">
              DÒNG SẢN PHẨM SỢI NGÔ
            </h2>
            <p className="text-brand-muted text-sm md:text-base max-w-xl font-medium">
              Khám phá hai dòng sản phẩm chủ đạo được tinh chế đặc biệt từ ngô Cao Bằng. Hương vị thơm ngon tự nhiên, tối ưu dưỡng chất cho mọi bữa ăn.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-black tracking-widest border-b-2 border-brand-green pb-1 text-brand-charcoal hover:text-brand-green transition-colors uppercase font-sans"
          >
            Xem tất cả sản phẩm
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Featured Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Specialty Products Section */}
        <div className="border-t border-brand-green/10 pt-20">
          <div className="mb-12">
            <span className="block text-xs font-black tracking-widest text-brand-green uppercase font-mono">
              SPECIAL EDITION
            </span>
            <h3 className="text-2xl md:text-4xl font-bold tracking-normal uppercase text-brand-charcoal font-serif mt-2 leading-[1.15]">
              Sản phẩm đặc sản ngũ sắc
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {specialtyProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Manifesto Section */}
      <Manifesto />

      {/* 5. Noodle Technology Showcase */}
      <TechShowcase />

      {/* 6. Review Section */}
      <ReviewSection />

      {/* 7. High-Impact Call to Action Banner */}
      <section className="py-24 bg-gradient-to-r from-brand-green via-brand-green-light to-brand-green-hover text-white relative overflow-hidden">
        {/* Background Texture Graphic */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-5 md:px-10 text-center relative z-10 space-y-8">
          <div className="inline-flex items-center gap-1.5 bg-white/10 text-white text-[9px] font-black tracking-widest uppercase px-3 py-1.5 font-mono border border-white/20">
            <Award className="w-3.5 h-3.5 text-brand-gold fill-brand-gold" />
            CHẤT LƯỢNG TIÊU CHUẨN XUẤT KHẨU
          </div>

          <h2 className="text-3xl md:text-6xl font-extrabold tracking-tight uppercase leading-[1.2] font-serif">
            SẴN SÀNG TRẢI NGHIỆM DINH DƯỠNG SẠCH LÀNH?
          </h2>

          <p className="text-white/80 font-bold text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Liên hệ đặt mua hoặc hợp tác đại lý để mang sợi phở/bún ngô Cao Bằng chất lượng thượng hạng về gia đình hoặc cơ sở kinh doanh của bạn.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link
              href="/products"
              className="w-full sm:w-auto px-10 py-5 bg-white hover:bg-stone-100 text-stone-900 font-extrabold text-xs tracking-widest transition-colors uppercase rounded-none"
            >
              SHOP PRODUCTS NOW
            </Link>
            <a
              href="https://zalo.me/0979862956"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-10 py-5 border-2 border-white/70 hover:bg-white hover:text-stone-900 text-white font-extrabold text-xs tracking-widest transition-colors uppercase flex items-center justify-center gap-2 rounded-none"
            >
              <Phone className="w-4 h-4" />
              HOTLINE: 0979.862.956
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
