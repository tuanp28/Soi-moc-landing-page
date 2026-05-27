'use client';

import React from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

interface Review {
  name: string;
  location: string;
  initials: string;
  text: string;
  rating: number;
}

export const ReviewSection: React.FC = () => {
  const reviews: Review[] = [
    {
      name: 'Hải Yến',
      location: 'TP. Hồ Chí Minh',
      initials: 'HY',
      text: 'Sợi phở dai ngon, thơm mùi ngô tự nhiên. Nhà mình ai cũng thích, kể cả mấy đứa nhỏ ở nhà vốn rất lười ăn chất xơ và rau củ.',
      rating: 5,
    },
    {
      name: 'Minh Quân',
      location: 'Hà Nội',
      initials: 'MQ',
      text: 'Ăn nhẹ bụng hơn phở thường nhiều. Mình đang theo chế độ Eat Clean thấy bún/phở ngô này cực kỳ hợp, no lâu mà không bị đầy bụng. Đơn hàng nhận nhanh và tư vấn dễ chịu.',
      rating: 5,
    },
    {
      name: 'Thu Thảo',
      location: 'Đà Nẵng',
      initials: 'TT',
      text: 'Đóng gói sản phẩm đẹp, chuyên nghiệp, mình mua làm quà biếu gia đình ai cũng khen lạ miệng và ngon. Liên hệ qua Zalo tư vấn rất nhanh và nhiệt tình.',
      rating: 5,
    },
  ];

  return (
    <section className="py-24 bg-brand-cream border-b border-brand-green/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div className="max-w-3xl space-y-4">
            <span className="block text-xs font-black tracking-widest text-brand-green uppercase font-mono">
              COMMUNITY FEEDBACK
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase text-brand-charcoal leading-[1.2] font-serif md:whitespace-nowrap">
              ĐÁNH GIÁ TỪ KHÁCH HÀNG
            </h2>
          </div>
          <p className="text-brand-muted/75 text-sm font-semibold max-w-xs font-mono uppercase tracking-wider">
            ★ ĐỘ HÀI LÒNG TRUNG BÌNH 4.9/5.0 SAO TỪ HƠN 1,000+ KHÁCH HÀNG TOÀN QUỐC.
          </p>
        </div>

        {/* Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="bg-white border border-brand-green/10 p-8 flex flex-col justify-between relative group hover:border-brand-green/30 transition-colors hover:shadow-xs"
            >
              {/* Quote Icon in background */}
              <div className="absolute right-6 top-6 text-brand-green-pale pointer-events-none">
                <MessageSquare className="w-8 h-8" />
              </div>

              <div>
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-brand-gold text-brand-gold" />
                  ))}
                </div>

                {/* Comment Text */}
                <p className="text-brand-muted text-sm leading-relaxed mb-8 font-medium">
                  "{review.text}"
                </p>
              </div>

              {/* Customer Meta */}
              <div className="flex items-center gap-4 border-t border-brand-green/5 pt-6">
                {/* Avatar Badge */}
                <div className="w-10 h-10 bg-brand-green text-white font-extrabold text-sm flex items-center justify-center font-sans">
                  {review.initials}
                </div>
                
                <div>
                  <h4 className="font-extrabold text-sm text-brand-charcoal tracking-wide uppercase font-sans">
                    {review.name}
                  </h4>
                  <p className="text-[10px] text-brand-muted/60 font-bold uppercase tracking-widest font-mono">
                    {review.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
export default ReviewSection;
