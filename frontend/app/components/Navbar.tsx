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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
    { name: 'VÒNG QUAY', path: '/lucky-wheel' },
    { name: 'GIỚI THIỆU', path: '/about' },
    { name: 'LIÊN HỆ', path: '/contact' },
    { name: 'TRA CỨU ĐƠN HÀNG', path: '/tra-cuu-don-hang' },
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
          <div className="hidden md:flex items-center flex-1 justify-center min-w-0 mx-4 lg:mx-6">
            <div 
              className="overflow-x-auto scrollbar-none flex items-center gap-4 lg:gap-5 xl:gap-7 py-2 px-1 pr-12 flex-nowrap scroll-smooth select-none max-w-[400px] lg:max-w-[500px] xl:max-w-[600px]"
              style={{
                maskImage: 'linear-gradient(to right, black 85%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, black 85%, transparent 100%)'
              }}
            >
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`text-[10px] lg:text-[11px] xl:text-xs font-black tracking-widest hover:text-brand-green transition-colors relative py-1 whitespace-nowrap flex-shrink-0 ${
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
            </div>

            {/* Profile Dropdown or Login Link (Outside the scrollable area to prevent clipping and keep always visible) */}
            {user && profile ? (
              <div className="relative border-l border-brand-green/10 dark:border-white/10 pl-4 py-1 flex-shrink-0 ml-4">
                {/* Click-outside backdrop overlay */}
                {isDropdownOpen && (
                  <div
                    className="fixed inset-0 z-30 cursor-default bg-transparent"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                )}

                {/* User Trigger Button */}
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2.5 hover:text-brand-green dark:hover:text-brand-green-light transition-colors relative z-40 cursor-pointer text-left"
                >
                  <div className="flex flex-col text-right hidden sm:flex">
                    <span className="text-xs font-bold text-brand-charcoal dark:text-stone-250 leading-tight">
                      {profile.fullName}
                    </span>
                    <span className="text-[8px] text-[#C8953A] font-black uppercase tracking-widest font-mono mt-0.5">
                      {profile.vipLevel !== 'normal' ? `${profile.vipLevel} member` : 'Standard member'}
                    </span>
                  </div>

                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.fullName}
                      className="w-8 h-8 rounded-full border border-brand-green/20 hover:border-brand-green transition-all"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-brand-green-pale text-brand-green border border-brand-green/20 flex items-center justify-center font-bold text-xs select-none">
                      {profile.fullName.substring(0, 1).toUpperCase()}
                    </div>
                  )}
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3.5 w-64 bg-[#FAF6EE] dark:bg-[#171E15] border border-brand-green/10 dark:border-white/10 shadow-2xl z-40 py-3 rounded-none font-sans"
                    >
                      {/* Header Info */}
                      <div className="px-4 py-2 border-b border-brand-green/5 dark:border-white/5 pb-3">
                        <p className="text-[8px] text-brand-muted dark:text-stone-400 font-mono uppercase tracking-widest font-bold">Tài khoản</p>
                        <p className="text-xs font-black text-brand-charcoal dark:text-white uppercase truncate mt-0.5 leading-tight">{profile.fullName}</p>
                        <p className="text-[10px] text-brand-muted dark:text-stone-400 truncate mt-0.5 font-mono">{profile.email || user.email}</p>
                        
                        {/* Badges */}
                        <div className="flex flex-wrap gap-1.5 mt-2.5 select-none">
                          {profile.role !== 'customer' && (
                            <span className="px-2 py-0.5 text-[8px] font-black bg-brand-green/15 text-brand-green dark:text-brand-green-light border border-brand-green/25 uppercase tracking-widest font-mono">
                              {profile.role}
                            </span>
                          )}
                          <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest font-mono border ${
                            profile.vipLevel === 'diamond' ? 'bg-cyan-55/20 text-cyan-700 dark:text-cyan-400 border-cyan-400/30' :
                            profile.vipLevel === 'gold' ? 'bg-amber-55/20 text-amber-700 dark:text-amber-400 border-amber-400/30' :
                            profile.vipLevel === 'silver' ? 'bg-stone-500/10 text-stone-600 dark:text-stone-300 border-stone-400/30' :
                            'bg-emerald-50 dark:bg-emerald-950/10 text-emerald-800 dark:text-emerald-400 border-emerald-250/30'
                          }`}>
                            {profile.vipLevel}
                          </span>
                        </div>
                      </div>

                      {/* Menu Options */}
                      <div className="py-1">
                        <Link
                          href="/profile"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center px-4 py-2.5 text-xs font-extrabold text-brand-charcoal dark:text-stone-200 hover:bg-brand-green/5 dark:hover:bg-white/5 transition-colors uppercase tracking-wider"
                        >
                          👤 Hồ sơ cá nhân
                        </Link>

                        {profile.role === 'admin' && (
                          <Link
                            href="/admin"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center px-4 py-2.5 text-xs font-extrabold text-[#C8953A] hover:bg-[#C8953A]/5 transition-colors uppercase tracking-wider"
                          >
                            ⚙️ Dashboard Admin
                          </Link>
                        )}

                        {(profile.role === 'staff' || profile.role === 'manager' || profile.role === 'admin') && (
                          <Link
                            href="/staff"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center px-4 py-2.5 text-xs font-extrabold text-brand-green dark:text-brand-green-light hover:bg-brand-green/5 dark:hover:bg-white/5 transition-colors uppercase tracking-wider"
                          >
                            📋 Dashboard Staff
                          </Link>
                        )}

                         {profile && (
                           <Link
                             href="/vip"
                             onClick={() => setIsDropdownOpen(false)}
                             className="flex items-center px-4 py-2.5 text-xs font-extrabold text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/5 transition-colors uppercase tracking-wider"
                           >
                             👑 Đặc quyền VIP
                           </Link>
                         )}
                      </div>

                      {/* Sign Out Button */}
                      <div className="border-t border-brand-green/5 dark:border-white/5 pt-2 mt-1">
                        <button
                          onClick={async () => {
                            setIsDropdownOpen(false);
                            await signOut();
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs font-black text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors uppercase tracking-wider cursor-pointer"
                        >
                          🚪 Đăng Xuất
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="relative border-l border-brand-green/10 dark:border-white/10 pl-4 py-1 flex-shrink-0 ml-4">
                <Link
                  href="/login"
                  className={`text-[10px] lg:text-[11px] xl:text-xs font-black tracking-widest hover:text-brand-green transition-colors relative py-1 whitespace-nowrap ${
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
              </div>
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

                  {profile && (
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
