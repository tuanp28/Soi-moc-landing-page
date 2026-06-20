'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/app/context/AuthContext';
import { motion } from 'framer-motion';

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

// Segment colors: Alternating Kem thô, Cam đất, Xanh lá nhạt
const COLORS = ['#F5F2EB', '#D39E82', '#A3B19B'];
const SECTOR_LABELS = [
  'Giảm 10%',    // Slice 0 -> Prize 1 (Kem)
  'Giảm 20k',    // Slice 1 -> Prize 2 (Cam)
  'Chúc may mắn', // Slice 2 -> Prize 4 (Xanh)
  'Giảm 50k',    // Slice 3 -> Prize 3 (Kem)
  'Chúc may mắn', // Slice 4 -> Prize 4 (Cam)
  'Giảm 10%',    // Slice 5 -> Prize 1 (Xanh)
  'Giảm 20k',    // Slice 6 -> Prize 2 (Kem)
  'Chúc may mắn', // Slice 7 -> Prize 4 (Cam)
  'Giảm 10%',    // Slice 8 -> Prize 1 (Xanh)
  'Giảm 20k',    // Slice 9 -> Prize 2 (Kem)
  'Chúc may mắn', // Slice 10 -> Prize 4 (Cam)
  'Giảm 10%'     // Slice 11 -> Prize 1 (Xanh)
];

interface SpinResult {
  prize_id: number;
  coupon_code: string;
  prize_name: string;
  message: string;
  success: boolean;
}

