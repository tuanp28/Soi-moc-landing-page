'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, Send, CheckCircle, AlertCircle, Clock, Award } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

export default function ContactPage() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Tư vấn sản phẩm',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.user_metadata?.full_name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || user.user_metadata?.phone || prev.phone,
      }));
    }
  }, [user]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const nameTrimmed = formData.name.trim();
    if (!nameTrimmed) {
      newErrors.name = 'Họ và tên không được để trống.';
    } else if (!/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝàáâãèéêìíòóôõùúýĂăĐđĨĩŨũƠơƯưẠ-ỹ\s]+$/.test(nameTrimmed)) {
      newErrors.name = 'Họ và tên chỉ được chứa chữ cái và khoảng trắng.';
    } else if (nameTrimmed.split(/\s+/).length < 2) {
      newErrors.name = 'Vui lòng nhập đầy đủ cả họ và tên.';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không đúng định dạng.';
    }
    const cleanPhone = formData.phone.replace(/[\s().-]/g, '');
    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại không được để trống.';
    } else if (!/^(0|84|\+84)[35789][0-9]{8}$|^(0|84|\+84)2[0-9]{9}$/.test(cleanPhone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ (ví dụ: 0912 345 678).';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Nội dung liên hệ không được để trống.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId: user?.id || null
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus('success');
        setFormData({
          name: user ? (user.user_metadata?.full_name || '') : '',
          email: user ? (user.email || '') : '',
          phone: user ? (user.phone || user.user_metadata?.phone || '') : '',
          subject: 'Tư vấn sản phẩm',
          message: ''
        });
        // Revert back to idle after 6 seconds
        setTimeout(() => setStatus('idle'), 6000);
      } else {
        setStatus('error');
        setErrorMessage(result.error || 'Gửi thông tin thất bại. Vui lòng kiểm tra lại.');
      }
    } catch (err) {
      console.error('Submit contact form error:', err);
      setStatus('error');
      setErrorMessage('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#F2EADF] via-[#FAF6EE] to-[#F2EADF] dark:from-[#151A13] dark:via-[#111510] dark:to-[#151A13] py-16 md:py-24 overflow-hidden">
      
      {/* Background Graphic Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2ddd5_1px,transparent_1px),linear-gradient(to_bottom,#e2ddd5_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(250,246,238,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(250,246,238,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_30%,#F9F4EC_95%] dark:bg-radial-[circle_at_center,transparent_30%,#111510_95%] pointer-events-none" />

      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/10 w-[350px] h-[350px] rounded-full bg-brand-green/8 dark:bg-brand-green/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-[450px] h-[450px] rounded-full bg-brand-gold/10 dark:bg-brand-gold/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 md:px-10 relative z-10">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-brand-green-pale border border-brand-green/20 px-3 py-1.5 mb-4 select-none"
          >
            <Award className="w-4 h-4 text-brand-green" />
            <span className="text-[10px] font-black tracking-widest text-brand-green uppercase font-mono">
              Liên Hệ & Hợp Tác
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black tracking-tight uppercase leading-none font-serif text-brand-green dark:text-brand-green-light mb-4"
          >
            Gửi Tin Nhắn Cho Sợi Mộc
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-brand-muted dark:text-brand-muted/80 text-sm md:text-base font-medium leading-relaxed"
          >
            Chúng tôi luôn ở đây để hỗ trợ bạn về sản phẩm, chính sách đại lý hoặc mọi thắc mắc. Hãy gửi thông tin liên hệ và chúng tôi sẽ phản hồi sớm nhất.
          </motion.p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: Contact Info Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-8"
          >
            {/* Info Cards */}
            <div className="bg-white/80 dark:bg-[#171E15]/80 backdrop-blur-md border border-[#e2ddd5] dark:border-white/10 p-8 space-y-8 shadow-sm">
              <h2 className="text-xl font-bold font-serif text-brand-green dark:text-brand-green-light uppercase tracking-wider border-b border-[#e2ddd5] dark:border-white/10 pb-4">
                Thông tin liên hệ
              </h2>

              <div className="space-y-6">
                
                {/* Phone */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-brand-green-pale border border-brand-green/20 flex items-center justify-center text-brand-green shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs uppercase tracking-wider text-brand-muted dark:text-brand-muted/70">Hotline & Zalo</h3>
                    <p className="font-extrabold text-brand-charcoal dark:text-white mt-1">0377 159 498</p>
                    <p className="text-xs text-brand-muted/80 dark:text-brand-muted/60 mt-0.5">Hỗ trợ 24/7</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-brand-green-pale border border-brand-green/20 flex items-center justify-center text-brand-green shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs uppercase tracking-wider text-brand-muted dark:text-brand-muted/70">Email hỗ trợ</h3>
                    <p className="font-extrabold text-brand-charcoal dark:text-white mt-1">soimoc201@gmail.com</p>
                    <p className="text-xs text-brand-muted/80 dark:text-brand-muted/60 mt-0.5">Phản hồi trong 24 giờ làm việc</p>
                  </div>
                </div>


                {/* Work Time */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-brand-green-pale border border-brand-green/20 flex items-center justify-center text-brand-green shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs uppercase tracking-wider text-brand-muted dark:text-brand-muted/70">Giờ hoạt động</h3>
                    <p className="font-bold text-brand-charcoal dark:text-white mt-1">
                      Thứ 2 - Chủ Nhật: 09:00 - 22:00
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Embed Map / Note */}
            <div className="bg-brand-green-pale border border-brand-green/10 p-6">
              <p className="text-xs font-semibold leading-relaxed text-brand-green/90">
                🌱 <span className="font-extrabold">Hợp tác đại lý: </span>Sợi Mộc luôn tìm kiếm đối tác, đại lý phân phối phở ngô và bún ngô trên toàn quốc với mức chiết khấu cực kỳ ưu đãi và chính sách hỗ trợ tiếp thị tận tâm. Hãy ghi rõ &ldquo;Đăng ký đại lý&rdquo; ở tiêu đề nếu bạn có nhu cầu hợp tác kinh doanh.
              </p>
            </div>
          </motion.div>

          {/* Right: Contact Form Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <div className="bg-white/80 dark:bg-[#171E15]/80 backdrop-blur-md border border-[#e2ddd5] dark:border-white/10 p-8 md:p-10 shadow-sm relative">
              
              {/* Form Status Messages */}
              <AnimatePresence mode="wait">
                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 p-4 flex gap-3 items-start"
                  >
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm text-emerald-800 dark:text-emerald-300">Gửi liên hệ thành công!</h4>
                      <p className="text-xs text-emerald-700 dark:text-emerald-400/80 mt-1">
                        Cảm ơn bạn đã nhắn tin. Sợi Mộc sẽ phản hồi bạn qua Email hoặc Số điện thoại trong thời gian sớm nhất.
                      </p>
                    </div>
                  </motion.div>
                )}

                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 p-4 flex gap-3 items-start"
                  >
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-rose-800 dark:text-rose-300">
                      <h4 className="font-bold text-sm">Gửi liên hệ thất bại</h4>
                      <p className="mt-1">{errorMessage}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 2 Column Row: Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Name */}
                  <div className="space-y-1.5 text-left">
                    <label htmlFor="name" className="block text-[10px] font-black tracking-widest text-brand-muted dark:text-brand-muted/70 uppercase">
                      Họ và tên <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nguyễn Văn A"
                      disabled={status === 'loading'}
                      className={`w-full bg-[#FAF6EE] dark:bg-[#111510] border px-4 py-3 text-sm rounded-none focus:outline-none focus:border-brand-green dark:focus:border-brand-gold transition-colors duration-300 ${
                        errors.name ? 'border-rose-500' : 'border-[#e2ddd5] dark:border-white/10'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-[10px] text-rose-500 font-semibold">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5 text-left">
                    <label htmlFor="email" className="block text-[10px] font-black tracking-widest text-brand-muted dark:text-brand-muted/70 uppercase">
                      Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="a@gmail.com"
                      disabled={status === 'loading'}
                      readOnly={!!user}
                      className={`w-full bg-[#FAF6EE] dark:bg-[#111510] border px-4 py-3 text-sm rounded-none focus:outline-none focus:border-brand-green dark:focus:border-brand-gold transition-colors duration-300 ${
                        user ? 'opacity-75 cursor-not-allowed bg-stone-100/50 dark:bg-stone-900/30' : ''
                      } ${
                        errors.email ? 'border-rose-500' : 'border-[#e2ddd5] dark:border-white/10'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-[10px] text-rose-500 font-semibold">{errors.email}</p>
                    )}
                  </div>

                </div>

                {/* 2 Column Row: Phone & Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Phone */}
                  <div className="space-y-1.5 text-left">
                    <label htmlFor="phone" className="block text-[10px] font-black tracking-widest text-brand-muted dark:text-brand-muted/70 uppercase">
                      Số điện thoại <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0912 345 678"
                      disabled={status === 'loading'}
                      className={`w-full bg-[#FAF6EE] dark:bg-[#111510] border px-4 py-3 text-sm rounded-none focus:outline-none focus:border-brand-green dark:focus:border-brand-gold transition-colors duration-300 ${
                        errors.phone ? 'border-rose-500' : 'border-[#e2ddd5] dark:border-white/10'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-[10px] text-rose-500 font-semibold">{errors.phone}</p>
                    )}
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5 text-left">
                    <label htmlFor="subject" className="block text-[10px] font-black tracking-widest text-brand-muted dark:text-brand-muted/70 uppercase">
                      Tiêu đề
                    </label>
                    <div className="relative">
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        disabled={status === 'loading'}
                        className="w-full bg-[#FAF6EE] dark:bg-[#111510] border border-[#e2ddd5] dark:border-white/10 px-4 py-3 text-sm rounded-none focus:outline-none focus:border-brand-green dark:focus:border-brand-gold transition-colors duration-300 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%232D5A27%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] dark:bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FAF6EE%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.65rem_auto] bg-[right_1rem_center] bg-no-repeat pr-10"
                      >
                        <option value="Tư vấn sản phẩm" className="bg-[#FAF6EE] dark:bg-[#111510] text-brand-charcoal dark:text-white">Tư vấn sản phẩm</option>
                        <option value="Đăng ký đại lý" className="bg-[#FAF6EE] dark:bg-[#111510] text-brand-charcoal dark:text-white">Đăng ký đại lý</option>
                        <option value="Khác" className="bg-[#FAF6EE] dark:bg-[#111510] text-brand-charcoal dark:text-white">Khác</option>
                      </select>
                    </div>
                  </div>

                </div>

                {/* Message */}
                <div className="space-y-1.5 text-left">
                  <label htmlFor="message" className="block text-[10px] font-black tracking-widest text-brand-muted dark:text-brand-muted/70 uppercase">
                    Nội dung liên hệ <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Nhập nội dung liên hệ chi tiết của bạn..."
                    disabled={status === 'loading'}
                    className={`w-full bg-[#FAF6EE] dark:bg-[#111510] border px-4 py-3 text-sm rounded-none focus:outline-none focus:border-brand-green dark:focus:border-brand-gold transition-colors duration-300 resize-none ${
                      errors.message ? 'border-rose-500' : 'border-[#e2ddd5] dark:border-white/10'
                    }`}
                  />
                  {errors.message && (
                    <p className="text-[10px] text-rose-500 font-semibold">{errors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-brand-green hover:bg-brand-green-hover text-white font-extrabold text-xs tracking-widest py-4 px-8 hover:shadow-[0_4px_12px_rgba(45,90,39,0.3)] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2.5 uppercase rounded-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      ĐANG GỬI TIN NHẮN...
                    </>
                  ) : (
                    <>
                      GỬI LIÊN HỆ NGAY
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

              </form>
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
}
