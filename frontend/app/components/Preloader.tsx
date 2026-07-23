'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LeafSVG: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 8C8 10 5.9 16.1 5.1 19C7.4 18.2 13.5 16 15.5 7.1C16.2 4.1 18.3 2 18.3 2S16.2 4.1 17 8Z" />
    <path d="M2 22C2 22 5.5 17.5 11.5 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const Preloader: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Disable body scroll while loading
    document.body.style.overflow = 'hidden';

    const duration = 800; // 0.8 seconds total loading duration
    const intervalTime = 30; // Smooth updates every 30ms
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const t = currentStep / steps;
      // Smooth cubic ease-out curve: starts fast, slows down beautifully towards the end
      const easedProgress = Math.min(100 * (1 - Math.pow(1 - t, 3)), 100);
      
      setProgress(easedProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          setIsLoaded(true);
          document.body.style.overflow = '';
        }, 500); // Short settle delay before fade-out exit
      }
    }, intervalTime);

    return () => {
      clearInterval(timer);
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            y: -30,
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#F9F4EC] dark:bg-[#111510] select-none"
        >
          {/* Background Grid Pattern - Matches Hero Section */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2ddd5_1px,transparent_1px),linear-gradient(to_bottom,#e2ddd5_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(250,246,238,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(250,246,238,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
          
          {/* Radial Gradient overlay to fade edges */}
          <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_40%,#F9F4EC_95%] dark:bg-radial-[circle_at_center,transparent_40%,#111510_95%] pointer-events-none" />

          {/* Drifting Organic Leaf Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{
                y: [-20, 400],
                x: [0, 40, 0],
                rotate: [0, 180],
                opacity: [0, 0.6, 0.6, 0]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              className="absolute top-1/4 left-1/3 text-brand-green/20 w-5 h-5"
            >
              <LeafSVG className="w-full h-full" />
            </motion.div>
            <motion.div
              animate={{
                y: [-20, 500],
                x: [0, -30, 0],
                rotate: [45, 225],
                opacity: [0, 0.5, 0.5, 0]
              }}
              transition={{ duration: 8, repeat: Infinity, delay: 1, ease: 'linear' }}
              className="absolute top-1/3 right-1/4 text-brand-gold/15 w-6 h-6"
            >
              <LeafSVG className="w-full h-full" />
            </motion.div>
          </div>

          {/* Core Content Box */}
          <div className="relative flex flex-col items-center justify-center text-center px-6">
            
            {/* Spinning Circular Logo Badge */}
            <div className="relative mb-8 flex items-center justify-center">
              {/* Outer Dashed Spinning Ring */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
                className="absolute w-28 h-28 rounded-full border border-dashed border-brand-green/35 dark:border-brand-gold/45"
              />
              
              {/* Logo Circle */}
              <div className="w-22 h-22 rounded-full bg-white dark:bg-[#171E15] border border-brand-green/10 flex items-center justify-center shadow-md p-1 relative z-10">
                <img
                  src="/images/final.png"
                  alt="Logo Sợi Mộc"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>

            {/* Typography Heading */}
            <div className="flex flex-col items-center mb-8">
              <span className="font-serif italic text-2xl text-brand-charcoal/80 dark:text-brand-cream/80 tracking-wide">
                Sản phẩm
              </span>
              <span className="font-serif italic text-lg text-brand-charcoal/70 dark:text-brand-cream/70 mt-0.5 mb-1.5">
                từ
              </span>
              <h1 className="font-serif font-extrabold text-4xl sm:text-5xl text-brand-green dark:text-brand-green-light tracking-widest uppercase relative select-none">
                SỢI MỘC
              </h1>
              <span className="font-sans font-bold text-[10px] tracking-[0.25em] text-brand-muted dark:text-brand-muted/80 uppercase mt-4 select-none">
                TINH HOA NÔNG SẢN SẠCH
              </span>
            </div>

            {/* Progress Bar Container */}
            <div className="relative w-64 h-[3px] bg-brand-charcoal/10 dark:bg-white/10 overflow-hidden mb-3">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-green to-brand-gold rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut' }}
              />
            </div>

            {/* Percentage Indicator */}
            <span className="font-mono text-xs font-semibold text-brand-muted/80 dark:text-brand-muted/70 tracking-widest">
              {Math.round(progress)}%
            </span>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
