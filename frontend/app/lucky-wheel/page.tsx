import React from 'react';
import type { Metadata } from 'next';
import LuckyWheel from '../components/LuckyWheel';

export const metadata: Metadata = {
  title: 'Vòng Quay May Mắn - Sợi Mộc | Nhận Voucher Quà Tặng Hấp Dẫn',
  description: 'Tham gia vòng quay may mắn để nhận ngay các mã ưu đãi độc quyền từ Sợi Mộc: Voucher giảm 10%, 20k, 50k và mã VIP 15% cực giá trị.',
  keywords: 'vòng quay may mắn, voucher sợi mộc, khuyến mãi bún ngô, bún ngô đặc sản, phở ngô khô',
  openGraph: {
    title: 'Vòng Quay May Mắn - Sợi Mộc | Trúng Voucher Đến 50k & 15% VIP',
    description: 'Thử vận may của bạn ngay hôm nay cùng Sợi Mộc. Quay là trúng voucher giảm giá cực hời.',
  },
};

export default function LuckyWheelPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#F2EADF] via-[#FAF6EE] to-[#F2EADF] dark:from-[#151A13] dark:via-[#111510] dark:to-[#151A13] py-16 md:py-24 overflow-hidden">
      
      {/* Background Graphic Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2ddd5_1px,transparent_1px),linear-gradient(to_bottom,#e2ddd5_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(250,246,238,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(250,246,238,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_30%,#F9F4EC_95%] dark:bg-radial-[circle_at_center,transparent_30%,#111510_95%] pointer-events-none" />

      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-[5%] w-[350px] h-[350px] rounded-full bg-brand-green/8 dark:bg-brand-green/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-[5%] w-[450px] h-[450px] rounded-full bg-brand-gold/10 dark:bg-brand-gold/5 blur-3xl pointer-events-none" />

      {/* Decorative Dashed Arc Circles */}
      <div className="absolute top-[20%] right-[-100px] w-[500px] h-[500px] rounded-full border border-dashed border-[#2D5A27]/10 dark:border-white/5 pointer-events-none z-0" />
      <div className="absolute bottom-[20%] left-[-150px] w-[400px] h-[400px] rounded-full border border-dashed border-[#2D5A27]/8 dark:border-white/5 pointer-events-none z-0" />
      
      {/* Content wrapper */}
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Navigation Breadcrumb */}
        <nav className="text-xs uppercase tracking-wider text-brand-charcoal/60 mb-8 font-sans" aria-label="Breadcrumb">
          <a href="/" className="hover:text-brand-green transition-colors">Trang chủ</a>
          <span className="mx-2">/</span>
          <span className="text-brand-charcoal font-semibold">Vòng quay may mắn</span>
        </nav>

        {/* Hidden SEO Header */}
        <h1 className="sr-only">Vòng Quay May Mắn Nhận Voucher Đặc Biệt Từ Sợi Mộc</h1>

        <main id="lucky-wheel-main" className="bg-white dark:bg-[#171E15] rounded-[2.5rem] border border-brand-green/15 dark:border-white/10 shadow-xl overflow-hidden p-6 md:p-12">
          {/* Embedding the interactive component */}
          <LuckyWheel />

          {/* Detailed usage terms & conditions */}
          <section className="mt-12 pt-10 border-t border-stone-200/60 max-w-2xl mx-auto">
            <h3 className="font-serif text-lg text-brand-green font-bold mb-4 text-center">
              Điều Kiện & Thể Lệ Chương Trình
            </h3>
            <ul className="list-disc list-outside pl-5 font-sans text-xs md:text-sm text-brand-charcoal/80 space-y-3 leading-relaxed">
              <li>Mỗi khách hàng (dựa trên địa chỉ IP thiết bị và tài khoản đăng nhập) chỉ được tham gia quay số <strong className="text-brand-gold font-bold">1 lần trong vòng 24 giờ</strong>.</li>
              <li>Mọi hành vi gian lận, sử dụng bot, công cụ đổi IP tự động sẽ bị hệ thống bảo mật reCAPTCHA phát hiện và tự động khóa quyền tham gia.</li>
              <li>Mã giảm giá nhận được chỉ có giá trị áp dụng khi mua hàng trực tuyến tại trang web chính thức của <strong className="text-brand-green font-bold">Sợi Mộc</strong>.</li>
              <li>Mã ưu đãi không có giá trị quy đổi thành tiền mặt hay chuyển nhượng dưới bất kỳ hình thức nào.</li>
              <li>Vui lòng chụp lại màn hình hoặc sao chép mã ưu đãi ngay khi trúng thưởng để không bỏ lỡ phần quà.</li>
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
}
