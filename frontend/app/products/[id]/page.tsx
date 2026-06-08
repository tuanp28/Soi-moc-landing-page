'use client';

import React, { useState, useEffect, use } from 'react';
import { products as localProducts, Product } from '../../data/products';
import { supabase } from '@/src/lib/supabase';
import { ArrowLeft, Clock, MessageSquare, ShieldCheck, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/app/context/CartContext';
import { ReviewSection } from '@/app/components/ReviewSection';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'nutrition' | 'cooking' | 'origin'>('nutrition');
  const [copied, setCopied] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', resolvedParams.id)
          .single();

        if (error || !data) {
          const local = localProducts.find((p) => p.id === resolvedParams.id);
          if (local) {
            setProduct(local);
            if (local.sizes && local.sizes.length > 0) {
              setSelectedWeight(local.sizes[0].weight);
            }
          }
        } else {
          const mapped: Product = {
            id: data.id,
            name: data.name,
            tagline: data.tagline || '',
            description: data.description || '',
            details: data.details || '',
            image: data.image || '',
            images: data.images || (data.image ? [data.image] : []),
            features: data.features || [],
            cookingTime: data.cookingTime || data.cooking_time || '',
            nutrition: data.nutrition || {
              calories: data.calories || '',
              carbs: data.carbs || '',
              protein: data.protein || '',
              fiber: data.fiber || '',
              fat: data.fat || ''
            },
            sizes: data.sizes || [],
            category: data.category || 'specialty',
            badge: data.badge || null
          };
          setProduct(mapped);
          if (mapped.sizes && mapped.sizes.length > 0) {
            setSelectedWeight(mapped.sizes[0].weight);
          }
        }
      } catch (err) {
        console.warn('Supabase product detail query error, using local fallback:', err);
        const local = localProducts.find((p) => p.id === resolvedParams.id);
        if (local) {
          setProduct(local);
          if (local.sizes && local.sizes.length > 0) {
            setSelectedWeight(local.sizes[0].weight);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#F9F4EC] gap-4">
        <div className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-black tracking-widest text-brand-muted uppercase font-mono animate-pulse">
          Đang tải chi tiết sản phẩm...
        </p>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const productImages = product.images && product.images.length > 0 ? product.images : [product.image];
  
  // Size price selection
  const sizeInfo = product.sizes.find((s) => s.weight === selectedWeight) || product.sizes[0] || {
    weight: '500g', price: 0, priceStr: 'Liên hệ', target: ''
  };

  const handleConsultation = () => {
    const text = `Xin chào Sợi Mộc, tôi đang xem trang web và muốn nhận tư vấn đặt mua sản phẩm: ${product.name} (Túi ${selectedWeight}) - Giá: ${sizeInfo.priceStr}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        window.open('https://zalo.me/0377159498', '_blank');
      }, 1200);
    });
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, selectedWeight);
    }
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
            <div className="aspect-[3/4] w-full bg-white border border-brand-green/10 overflow-hidden relative group flex items-center justify-center">
              {product.badge && (
                <div className="absolute top-4 left-4 bg-brand-green text-white px-3 py-1.5 text-[10px] font-black tracking-widest uppercase font-mono z-25 shadow-sm">
                  {product.badge}
                </div>
              )}
              
              <div className="w-full h-full relative flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full relative"
                  >
                    <Image
                      src={productImages[activeImageIndex]}
                      alt={`${product.name} - Ảnh ${activeImageIndex + 1}`}
                      fill
                      priority={activeImageIndex === 0}
                      sizes="(max-width: 768px) 100vw, 600px"
                      className="object-cover select-none"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Arrows */}
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-brand-charcoal p-2.5 border border-brand-green/10 hover:border-brand-green/30 transition-all z-20 cursor-pointer shadow-sm hover:scale-105 active:scale-95 focus:outline-none"
                    aria-label="Ảnh trước"
                  >
                    <ChevronLeft className="w-5 h-5 text-brand-charcoal" />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-brand-charcoal p-2.5 border border-brand-green/10 hover:border-brand-green/30 transition-all z-20 cursor-pointer shadow-sm hover:scale-105 active:scale-95 focus:outline-none"
                    aria-label="Ảnh tiếp theo"
                  >
                    <ChevronRight className="w-5 h-5 text-brand-charcoal" />
                  </button>
                </>
              )}

              {/* Slider Dots */}
              {productImages.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-20">
                  {productImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                        activeImageIndex === idx
                          ? 'bg-brand-green w-5'
                          : 'bg-brand-charcoal/20 hover:bg-brand-charcoal/40'
                      }`}
                      aria-label={`Chuyển đến ảnh ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {productImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto py-1 scrollbar-none">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-20 bg-white border-2 overflow-hidden flex-shrink-0 transition-all p-2 cursor-pointer relative ${
                      activeImageIndex === idx
                        ? 'border-brand-green shadow-xs scale-[1.02]'
                        : 'border-brand-green/10 hover:border-brand-green/30 hover:scale-[1.01]'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-contain p-2"
                    />
                  </button>
                ))}
              </div>
            )}
            
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
                      <span>TÚI {sz.weight.toUpperCase()}</span>
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

              {/* Action Buttons: Add to Cart & Consultation */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-5 border-2 border-brand-green hover:bg-brand-green text-brand-green hover:text-white font-black text-xs tracking-widest transition-all duration-300 flex items-center justify-center gap-2.5 uppercase rounded-none cursor-pointer hover:shadow-xs select-none active:scale-[0.99]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  THÊM VÀO GIỎ HÀNG
                </button>

                <div className="flex-1 relative group">
                  <button
                    onClick={handleConsultation}
                    className="w-full py-5 bg-gradient-to-r from-brand-green via-brand-green-hover to-brand-green text-white font-black text-xs tracking-widest hover:shadow-[0_0_25px_rgba(45,90,39,0.35)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2.5 uppercase rounded-none cursor-pointer relative overflow-hidden select-none"
                  >
                    <span className="absolute inset-0 w-full h-full bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <MessageSquare className="w-4 h-4 fill-white/10 text-white animate-pulse" />
                    {copied ? 'ĐÃ COPY LỜI NHẮN!' : 'MUA NHANH QUA ZALO'}
                  </button>

                  <AnimatePresence>
                    {copied && (
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute left-0 right-0 -bottom-6 text-center text-[10px] text-brand-green font-bold z-10"
                      >
                        ✓ Lời nhắn đã lưu. Dán (Paste) vào Zalo sắp mở!
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Trust signals indicators block */}
              <div className="mt-8 p-5 bg-white border border-brand-green/10 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-brand-green/5">
                  <ShieldCheck className="w-5 h-5 text-brand-green shrink-0 animate-pulse" />
                  <span className="text-xs font-black tracking-widest text-brand-charcoal font-mono uppercase">
                    CAM KẾT CHẤT LƯỢNG & ĐỘ TIN CẬY
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-[10px] leading-relaxed tracking-wide text-brand-muted uppercase font-semibold">
                  <div className="flex items-start gap-2">
                    <span className="text-brand-green shrink-0 text-xs font-black">✓</span>
                    <p><strong className="text-brand-charcoal">CAM KẾT 3 KHÔNG:</strong> KHÔNG HÀN THE // KHÔNG CHẤT TẨY // KHÔNG PHẨM MÀU.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-brand-green shrink-0 text-xs font-black">✓</span>
                    <p><strong className="text-brand-charcoal">SHIP COD TOÀN QUỐC:</strong> KIỂM HÀNG TRƯỚC KHI THANH TOÁN TIỀN.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-brand-green shrink-0 text-xs font-black">✓</span>
                    <p><strong className="text-brand-charcoal">BẢO HÀNH ĐỔI TRẢ:</strong> 1 ĐỔI 1 MIỄN PHÍ TRONG 7 NGÀY NẾU BỊ ẨM MỐC.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-brand-green shrink-0 text-xs font-black">✓</span>
                    <p><strong className="text-brand-charcoal">CHỨNG NHẬN OCOP:</strong> ĐẠT CHUẨN OCOP VÀ VỆ SINH AN TOÀN THỰC PHẨM.</p>
                  </div>
                </div>
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
      
      {/* Reviews Section */}
      <ReviewSection />
    </div>
  );
}
