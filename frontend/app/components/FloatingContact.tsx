'use client';

import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

import { useCart } from '../context/CartContext';

export const FloatingContact: React.FC = () => {
  const { isCartOpen } = useCart();
  const phone = '0377159498';
  const facebookUrl = 'https://www.facebook.com/people/S%E1%BB%A3i-M%E1%BB%99c/100067446103740/';
  const tiktokUrl = 'https://www.tiktok.com/@soimoc201';
  const zaloUrl = 'https://zalo.me/0377159498';

  if (isCartOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 select-none">
      
      {/* Grid of Social Channels */}
      <div className="grid grid-cols-2 gap-2">
        {/* Facebook Link */}
        <motion.a
          href={facebookUrl}
          target="_blank"
          rel="noreferrer"
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 bg-[#1877F2] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow border border-white/10"
          title="Theo dõi Fanpage Sợi Mộc"
        >
          <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
            <path d="M22 12.07C22 6.477 17.523 2 12 2S2 6.477 2 12.07c0 5.017 3.657 9.175 8.438 9.93v-7.03H7.898v-2.9h2.54V9.845c0-2.52 1.492-3.91 3.777-3.91 1.094 0 2.238.198 2.238.198v2.475h-1.26c-1.243 0-1.63.775-1.63 1.57v1.887h2.773l-.443 2.9h-2.33V22c4.78-.755 8.437-4.913 8.437-9.93z" />
          </svg>
        </motion.a>

        {/* Call Link */}
        <motion.a
          href={`tel:${phone}`}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 bg-brand-green text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow border border-white/10"
          title="Gọi hotline ngay"
        >
          <Phone className="w-5 h-5 fill-white" />
        </motion.a>

        {/* TikTok Link */}
        <motion.a
          href={tiktokUrl}
          target="_blank"
          rel="noreferrer"
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 bg-black text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow border border-white/10"
          title="Xem TikTok Sợi Mộc"
        >
          <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
            <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.235V2h-3.193v13.766c0 1.57-1.272 2.843-2.843 2.843s-2.843-1.273-2.843-2.843 1.272-2.843 2.843-2.843c.293 0 .575.045.84.128V9.79a6.034 6.034 0 0 0-.84-.058A6.077 6.077 0 0 0 3.71 15.81a6.077 6.077 0 0 0 6.073 6.073 6.077 6.077 0 0 0 6.073-6.073V8.745a8.003 8.003 0 0 0 4.675 1.507V7.059a4.77 4.77 0 0 1-.942-.373z" />
          </svg>
        </motion.a>

        {/* Zalo Link */}
        <motion.a
          href={zaloUrl}
          target="_blank"
          rel="noreferrer"
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 bg-[#0068FF] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow border border-white/10 relative group"
          title="Nhắn tin Zalo tư vấn"
        >
          {/* Pulse ping background animation */}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <MessageCircle className="w-5 h-5 fill-white" />
        </motion.a>
      </div>

    </div>
  );
};
export default FloatingContact;
