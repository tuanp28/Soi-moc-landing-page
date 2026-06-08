'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, ShoppingBag, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/app/context/AuthContext';
import { useCart } from '@/app/context/CartContext';
import { supabase } from '@/src/lib/supabase';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, profile, signOut } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'TRANG CHỦ', path: '/' },
    { name: 'SẢN PHẨM', path: '/products' },
    { name: 'GIỚI THIỆU', path: '/about' },
    { name: 'LIÊN HỆ', path: '/contact' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-brand-cream/95 backdrop-blur-md border-b border-brand-green/10 py-3 shadow-xs'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-10 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/images/final.png"
              alt="Logo Sợi Mộc"
              className="w-11 h-11 rounded-full object-cover border border-brand-green/25 shadow-xs"
            />
            <span className="font-black text-xl tracking-tight text-brand-green font-serif">
              Sợi Mộc
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`text-xs font-black tracking-widest hover:text-brand-green transition-colors relative py-1 ${
                    isActive ? 'text-brand-green' : 'text-brand-muted'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-green"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}

            {/* Auth Link (Conditional Popover/Menu) */}
            {user && profile ? (
              <div className="flex items-center gap-4 border-l border-brand-green/10 dark:border-white/10 pl-4 py-1">
                {/* User Info & Badges */}
                <div className="flex flex-col text-right">
                  <span className="text-[11px] font-black text-brand-charcoal dark:text-stone-200 uppercase truncate max-w-[120px]">
                    {profile.fullName}
                  </span>
                  
                  {/* Badges */}
                  <div className="flex gap-1 justify-end mt-0.5 select-none">
                    {/* Role Badge */}
                    {profile.role !== 'customer' && (
                      <span className="px-1.5 py-0.5 text-[8px] font-bold bg-brand-green/10 text-brand-green border border-brand-green/20 uppercase tracking-widest rounded-none font-mono">
                        {profile.role}
                      </span>
                    )}
                    {/* VIP Level Badge */}
                    <span className={`px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest rounded-none font-mono border ${
                      profile.vipLevel === 'diamond' ? 'bg-cyan-50 dark:bg-cyan-950/20 text-cyan-700 dark:text-cyan-400 border-cyan-200' :
                      profile.vipLevel === 'gold' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200' :
                      profile.vipLevel === 'silver' ? 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-300' :
                      'bg-emerald-50 dark:bg-emerald-950/10 text-emerald-800 dark:text-emerald-400 border-emerald-250'
                    }`}>
                      {profile.vipLevel}
                    </span>
                  </div>
                </div>

                {/* Avatar */}
                <Link href="/profile" className="relative shrink-0 group">
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.fullName}
                      className="w-8 h-8 rounded-full border border-brand-green/20 group-hover:border-brand-green transition-all"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-brand-green-pale text-brand-green border border-brand-green/20 flex items-center justify-center font-bold text-xs">
                      {profile.fullName.substring(0, 1).toUpperCase()}
                    </div>
                  )}
                </Link>

                {/* Dashboard Shortcut Badges */}
                {profile.role === 'admin' && (
                  <Link href="/admin" className="text-[10px] font-black tracking-widest text-[#C8953A] border border-[#C8953A]/20 px-2 py-1 hover:bg-[#C8953A] hover:text-white transition-all uppercase">
                    Admin
                  </Link>
                )}
                
                {(profile.role === 'staff' || profile.role === 'manager' || profile.role === 'admin') && (
                  <Link href="/staff" className="text-[10px] font-black tracking-widest text-brand-green border border-brand-green/20 px-2 py-1 hover:bg-brand-green hover:text-white transition-all uppercase">
                    Staff
                  </Link>
                )}

                {(profile.role === 'vip' || profile.vipLevel !== 'normal' || profile.role === 'admin' || profile.role === 'staff' || profile.role === 'manager') && (
                  <Link href="/vip" className="text-[10px] font-black tracking-widest text-cyan-600 border border-cyan-500/20 px-2 py-1 hover:bg-cyan-600 hover:text-white transition-all uppercase font-mono">
                    VIP
                  </Link>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className={`text-xs font-black tracking-widest hover:text-brand-green transition-colors relative py-1 ${
                  pathname === '/login' ? 'text-brand-green' : 'text-brand-muted'
                }`}
              >
                ĐĂNG NHẬP
                {pathname === '/login' && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-green"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle Pill */}
            <button
              onClick={toggleTheme}
              className="relative w-14 h-7 bg-[#D2DEC8]/80 dark:bg-[#2C3F28] border border-[#2D5A27]/10 dark:border-white/10 rounded-full flex items-center cursor-pointer p-0.5 transition-colors duration-300 select-none mr-1"
              aria-label="Toggle Theme"
            >
              <motion.div
                layout
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="w-5.5 h-5.5 bg-white dark:bg-white rounded-full flex items-center justify-center shadow-md"
                animate={{
                  x: theme === 'dark' ? 26 : 0,
                }}
              >
                {theme === 'light' ? (
                  <Sun className="w-3.5 h-3.5 text-[#C8953A]" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-slate-700" />
                )}
              </motion.div>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-brand-charcoal hover:text-brand-green transition-colors cursor-pointer flex items-center justify-center"
              aria-label="Giỏ hàng"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#2D5A27] text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-sm font-sans animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Zalo Quick Call Button - Desktop */}
            <a
              href="https://zalo.me/0377159498"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 border border-brand-charcoal hover:border-brand-green hover:bg-brand-green hover:text-white text-brand-charcoal font-extrabold text-[10px] tracking-widest transition-all duration-300 uppercase"
            >
              HOTLINE ZALO
              <ArrowRight className="w-3 h-3" />
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-brand-muted hover:text-brand-charcoal"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[60px] bg-brand-cream border-b border-brand-green/10 z-35 md:hidden px-5 py-6 flex flex-col gap-6 shadow-xl"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`text-sm font-extrabold tracking-wider border-b border-brand-cream pb-2 ${
                      isActive ? 'text-brand-green' : 'text-brand-charcoal'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              {/* Mobile Auth Links */}
              {user && profile ? (
                <div className="flex flex-col gap-3 border-t border-brand-green/10 dark:border-white/10 pt-4">
                  <div className="flex items-center gap-3">
                    {profile.avatarUrl ? (
                      <img
                        src={profile.avatarUrl}
                        alt={profile.fullName}
                        className="w-10 h-10 rounded-full border border-brand-green/20"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-brand-green-pale text-brand-green border border-brand-green/20 flex items-center justify-center font-bold text-sm">
                        {profile.fullName.substring(0, 1).toUpperCase()}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-extrabold text-brand-charcoal dark:text-white">{profile.fullName}</span>
                      <span className="text-[10px] text-brand-muted uppercase font-mono tracking-wider">{profile.role} | {profile.vipLevel}</span>
                    </div>
                  </div>
                  
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="text-xs font-black tracking-widest text-brand-muted hover:text-brand-green uppercase"
                  >
                    Hồ Sơ Thành Viên
                  </Link>

                  {profile.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setIsOpen(false)}
                      className="text-xs font-black tracking-widest text-[#C8953A] uppercase"
                    >
                      Dashboard Admin
                    </Link>
                  )}

                  {(profile.role === 'staff' || profile.role === 'manager' || profile.role === 'admin') && (
                    <Link
                      href="/staff"
                      onClick={() => setIsOpen(false)}
                      className="text-xs font-black tracking-widest text-brand-green uppercase"
                    >
                      Dashboard Staff
                    </Link>
                  )}

                  {(profile.role === 'vip' || profile.vipLevel !== 'normal' || profile.role === 'admin' || profile.role === 'staff' || profile.role === 'manager') && (
                    <Link
                      href="/vip"
                      onClick={() => setIsOpen(false)}
                      className="text-xs font-black tracking-widest text-cyan-600 uppercase"
                    >
                      Đặc quyền VIP
                    </Link>
                  )}
                  
                  <button
                    onClick={async () => {
                      setIsOpen(false);
                      await signOut();
                    }}
                    className="text-left text-xs font-black tracking-widest text-rose-600 uppercase mt-1 cursor-pointer"
                  >
                    Đăng Xuất
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-extrabold tracking-wider border-b border-brand-cream pb-2 ${
                    pathname === '/login' ? 'text-brand-green' : 'text-brand-charcoal'
                  }`}
                >
                  ĐĂNG NHẬP
                </Link>
              )}
            </div>

            <a
              href="https://zalo.me/0377159498"
              target="_blank"
              rel="noreferrer"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-3 bg-brand-green text-white font-extrabold tracking-widest text-xs uppercase"
            >
              TƯ VẤN ZALO: 0377.159.498
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
export default Navbar;
