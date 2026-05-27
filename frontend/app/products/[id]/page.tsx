'use client';

import React, { useState, use } from 'react';
import { products } from '../../data/products';
import { ArrowLeft, Clock, MessageSquare, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const product = products.find((p) => p.id === resolvedParams.id);

  if (!product) {
    notFound();
  }

  const [selectedWeight, setSelectedWeight] = useState(product.sizes[0].weight);
  const [activeTab, setActiveTab] = useState<'nutrition' | 'cooking' | 'origin'>('nutrition');
  const [copied, setCopied] = useState(false);
  
  // Size price selection
  const sizeInfo = product.sizes.find((s) => s.weight === selectedWeight) || product.sizes[0];

  const handleConsultation = () => {
    const text = `Xin chào Sợi Mộc, tôi đang xem trang web và muốn nhận tư vấn đặt mua sản phẩm: ${product.name} (Hộp ${selectedWeight}) - Giá: ${sizeInfo.priceStr}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        window.open('https://zalo.me/0979862956', '_blank');
      }, 1200);
    });
  };

  return (
    <div className="bg-brand-cream text-brand-charcoal min-h-[90vh] py-12 md:py-20 font-sans">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        
        {/* Back Link */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs font-black tracking-widest text-brand-muted hover:text-brand-charcoal mb-10 transition-colors uppercase font-mono"
        >
          <ArrowLeft className="w-4 h-4" />
          QUAY LẠI DANH SÁCH
        </Link>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">
          
          {/* Left Column: Image Showcase */}
          <div className="lg:col-span-6 space-y-6">
            <div className="aspect-[4/3] w-full bg-white border border-brand-green/10 overflow-hidden relative group">
              {product.badge && (
                <div className="absolute top-4 left-4 bg-brand-green text-white px-3 py-1.5 text-[10px] font-black tracking-widest uppercase font-mono z-15 shadow-sm">
                  {product.badge}
                </div>
              )}
              <motion.img
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Technical highlight points */}
            <div className="grid grid-cols-2 gap-4">
              {product.features.slice(0, 2).map((feat, idx) => (
                <div key={idx} className="p-4 bg-white border border-brand-green/10 font-mono text-[9px] tracking-wider uppercase text-brand-muted">
                  <span className="text-brand-green font-bold block mb-1">⚡ ĐẶC ĐIỂM 0{idx + 1}</span>
                  {feat}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Order Configuration */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            
            {/* Header info */}
            <div className="space-y-4">
              <span className="text-[10px] font-black tracking-widest text-brand-green font-mono uppercase">
                {product.category === 'corn' ? 'NGÔ SẠCH CAO BẰNG' : 'PHIÊN BẢN ĐẶC BIỆT'}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold tracking-normal uppercase leading-[1.15] text-brand-charcoal font-serif">
                {product.name}
              </h1>
              <p className="text-xs font-black tracking-widest text-brand-muted/60 uppercase font-mono">
                {product.tagline}
              </p>
              <p className="text-brand-muted text-sm leading-relaxed pt-2">
                {product.details}
              </p>
            </div>

            {/* Config & Checkout Area */}
            <div className="mt-8 pt-8 border-t border-brand-green/10 space-y-6">
              
              {/* Size Selector */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-black tracking-widest text-brand-muted font-mono uppercase">
                    CHỌN KHỐI LƯỢNG (SIZE)
                  </span>
                  <span className="text-[10px] text-brand-muted/70 font-mono uppercase">
                    {sizeInfo.target}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz.weight}
                      onClick={() => setSelectedWeight(sz.weight)}
                      className={`py-4 px-6 border text-xs font-extrabold tracking-wider transition-all duration-300 flex justify-between items-center cursor-pointer rounded-none ${
                        selectedWeight === sz.weight
                          ? 'border-brand-green bg-brand-green-pale/50 text-brand-green'
                          : 'border-brand-green/10 bg-white text-brand-muted hover:border-brand-green/30 hover:text-brand-charcoal'
                      }`}
                    >
                      <span>HỘP {sz.weight.toUpperCase()}</span>
                      <span className={selectedWeight === sz.weight ? 'text-brand-green font-black' : 'text-brand-muted'}>
                        {sz.priceStr}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Details */}
              <div className="flex items-center justify-between gap-6 bg-white p-4 border border-brand-green/10">
                <div className="space-y-1">
                  <span className="text-[9px] text-brand-muted/70 font-bold uppercase tracking-wider block">
                    Giá tham khảo
                  </span>
                  <span className="text-2xl font-black text-brand-charcoal font-sans">
                    {sizeInfo.priceStr}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-brand-muted font-medium">
                  <ShieldCheck className="w-4 h-4 text-brand-green" />
                  Giao hàng COD toàn quốc
                </div>
              </div>

              {/* Consultation Button */}
              <div className="relative">
                <button
                  onClick={handleConsultation}
                  className="w-full py-5 bg-brand-green hover:bg-brand-green-hover text-white font-extrabold text-xs tracking-widest transition-colors flex items-center justify-center gap-2 uppercase rounded-none cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  {copied ? 'ĐÃ COPY LỜI NHẮN! ĐANG MỞ ZALO...' : 'NHẬN TƯ VẤN & ĐẶT MUA QUA ZALO'}
                </button>

                <AnimatePresence>
                  {copied && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute left-0 right-0 -bottom-6 text-center text-[10px] text-brand-green font-bold"
                    >
                      ✓ Lời nhắn đã được lưu. Hãy dán (Paste) vào ô chat Zalo sắp mở ra!
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

            </div>

            {/* Product Specifications & Details Tab */}
            <div className="mt-10 border-t border-brand-green/10 pt-8">
              <div className="flex gap-2 border-b border-brand-green/10 pb-2">
                <button
                  onClick={() => setActiveTab('nutrition')}
                  className={`px-4 py-2 text-[10px] font-black tracking-widest uppercase transition-colors rounded-none ${
                    activeTab === 'nutrition' ? 'text-brand-green border-b-2 border-brand-green' : 'text-brand-muted hover:text-brand-charcoal'
                  }`}
                >
                  Dinh Dưỡng
                </button>
                <button
                  onClick={() => setActiveTab('cooking')}
                  className={`px-4 py-2 text-[10px] font-black tracking-widest uppercase transition-colors rounded-none ${
                    activeTab === 'cooking' ? 'text-brand-green border-b-2 border-brand-green' : 'text-brand-muted hover:text-brand-charcoal'
                  }`}
                >
                  Chế Biến
                </button>
                <button
                  onClick={() => setActiveTab('origin')}
                  className={`px-4 py-2 text-[10px] font-black tracking-widest uppercase transition-colors rounded-none ${
                    activeTab === 'origin' ? 'text-brand-green border-b-2 border-brand-green' : 'text-brand-muted hover:text-brand-charcoal'
                  }`}
                >
                  Cam kết
                </button>
              </div>

              <div className="py-4 text-xs text-brand-muted leading-relaxed font-medium">
                {activeTab === 'nutrition' && (
                  <div className="space-y-4">
                    <p>Thành phần dinh dưỡng tự nhiên tính trên 100g bún/phở ngô khô:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white p-4 border border-brand-green/10">
                      <div>
                        <p className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Calories</p>
                        <p className="text-base font-black text-brand-charcoal">{product.nutrition.calories}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Carbohydrate</p>
                        <p className="text-base font-black text-brand-charcoal">{product.nutrition.carbs}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Protein (Thực vật)</p>
                        <p className="text-base font-black text-brand-charcoal">{product.nutrition.protein}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Chất Xơ Thô</p>
                        <p className="text-base font-black text-brand-green">{product.nutrition.fiber}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'cooking' && (
                  <div className="space-y-3">
                    <p className="flex items-center gap-1.5 font-mono text-[9px] text-brand-green font-bold uppercase">
                      <Clock className="w-3.5 h-3.5" /> THỜI GIAN LUỘC: {product.cookingTime.toUpperCase()}
                    </p>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>Ngâm qua bún/phở ngô bằng nước lạnh khoảng 5-10 phút để sợi mềm đều hơn.</li>
                      <li>Thả bún/phở vào nồi nước sôi đang đun, luộc khoảng {product.cookingTime} cho đến khi sợi chín trong, mềm và dẻo dai.</li>
                      <li>Vớt bún/phở ra xả dưới vòi nước lạnh hoặc ngâm trong tô nước đá lạnh 2 phút để sợi bún đanh lại, dai ngon hoàn hảo.</li>
                      <li>Để ráo nước, bày ra bát dùng chung với nước dùng gà/bò, xào, hoặc trộn salad tùy thích.</li>
                    </ol>
                  </div>
                )}

                {activeTab === 'origin' && (
                  <div className="space-y-2">
                    <p><strong className="text-brand-charcoal">Xuất xứ:</strong> Quảng Uyên, Quảng Hòa, Cao Bằng.</p>
                    <p><strong className="text-brand-charcoal">Hạn sử dụng:</strong> 12 tháng kể từ ngày sản xuất (in trên bao bì).</p>
                    <p><strong className="text-brand-charcoal">Cam kết 3 KHÔNG:</strong> KHÔNG HÀN THA // KHÔNG CHẤT BẢO QUẢN // KHÔNG PHẨM MÀU HÓA HỌC. Màu vàng vàng óng ánh 100% tự nhiên của hạt ngô tẻ Cao Bằng chín già.</p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
