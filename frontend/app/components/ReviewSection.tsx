'use client';

import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';

interface Review {
  id?: string;
  name: string;
  location: string;
  text: string;
  rating: number;
}

export const ReviewSection: React.FC = () => {
  const { user, session } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form states
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [text, setText] = useState('');
  const [location, setLocation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch reviews from API
  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const getInitials = (name: string) => {
    if (!name) return 'SM';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    if (text.trim() === '') {
      setErrorMsg('Vui lòng nhập nội dung đánh giá.');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          text,
          rating,
          location: location.trim()
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMsg('Đánh giá của bạn đã được gửi thành công! Cảm ơn đóng góp của bạn.');
        setText('');
        setLocation('');
        setRating(5);
        // Refresh reviews list
        await fetchReviews();
        // Close form after delay
        setTimeout(() => {
          setIsFormOpen(false);
          setSuccessMsg('');
        }, 3000);
      } else {
        setErrorMsg(data.error || 'Có lỗi xảy ra khi gửi đánh giá.');
      }
    } catch (err) {
      setErrorMsg('Lỗi hệ thống khi gửi đánh giá. Vui lòng thử lại sau.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-brand-cream border-b border-brand-green/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-3xl space-y-4">
            <span className="block text-xs font-black tracking-widest text-brand-green uppercase font-mono">
              COMMUNITY FEEDBACK
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase text-brand-charcoal leading-[1.2] font-serif md:whitespace-nowrap">
              ĐÁNH GIÁ TỪ KHÁCH HÀNG
            </h2>
          </div>
          <div className="text-left md:text-right space-y-3">
            <p className="text-brand-muted/75 text-sm font-semibold font-mono uppercase tracking-wider">
              ★ ĐỘ HÀI LÒNG TRUNG BÌNH 4.9/5.0 SAO TỪ HƠN 1,000+ KHÁCH HÀNG TOÀN QUỐC.
            </p>
            
            {/* Show review toggle button */}
            {user ? (
              <button
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-green hover:bg-[#1f3e1b] text-white font-extrabold text-[10px] tracking-widest uppercase transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                {isFormOpen ? 'ĐÓNG FORM ĐÁNH GIÁ' : 'VIẾT ĐÁNH GIÁ CỦA BẠN'}
              </button>
            ) : (
              <p className="text-xs text-brand-muted font-bold font-mono">
                Bạn muốn viết đánh giá?{' '}
                <Link href="/login?redirect=/" className="text-brand-green hover:underline">
                  Đăng nhập ngay
                </Link>
              </p>
            )}
          </div>
        </div>

        {/* Review Form - Collapsible */}
        <AnimatePresence>
          {isFormOpen && user && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginBottom: 0 }}
              animate={{ height: 'auto', opacity: 1, marginBottom: '3rem' }}
              exit={{ height: 0, opacity: 0, marginBottom: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="bg-white border border-[#2D5A27]/20 p-6 md:p-8 shadow-md relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2D5A27] via-[#C8953A] to-[#2D5A27]" />
                
                <h3 className="text-base font-bold font-serif uppercase text-brand-charcoal mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C8953A]" />
                  CHIA SẺ CẢM NHẬN CỦA BẠN
                </h3>

                {errorMsg && (
                  <div className="flex items-start gap-2 bg-rose-50 border border-rose-250 text-rose-800 p-4 text-xs font-semibold mb-4">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-rose-700 mt-0.5" />
                    <div>{errorMsg}</div>
                  </div>
                )}

                {successMsg && (
                  <div className="bg-emerald-50 border border-emerald-250 text-emerald-850 p-4 text-xs font-semibold text-center mb-4">
                    {successMsg}
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} className="space-y-4 font-sans text-xs">
                  {/* Star selection */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black tracking-widest text-[#5A5A5A] uppercase font-mono block">
                      Đánh giá số sao
                    </label>
                    <div className="flex gap-1.5 py-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          className="text-stone-300 hover:text-brand-gold transition-colors cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              (hoverRating !== null ? star <= hoverRating : star <= rating)
                                ? 'fill-brand-gold text-brand-gold'
                                : 'text-stone-300 dark:text-stone-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Two columns: Location & text */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1 space-y-1">
                      <label className="text-[10px] font-black tracking-widest text-[#5A5A5A] uppercase font-mono block">
                        Nơi bạn sống (Tỉnh/Thành phố)
                      </label>
                      <input
                        type="text"
                        placeholder="Ví dụ: Hà Nội, TP. Hồ Chí Minh"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full px-4 py-3 bg-[#F9F4EC]/40 border border-[#2D5A27]/10 focus:border-[#2D5A27] focus:bg-white transition-all outline-none rounded-none"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[10px] font-black tracking-widest text-[#5A5A5A] uppercase font-mono block">
                        Nội dung đánh giá
                      </label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Hãy chia sẻ trải nghiệm của bạn về hương vị bún ngô, phở ngô và dịch vụ của Sợi Mộc..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full px-4 py-3 bg-[#F9F4EC]/40 border border-[#2D5A27]/10 focus:border-[#2D5A27] focus:bg-white transition-all outline-none rounded-none resize-none"
                      />
                    </div>
                  </div>

                  {/* Submit button */}
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-3.5 bg-[#2D5A27] hover:bg-[#1f3e1b] text-white text-[10px] font-black tracking-widest uppercase flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
                    >
                      {submitting ? 'ĐANG GỬI...' : 'GỬI ĐÁNH GIÁ CỦA BẠN'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Review Cards Grid */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-[#2D5A27] border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] font-mono font-bold tracking-widest text-[#5A5A5A] uppercase animate-pulse">
              Đang tải đánh giá...
            </p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-[#2D5A27]/20 bg-white">
            <p className="text-xs text-brand-muted font-medium">Chưa có đánh giá nào từ cộng đồng. Hãy là người đầu tiên chia sẻ cảm nhận!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.slice(0, 6).map((review, idx) => (
              <motion.div
                key={review.id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: (idx % 3) * 0.15 }}
                className="bg-white border border-brand-green/10 p-8 flex flex-col justify-between relative group hover:border-brand-green/30 transition-all hover:shadow-md"
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
                    {[...Array(5 - review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-stone-200" />
                    ))}
                  </div>

                  {/* Comment Text */}
                  <p className="text-brand-muted text-sm leading-relaxed mb-8 font-medium italic">
                    "{review.text}"
                  </p>
                </div>

                {/* Customer Meta */}
                <div className="flex items-center gap-4 border-t border-brand-green/5 pt-6">
                  {/* Avatar Badge */}
                  <div className="w-10 h-10 bg-[#2D5A27] text-white font-extrabold text-sm flex items-center justify-center font-sans select-none">
                    {getInitials(review.name)}
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
        )}

      </div>
    </section>
  );
};

export default ReviewSection;