export default function LuckyWheel() {
  const { user, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [spinResult, setSpinResult] = useState<SpinResult | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isSpinningRef = useRef(false);
  const currentAngleRef = useRef(0); // in degrees

  // Dynamically load Google reCAPTCHA v3 script
  useEffect(() => {
    if (typeof window === 'undefined' || !RECAPTCHA_SITE_KEY) return;

    // Remove existing script if any
    const existingScript = document.getElementById('recaptcha-v3-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'recaptcha-v3-script';
      script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  // Initial draw of the wheel
  useEffect(() => {
    drawWheelAtAngle(0);
  }, []);

  const drawWheelAtAngle = (angleDegrees: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 600;
    const radius = size / 2;
    const angleRadians = (angleDegrees * Math.PI) / 180;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Save context for wheel rotation
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(angleRadians);

    const numSegments = 12;
    const arcSize = (2 * Math.PI) / numSegments;

    for (let i = 0; i < numSegments; i++) {
      const startAngle = i * arcSize;
      const endAngle = startAngle + arcSize;

      // Draw segment wedge
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius - 15, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();

      // Draw wedge border
      ctx.strokeStyle = '#E8E2D5';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw text label on the segment
      ctx.save();
      ctx.rotate(startAngle + arcSize / 2);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#4A3E3D';
      
      // Use premium typography
      ctx.font = 'bold 20px "Be Vietnam Pro", system-ui, sans-serif';
      ctx.fillText(SECTOR_LABELS[i], radius - 60, 0);
      ctx.restore();
    }

    // Outer thick vintage border
    ctx.beginPath();
    ctx.arc(0, 0, radius - 15, 0, 2 * Math.PI);
    ctx.strokeStyle = '#4A3E3D';
    ctx.lineWidth = 6;
    ctx.stroke();

    // Vintage decorative outer dots
    const numDots = 24;
    for (let i = 0; i < numDots; i++) {
      const dotAngle = (i * 2 * Math.PI) / numDots;
      const x = (radius - 28) * Math.cos(dotAngle);
      const y = (radius - 28) * Math.sin(dotAngle);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#4A3E3D';
      ctx.fill();
    }

    ctx.restore();

    // Draw wooden center button (static on top)
    ctx.save();
    ctx.translate(radius, radius);

    // Outer shadow ring
    ctx.beginPath();
    ctx.arc(0, 0, 52, 0, 2 * Math.PI);
    ctx.fillStyle = '#3E2A1F'; // Darker rich wood shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Wooden gradient body
    const woodGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, 48);
    woodGrad.addColorStop(0, '#8E5A36'); // Lighter warm wood
    woodGrad.addColorStop(1, '#5B3922'); // Medium dark wood
    ctx.beginPath();
    ctx.arc(0, 0, 48, 0, 2 * Math.PI);
    ctx.fillStyle = woodGrad;
    ctx.fill();

    // Inner gold/brass border
    ctx.beginPath();
    ctx.arc(0, 0, 43, 0, 2 * Math.PI);
    ctx.strokeStyle = '#D39E82';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Text "QUAY"
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#F5F2EB'; // Raw cotton cream color
    ctx.font = 'bold 22px "Be Vietnam Pro", system-ui, sans-serif';
    ctx.fillText('QUAY', 0, 0);

    ctx.restore();
  };

  // Helper to execute Google reCAPTCHA v3 and obtain token
  const executeRecaptcha = (): Promise<string | null> => {
    return new Promise((resolve) => {
      // If there is no site key defined, bypass and return dummy token
      if (!RECAPTCHA_SITE_KEY) {
        console.warn('⚠️ NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not defined. Bypassing client-side reCAPTCHA v3.');
        resolve('bypass-recaptcha-key');
        return;
      }
      
      // @ts-ignore
      if (typeof window === 'undefined' || !window.grecaptcha) {
        console.warn('reCAPTCHA script not fully loaded yet.');
        resolve(null);
        return;
      }
      try {
        // @ts-ignore
        window.grecaptcha.ready(() => {
          // @ts-ignore
          window.grecaptcha
            .execute(RECAPTCHA_SITE_KEY, { action: 'spin_wheel' })
            .then((token: string) => resolve(token))
            .catch((err: any) => {
              console.error('reCAPTCHA execute failed:', err);
              resolve(null);
            });
        });
      } catch (err) {
        console.error('reCAPTCHA ready failed:', err);
        resolve(null);
      }
    });
  };

  // Helper to fetch client public IP
  const getClientIP = async (): Promise<string> => {
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      return data.ip || '127.0.0.1';
    } catch (err) {
      console.error('Failed to fetch user IP:', err);
      return '127.0.0.1';
    }
  };

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const startWheelSpinAnimation = (targetSegment: number, result: SpinResult) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Calculate landing angle. Pointer is at 270 degrees.
    // Target segment matches top position when finalAngle is:
    // finalAngle = 270 - (targetSegment * 30 + 15)
    const finalAngle = (270 - (targetSegment * 30 + 15) + 360) % 360;
    
    // Spin at least 6 full rounds for maximum dramatic build-up
    const totalRotation = 6 * 360 + finalAngle;
    const duration = 6500; // 6.5 seconds animation
    const startTime = performance.now();
    const startAngle = currentAngleRef.current % 360;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Quintic ease-out curve for highly natural and premium feel
      const easeOut = 1 - Math.pow(1 - progress, 5);
      const angle = startAngle + easeOut * (totalRotation - startAngle);
      
      currentAngleRef.current = angle;
      drawWheelAtAngle(angle);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Stop spinning
        isSpinningRef.current = false;
        setIsLoading(false);
        setSpinResult(result);
        setShowModal(true);
      }
    };

    requestAnimationFrame(animate);
  };

  const handleSpin = async (event: React.MouseEvent<HTMLButtonElement>) => {
    // 1. IMMEDIATE HARDWARE LEVEL LOCK
    if (isSpinningRef.current) return;
    isSpinningRef.current = true;

    // Directly mutate DOM element properties to bypass React async render batching
    const button = event.currentTarget;
    if (button) {
      button.disabled = true;
      button.setAttribute('disabled', 'true');
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // 2. reCAPTCHA v3 validation (invisible check)
      const recaptchaToken = await executeRecaptcha();
      if (!recaptchaToken) {
        throw new Error('reCAPTCHA_load_failed');
      }

      // Call our Next.js recaptcha verify endpoint
      const verifyRes = await fetch('/api/recaptcha-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: recaptchaToken }),
      });
      const verifyData = await verifyRes.json();

      if (!verifyData.success || verifyData.score < 0.5) {
        throw new Error('reCAPTCHA_bot_detected');
      }

      // 3. Collect device footprints (use 127.0.0.1 on localhost to enable infinite testing)
      let ip = '127.0.0.1';
      if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
        ip = await getClientIP();
      }
      const agent = navigator.userAgent;

      // 4. Check auth user id
      const { data: { user } } = await supabase.auth.getUser();
      const current_user_id = user?.id || null;

      // 5. Call Supabase Secure RPC Function
      const { data, error } = await supabase.rpc('spin_the_wheel_secure', {
        user_ip: ip,
        browser_agent: agent,
        current_user_id: current_user_id,
      });

      if (error) {
        console.error('Supabase RPC Error:', error);
        throw new Error('supabase_rpc_error');
      }

      // RPC returns an array because it returns a TABLE
      const result: SpinResult = Array.isArray(data) ? data[0] : data;

      if (!result || !result.success) {
        // Displays cooldown/limit error (already spun today)
        setErrorMessage(result?.message || 'Có lỗi xảy ra, bạn đã hết lượt quay hôm nay.');
        setIsLoading(false);
        isSpinningRef.current = false;
        if (button) {
          button.disabled = false;
          button.removeAttribute('disabled');
        }
        return;
      }

      // 6. Find target segment index for the prize_id (1 to 4)
      let targetSegment = 0;
      if (result.prize_id === 1) {
        const segments = [0, 5, 8, 11];
        targetSegment = segments[Math.floor(Math.random() * segments.length)];
      } else if (result.prize_id === 2) {
        const segments = [1, 6, 9];
        targetSegment = segments[Math.floor(Math.random() * segments.length)];
      } else if (result.prize_id === 3) {
        targetSegment = 3;
      } else if (result.prize_id === 4) {
        const segments = [2, 4, 7, 10];
        targetSegment = segments[Math.floor(Math.random() * segments.length)];
      }

      // Start the physics animation!
      startWheelSpinAnimation(targetSegment, result);

    } catch (err: any) {
      console.error('Spin Execution Error:', err);
      isSpinningRef.current = false;
      setIsLoading(false);
      
      if (button) {
        button.disabled = false;
        button.removeAttribute('disabled');
      }

      if (err.message === 'reCAPTCHA_bot_detected') {
        setErrorMessage('Phát hiện hành vi bất thường, vui lòng thử lại!');
      } else if (err.message === 'reCAPTCHA_load_failed') {
        setErrorMessage('Không thể khởi tạo hệ thống bảo mật. Vui lòng kiểm tra lại kết nối mạng.');
      } else {
        setErrorMessage('Đã xảy ra lỗi hệ thống. Vui lòng tải lại trang và thử lại.');
      }
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-[#2D5A27] border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-mono font-bold tracking-widest text-[#5A5A5A] dark:text-[#E8E2D5]/70 uppercase animate-pulse">
          Đang tải thông tin vòng quay...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-12 px-4 select-none w-full relative z-10"
    >
      {/* Drifting Organic Particles (Falling Blurry Green Leaves) */}
      <motion.div
        animate={{
          y: [-20, 800],
          x: [0, 40, 0],
          rotate: [0, 240],
          opacity: [0, 0.95, 0.95, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="fixed top-[5%] left-[25%] w-5 h-3 bg-[#2D5A27]/40 dark:bg-brand-green/25 rounded-full blur-[1px] pointer-events-none z-0"
      />
      <motion.div
        animate={{
          y: [-20, 600],
          x: [0, -30, 0],
          rotate: [45, 285],
          opacity: [0, 0.95, 0.95, 0]
        }}
        transition={{ duration: 18, repeat: Infinity, delay: 5, ease: "linear" }}
        className="fixed top-[15%] left-[65%] w-4.5 h-2.5 bg-[#2D5A27]/35 dark:bg-brand-green/20 rounded-full blur-[1.2px] pointer-events-none z-0"
      />
      <motion.div
        animate={{
          y: [-20, 700],
          x: [0, 35, 0],
          rotate: [90, 330],
          opacity: [0, 0.95, 0.95, 0]
        }}
        transition={{ duration: 22, repeat: Infinity, delay: 10, ease: "linear" }}
        className="fixed top-[10%] left-[85%] w-3.5 h-2 bg-[#C8953A]/45 dark:bg-brand-gold/25 rounded-full blur-[0.8px] pointer-events-none z-0"
      />

      {/* Floating Organic Leaves */}
      <motion.div
        animate={{
          y: [0, -18, 0],
          x: [0, 12, 0],
          rotate: [0, 30, 0]
        }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        className="fixed top-[15%] left-[5%] text-brand-green/15 w-8 h-8 pointer-events-none hidden lg:block z-0"
      >
        <LeafSVG className="w-full h-full text-brand-green/10" />
      </motion.div>
      <motion.div
        animate={{
          y: [0, 24, 0],
          x: [0, -15, 0],
          rotate: [0, -45, 0]
        }}
        transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
        className="fixed bottom-[30%] right-[5%] text-brand-gold/15 w-10 h-10 pointer-events-none hidden lg:block z-0"
      >
        <LeafSVG className="w-full h-full text-brand-gold/10" />
      </motion.div>

      {/* Decorative Title */}
      <div className="text-center mb-10 max-w-lg">
        <h2 className="font-serif text-3xl md:text-4xl text-brand-green dark:text-brand-gold font-black mb-3">
          Vòng Quay May Mắn
        </h2>
        <div className="h-0.5 w-32 bg-brand-gold dark:bg-brand-green mx-auto mb-4" />
        <p className="font-sans text-brand-charcoal/80 text-sm md:text-base leading-relaxed">
          Quay ngay để nhận những phần quà hấp dẫn từ Sợi Mộc. Mỗi người dùng chỉ được tham gia một lần trong vòng 24 giờ!
        </p>
      </div>

      {/* Main Wheel Container - Solid background with clear border */}
      <div className="relative flex flex-col items-center justify-center p-8 bg-[#FAF6EE] dark:bg-[#121611] rounded-[3rem] border border-brand-green/25 dark:border-white/10 shadow-lg max-w-[500px] w-full">
        {/* Leaf pointer positioned at the top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <LeafPointer />
        </div>

        {/* Wheel Canvas - Solid gold border for absolute contrast */}
        <div className="relative w-full aspect-square max-w-[420px] rounded-full overflow-hidden shadow-2xl border-4 border-brand-gold bg-[#FAF6EE] dark:bg-[#1A2319]">
          <canvas
            ref={canvasRef}
            width={600}
            height={600}
            className={`w-full h-full object-contain pointer-events-none ${!user ? 'blur-[3px] opacity-45' : ''}`}
          />

          {/* Transparent click detector covering the entire wheel for high usability */}
          {user ? (
            <button
              onClick={handleSpin}
              disabled={isLoading}
              className="absolute inset-0 w-full h-full rounded-full bg-transparent cursor-pointer z-10 transition-transform active:scale-98 disabled:cursor-not-allowed"
              aria-label="Quay vòng quay"
            />
          ) : (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 bg-black/40 backdrop-blur-[2px] text-center text-white select-none">
              <span className="text-3xl mb-2">🔒</span>
              <p className="font-serif text-lg font-bold mb-1 uppercase tracking-wide text-brand-gold">Đăng nhập để quay</p>
              <p className="text-[11px] max-w-[240px] leading-relaxed text-[#FAF6EE]/90">
                Vui lòng đăng nhập tài khoản thành viên để nhận lượt quay và phần quà ưu đãi đặc biệt từ Sợi Mộc.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Styled CTA Spin Button below the wheel */}
      {!user ? (
        <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full max-w-[360px] px-4">
          <a
            href="/login?redirect=/lucky-wheel"
            className="flex-1 py-4 bg-[#2D5A27] hover:bg-[#1f3e1b] dark:bg-[#5DA453] dark:hover:bg-[#6EB264] text-[#F5F2EB] font-extrabold text-xs tracking-widest transition-all duration-200 uppercase rounded-xl shadow-md text-center flex items-center justify-center cursor-pointer"
          >
            Đăng nhập
          </a>
          <a
            href="/register"
            className="flex-1 py-4 bg-transparent hover:bg-[#2D5A27]/10 dark:hover:bg-white/5 text-[#2D5A27] dark:text-[#5DA453] border-2 border-[#2D5A27] dark:border-[#5DA453] font-extrabold text-xs tracking-widest transition-all duration-200 uppercase rounded-xl text-center flex items-center justify-center cursor-pointer"
          >
            Đăng ký
          </a>
        </div>
      ) : (
        <button
          onClick={handleSpin}
          disabled={isLoading}
          className="mt-8 px-10 py-4.5 bg-[#2D5A27] hover:bg-[#1f3e1b] dark:bg-[#5DA453] dark:hover:bg-[#6EB264] text-[#F5F2EB] font-extrabold text-xs tracking-widest transition-all duration-200 uppercase rounded-xl shadow-md active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ĐANG QUAY...
            </>
          ) : (
            'Bắt đầu quay'
          )}
        </button>
      )}

      {/* Error Alert Box */}
      {errorMessage && (
        <div className="mt-8 p-4 bg-brand-cream border border-brand-gold/40 text-brand-charcoal rounded-xl text-center shadow-sm max-w-md animate-fade-in">
          <p className="font-medium text-sm font-sans flex items-center justify-center gap-2">
            <span>✨</span> {errorMessage}
          </p>
        </div>
      )}

      {/* Details Box */}
      <div className="mt-8 flex flex-col gap-2 max-w-md text-center bg-white/40 backdrop-blur-sm p-5 rounded-2xl border border-brand-green/5">
        <span className="text-xs uppercase tracking-wider font-bold text-brand-green">Cơ cấu giải thưởng</span>
        <div className="grid grid-cols-2 gap-3 text-sm font-sans mt-1">
          <div className="p-2.5 bg-[#F5F2EB] dark:bg-[#1E261C] rounded-lg border border-stone-300 dark:border-brand-green/30 text-[#4A3E3D] dark:text-[#E8E2D5] font-bold">Giảm 10%</div>
          <div className="p-2.5 bg-[#D39E82]/15 dark:bg-[#D39E82]/20 rounded-lg border border-[#D39E82]/40 text-[#7A4B3A] dark:text-[#E6B198] font-bold">Giảm 20k</div>
          <div className="p-2.5 bg-[#A3B19B]/15 dark:bg-[#A3B19B]/20 rounded-lg border border-[#A3B19B]/40 text-[#3F5A3B] dark:text-[#B4C6B1] font-bold">Giảm 50k</div>
          <div className="p-2.5 bg-[#F5F2EB] dark:bg-stone-800 rounded-lg border border-brand-gold/40 dark:border-brand-gold/60 text-[#4A3E3D] dark:text-brand-gold font-black">Chúc may mắn</div>
        </div>
      </div>

      {/* Congratulations popup modal */}
      {showModal && spinResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-charcoal/40 backdrop-blur-md animate-fade-in">
          <div className="bg-[#F5F2EB] border-2 border-brand-green/20 rounded-[2rem] max-w-md w-full p-8 shadow-2xl relative text-center transform scale-100 transition-all duration-300">
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-brand-cream text-brand-muted hover:text-brand-charcoal hover:bg-stone-200 transition-colors border border-stone-200/50"
            >
              ✕
            </button>

            {/* Sparkles / Celebratory icon */}
            <div className="w-20 h-20 bg-[#A3B19B]/20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
              {spinResult.prize_id === 4 ? '✨' : '🎉'}
            </div>

            <span className="text-xs uppercase tracking-widest font-bold text-[#A3B19B] mb-2 block">
              {spinResult.prize_id === 4 ? 'Cố gắng lần sau!' : 'Chúc mừng bạn!'}
            </span>
            <h3 className="font-serif text-2xl md:text-3xl text-brand-green font-bold mb-4">
              {spinResult.prize_id === 4 ? 'Tiếc quá!' : 'Bạn Đã Trúng'}
            </h3>
            
            <p className="text-xl font-bold font-sans text-[#D39E82] mb-6">
              {spinResult.prize_name}
            </p>

            {/* Coupon Code copy section */}
            {spinResult.prize_id !== 4 && (
              <div className="bg-brand-cream rounded-2xl p-4 border border-stone-200/70 mb-8 flex flex-col items-center">
                <span className="text-xs text-brand-muted mb-2 font-medium">Mã ưu đãi của bạn</span>
                <div className="flex items-center gap-3 w-full justify-center">
                  <span className="font-mono text-xl font-bold text-brand-charcoal tracking-wide bg-white px-4 py-2 rounded-lg border border-stone-200">
                    {spinResult.coupon_code}
                  </span>
                  <button
                    onClick={() => handleCopy(spinResult.coupon_code)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold font-sans transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
                      copied
                        ? 'bg-brand-green text-white'
                        : 'bg-brand-gold hover:bg-brand-gold-hover text-[#F5F2EB]'
                    }`}
                  >
                    {copied ? 'Đã sao chép ✓' : 'Sao chép'}
                  </button>
                </div>
              </div>
            )}

            <p className="text-xs text-brand-muted leading-relaxed font-sans mb-2">
              {spinResult.prize_id === 4 
                ? 'Đừng nản lòng nhé, bạn sẽ có thêm cơ hội quay thưởng sau 24 giờ nữa.' 
                : 'Sử dụng mã giảm giá này khi thanh toán đơn hàng tiếp theo để nhận ưu đãi.'}
            </p>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-3.5 bg-brand-green hover:bg-brand-green-hover text-[#F5F2EB] font-bold rounded-xl shadow-md transition-colors"
            >
              {spinResult.prize_id === 4 ? 'Đóng' : 'Khám phá sản phẩm Sợi Mộc'}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Simple Leaf Pointer Graphic Component
const LeafPointer = () => (
  <svg
    width="48"
    height="64"
    viewBox="0 0 48 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-md select-none pointer-events-none"
  >
    {/* Leaf main shape */}
    <path
      d="M24 58C24 58 42 38 42 24C42 10 34 6 24 6C14 6 6 10 6 24C6 38 24 58 24 58Z"
      fill="#A3B19B"
      stroke="#4A3E3D"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    {/* Leaf center line */}
    <path d="M24 6V54" stroke="#4A3E3D" strokeWidth="2.5" strokeLinecap="round" />
    {/* Veins */}
    <path d="M24 16L34 10" stroke="#4A3E3D" strokeWidth="2" strokeLinecap="round" />
    <path d="M24 26L35 19" stroke="#4A3E3D" strokeWidth="2" strokeLinecap="round" />
    <path d="M24 36L32 30" stroke="#4A3E3D" strokeWidth="2" strokeLinecap="round" />
    <path d="M24 16L14 10" stroke="#4A3E3D" strokeWidth="2" strokeLinecap="round" />
    <path d="M24 26L13 19" stroke="#4A3E3D" strokeWidth="2" strokeLinecap="round" />
    <path d="M24 36L16 30" stroke="#4A3E3D" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const LeafSVG: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 8C8 10 5.9 16.1 5.1 19C7.4 18.2 13.5 16 15.5 7.1C16.2 4.1 18.3 2 18.3 2S16.2 4.1 17 8Z" />
    <path d="M2 22C2 22 5.5 17.5 11.5 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
