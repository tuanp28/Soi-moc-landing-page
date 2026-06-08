'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/app/context/AuthContext';
import { Lock, Mail, Eye, EyeOff, ShieldAlert, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Get redirect path if any
  const redirectPath = searchParams.get('redirect') || '/profile';

  // If user is already logged in, redirect them
  useEffect(() => {
    if (user) {
      router.push(redirectPath);
    }
  }, [user, router, redirectPath]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        setSuccessMsg('Đăng nhập thành công! Đang chuyển hướng...');
        setTimeout(() => {
          router.push(redirectPath);
        }, 1000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Có lỗi xảy ra khi đăng nhập.');
      setLoading(false);
    }
  };

  return (
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
            Đăng Nhập
          </h2>
          <p className="text-xs text-[#5A5A5A] dark:text-brand-muted uppercase tracking-wider font-mono">
            Chào mừng bạn trở lại với Sợi Mộc
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
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-850 text-emerald-850 dark:text-emerald-350 p-4 text-xs font-semibold text-center">
            {successMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black tracking-widest text-[#5A5A5A] dark:text-brand-muted uppercase font-mono block">
              Địa chỉ Email
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

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black tracking-widest text-[#5A5A5A] dark:text-brand-muted uppercase font-mono block">
              Mật khẩu
            </label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#5A5A5A]/50 dark:text-stone-400 group-focus-within:text-[#2D5A27] dark:group-focus-within:text-brand-green transition-colors">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-[#F9F4EC]/40 dark:bg-stone-900 border border-[#2D5A27]/10 dark:border-white/10 focus:border-[#2D5A27] dark:focus:border-brand-green focus:bg-white text-sm text-[#1A1A1A] dark:text-stone-200 transition-all outline-none rounded-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#5A5A5A]/50 dark:text-stone-500 hover:text-[#2D5A27] dark:hover:text-brand-green transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-6 bg-[#2D5A27] hover:bg-[#1f3e1b] text-white text-xs font-black tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 disabled:opacity-50 rounded-none shadow-sm hover:shadow-md animate-none"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                ĐĂNG NHẬP
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Navigation Links */}
        <div className="pt-4 border-t border-[#2D5A27]/5 dark:border-white/5 text-center space-y-2.5">
          <p className="text-xs text-[#5A5A5A] dark:text-stone-400">
            Chưa có tài khoản?{' '}
            <Link
              href="/register"
              className="font-extrabold text-[#2D5A27] dark:text-brand-green-light hover:underline"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#F9F4EC] dark:bg-[#111510] px-5 py-12 transition-colors duration-300">
      <Suspense fallback={
        <div className="min-h-[300px] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#2D5A27] border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
