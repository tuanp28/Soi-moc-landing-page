'use client';

import React, { useState } from 'react';
import { supabase } from '@/src/lib/supabase';
import { Mail, ShieldAlert, ArrowLeft, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      });

      if (error) throw error;

      setSuccessMsg('Một email đặt lại mật khẩu đã được gửi đến hòm thư của bạn. Vui lòng kiểm tra email và nhấp vào liên kết để tiếp tục.');
      setEmail('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Có lỗi xảy ra khi yêu cầu đặt lại mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#F9F4EC] dark:bg-[#111510] px-5 py-12 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white dark:bg-[#171E15] border border-[#2D5A27]/10 dark:border-white/10 p-8 md:p-10 shadow-xl relative overflow-hidden"
      >
        {/* Top Decorative Border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#2D5A27] via-[#C8953A] to-[#2D5A27]" />

        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-[#1A1A1A] dark:text-white font-serif uppercase">
              Quên Mật Khẩu
            </h2>
            <p className="text-xs text-[#5A5A5A] dark:text-brand-muted uppercase tracking-wider font-mono">
              Nhập email để nhận liên kết đặt lại mật khẩu
            </p>
          </div>

          {/* Success / Error Messages */}
          {errorMsg && (
            <div className="flex items-start gap-2.5 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 text-rose-800 dark:text-rose-300 p-4 text-xs font-semibold">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-700 dark:text-rose-400 mt-0.5" />
              <div>{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-850 text-emerald-850 dark:text-emerald-350 p-4 text-xs font-semibold leading-relaxed">
              {successMsg}
            </div>
          )}

          {/* Form */}
          {!successMsg && (
            <form onSubmit={handleResetRequest} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black tracking-widest text-[#5A5A5A] dark:text-brand-muted uppercase font-mono block">
                  Địa chỉ Email đăng ký
                </label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#5A5A5A]/50 dark:text-stone-400 group-focus-within:text-[#2D5A27] dark:group-focus-within:text-brand-green transition-colors">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#F9F4EC]/40 dark:bg-stone-900 border border-[#2D5A27]/10 dark:border-white/10 focus:border-[#2D5A27] dark:focus:border-brand-green focus:bg-white text-sm text-[#1A1A1A] dark:text-stone-200 transition-all outline-none rounded-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-6 bg-[#2D5A27] hover:bg-[#1f3e1b] text-white text-xs font-black tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 disabled:opacity-50 rounded-none shadow-sm hover:shadow-md"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    GỬI LIÊN KẾT ĐẶT LẠI
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Navigation Links */}
          <div className="pt-4 border-t border-[#2D5A27]/5 dark:border-white/5 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 font-extrabold text-xs text-[#2D5A27] dark:text-brand-green-light hover:underline uppercase tracking-wider font-mono"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Quay lại Đăng nhập
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
