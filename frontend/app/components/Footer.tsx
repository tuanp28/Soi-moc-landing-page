'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, MapPin, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const policyLinks = [
    { name: 'Chính sách đại lý', path: '/policies/dai-ly' },
    { name: 'Chính sách mua hàng', path: '/policies/mua-hang' },
    { name: 'Chính sách bảo hành đổi trả', path: '/policies/doi-tra' },
    { name: 'Chính sách bảo mật thông tin', path: '/policies/bao-mat' },
    { name: 'Chính sách phương thức thanh toán', path: '/policies/thanh-toan' },
    { name: 'Chính sách vận chuyển & Giao nhận', path: '/policies/van-chuyen' },
    { name: 'Chính sách thành viên & Ưu đãi', path: '/policies/thanh-vien' },
  ];

  return (
    <footer className="bg-[#1c1917] border-t border-stone-850 text-white pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-5 md:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
        {/* Brand Info */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/images/final.png"
              alt="Logo Sợi Mộc"
              className="w-11 h-11 rounded-full object-cover border border-brand-green-pale/20 shadow-xs"
            />
            <span className="font-black text-xl tracking-tight text-white font-serif">
              Sợi Mộc
            </span>
          </Link>
          <p className="text-stone-300 text-xs leading-relaxed max-w-sm">
            Tinh hoa ẩm thực Cao Bằng. Sợi phở ngô và bún ngô sấy lạnh 36h nguyên bản tự nhiên, không hóa chất, không phụ gia, cung cấp nguồn năng lượng sạch lành cho sức khỏe bền bỉ.
          </p>
        </div>

        {/* Store Policies */}
        <div>
          <h4 className="text-xs font-black tracking-widest text-green-500 uppercase mb-5">
            VỀ CHÚNG TÔI & CHÍNH SÁCH
          </h4>
          <ul className="space-y-3">
            <li>
              <Link href="/about" className="text-stone-300 hover:text-white text-xs transition-colors">
                Giới thiệu câu chuyện Sợi Mộc
              </Link>
            </li>
            {policyLinks.map((link) => (
              <li key={link.path}>
                <Link href={link.path} className="text-stone-300 hover:text-white text-xs transition-colors">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h4 className="text-xs font-black tracking-widest text-green-500 uppercase mb-1 font-sans">
            LIÊN HỆ MUA HÀNG
          </h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-stone-300 text-xs">
              <Phone className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Hotline / Zalo:</p>
                <p className="hover:text-green-500 transition-colors">0377.159.498</p>
              </div>
            </li>
            <li className="flex items-start gap-2 text-stone-300 text-xs">
              <MapPin className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Vùng nguyên liệu & sản xuất:</p>
                <p>Cao Bằng, Việt Nam</p>
              </div>
            </li>
            <li className="flex items-start gap-2 text-stone-300 text-xs">
              <Mail className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Email:</p>
                <p>soimoc201@gmail.com</p>
              </div>
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright Line */}
      <div className="max-w-7xl mx-auto px-5 md:px-10 pt-8 border-t border-stone-850 flex flex-col sm:flex-row justify-between items-center gap-4 text-stone-400 text-[10px] tracking-wider uppercase font-semibold">
        <p>© {currentYear} SOI MOC CO., LTD. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-4">
          <span>THIẾT KẾ PHONG CÁCH PREMIUM</span>
          <span className="text-green-500/50">|</span>
          <span>100% ORGANIC CORN PRODUCT</span>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
