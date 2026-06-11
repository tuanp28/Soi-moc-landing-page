'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/src/lib/supabase';
import { Lock, Eye, EyeOff, ShieldAlert, Check } from 'lucide-react';
import { motion } from 'framer-motion';

function ResetPasswordForm() {
  const router = useRouter();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setErrorMsg('Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Bạn sẽ được chuyển hướng về trang đăng nhập.');
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        }
      } catch (err) {
        console.error('Check recovery session error:', err);
      } finally {
        setChecking(false);
      }
    };

    checkSession();
  }, [router]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Mật khẩu mới phải có tối thiểu 8 ký tự.');
      return;
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      setErrorMsg('Mật khẩu quá dễ đoán. Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setSuccessMsg('Đặt lại mật khẩu thành công! Đang hoàn tất...');
      
      // Sign out to clean up session
      await supabase.auth.signOut();

      setTimeout(() => {
        router.push('/login?reset=success');
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi đặt lại mật khẩu.');
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-[250px] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-3 border-[#2D5A27] border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-mono font-bold tracking-widest text-[#5A5A5A] uppercase animate-pulse">
          Đang kiểm tra phiên khôi phục...
        </p>
      </div>
    );
  }

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
            Đặt Lại Mật Khẩu
          </h2>
          <p className="text-xs text-[#5A5A5A] dark:text-brand-muted uppercase tracking-wider font-mono">
            Nhập mật khẩu mới cho tài khoản của bạn
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
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-850 text-emerald-850 dark:text-emerald-350 p-4 text-xs font-semibold text-center flex items-center justify-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            {successMsg}
          </div>
        )}

        {/* Form */}
        {!successMsg && !errorMsg.includes('phiên khôi phục') && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black tracking-widest text-[#5A5A5A] dark:text-brand-muted uppercase font-mono block">
                Mật khẩu mới
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#5A5A5A]/50 dark:text-stone-400 group-focus-within:text-[#2D5A27] dark:group-focus-within:text-brand-green transition-colors">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Tối thiểu 8 ký tự"
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
              <p className="text-[9px] text-[#8C8C8C] dark:text-stone-550 font-mono leading-normal">
                Mật khẩu tối thiểu 8 ký tự, gồm ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt.
              </p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black tracking-widest text-[#5A5A5A] dark:text-brand-muted uppercase font-mono block">
                Xác nhận mật khẩu mới
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#5A5A5A]/50 dark:text-stone-400 group-focus-within:text-[#2D5A27] dark:group-focus-within:text-brand-green transition-colors">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Nhập lại mật khẩu mới"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-[#F9F4EC]/40 dark:bg-stone-900 border border-[#2D5A27]/10 dark:border-white/10 focus:border-[#2D5A27] dark:focus:border-brand-green focus:bg-white text-sm text-[#1A1A1A] dark:text-stone-200 transition-all outline-none rounded-none"
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
                'CẬP NHẬT MẬT KHẨU'
              )}
            </button>
          </form>
        )}
      </div>
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#F9F4EC] dark:bg-[#111510] px-5 py-12 transition-colors duration-300">
      <Suspense fallback={
        <div className="min-h-[300px] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#2D5A27] border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
