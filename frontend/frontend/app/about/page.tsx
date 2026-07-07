'use client';

import React, { useState } from 'react';
import { Award, Compass, Eye, ShieldCheck, ZoomIn, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function AboutPage() {
  const [activeCert, setActiveCert] = useState<string | null>(null);

  const values = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-brand-green" />,
      title: 'Tự nhiên & Nguyên Bản',
      desc: 'Nói không với hóa chất bảo quản, phẩm màu công nghiệp hay phụ gia tạo dai. Giữ lại hương vị mộc mạc và sắc vàng óng của ngô nguyên chất Cao Bằng.',
    },
    {
      icon: <Compass className="w-8 h-8 text-brand-green" />,
      title: 'Hỗ Trợ Bà Con Vùng Cao',
      desc: 'Chúng tôi liên kết tiêu thụ ngô tẻ và tạo sinh kế, tăng thu nhập bền vững cho bà con dân tộc thiểu số tại vùng cao Quảng Uyên - Cao Bằng.',
    },
    {
      icon: <Eye className="w-8 h-8 text-brand-green" />,
      title: 'Tối Ưu Cho Sức Khỏe',
      desc: 'Định nghĩa lại món phở/bún truyền thống thành nguồn dinh dưỡng thông minh, hỗ trợ tích cực cho chế độ ăn kiêng, tập luyện thể thao và Eat Clean.',
    },
    {
      icon: <Award className="w-8 h-8 text-brand-green" />,
      title: 'Tiêu Chuẩn Chất Lượng',
      desc: 'Sản xuất trên quy trình khép kín hiện đại đạt chuẩn vệ sinh an toàn thực phẩm nhưng vẫn bảo lưu trọn vẹn giá trị cốt lõi của nông sản Việt.',
    },
  ];

  const certifications = [
    {
      image: '/images/cert-business-1.jpg',
      title: 'Đăng Ký Doanh Nghiệp (Trang 1)',
      category: 'Hồ Sơ Pháp Lý',
      desc: 'Giấy chứng nhận đăng ký doanh nghiệp Công ty TNHH Cao Tuyền cấp bởi Sở KH&ĐT tỉnh Cao Bằng, MST: 4800931580.'
    },
    {
      image: '/images/cert-business-2.jpg',
      title: 'Đăng Ký Doanh Nghiệp (Trang 2)',
      category: 'Hồ Sơ Pháp Lý',
      desc: 'Quyết định thành lập và đăng ký kinh doanh được phê duyệt và ký đóng dấu đỏ bởi Phòng Đăng ký kinh doanh tỉnh Cao Bằng.'
    },
    {
      image: '/images/cert-vsattp.jpg',
      title: 'Cơ Sở Đủ Điều Kiện VSATTP',
      category: 'An Toàn Thực Phẩm',
      desc: 'Chứng nhận cơ sở đủ điều kiện An toàn thực phẩm cho hoạt động sản xuất bún/phở khô cấp bởi Sở Công Thương tỉnh Cao Bằng.'
    },
    {
      image: '/images/cert-iso.jpg',
      title: 'Hệ Thống Quản Lý ISO 22000',
      category: 'Tiêu Chuẩn Quốc Tế',
      desc: 'Chứng nhận hệ thống quản lý an toàn thực phẩm đạt tiêu chuẩn quốc tế ISO 22000:2018 cho hoạt động sản xuất chế biến.'
    },
    {
      image: '/images/cert-haccp.jpg',
      title: 'Tiêu Chuẩn HACCP Codex',
      category: 'Tiêu Chuẩn Quốc Tế',
      desc: 'Hệ thống phân tích mối nguy và kiểm soát tới hạn đạt chuẩn HACCP Codex Alimentarius cho cơ sở chế biến bún/phở khô.'
    }
  ];

  return (
    <div className="bg-brand-cream text-brand-charcoal min-h-screen py-16 font-sans">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        
        {/* Title Section */}
        <div className="border-b border-brand-green/10 pb-10 mb-16">
          <span className="block text-xs font-black tracking-widest text-brand-green uppercase font-mono">
            OUR STORY
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-normal uppercase text-brand-charcoal mt-3 leading-[1.15] font-serif">
            CÂU CHUYỆN SỢI MỘC
          </h1>
          <p className="text-brand-muted text-sm font-medium mt-3 max-w-xl">
            Hành trình đưa hạt ngô Cao Bằng vượt ngàn trùng đá tai mèo trở thành siêu thực phẩm năng lượng trên bàn ăn hiện đại.
          </p>
        </div>

        {/* Narrative Split Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-6 space-y-6 text-brand-muted text-sm md:text-base leading-relaxed font-medium">
            <h2 className="text-2xl md:text-4xl font-bold tracking-normal uppercase text-brand-charcoal font-serif leading-[1.15]">
              KHỞI NGUỒN TỪ CAO NGUYÊN ĐÁ
            </h2>
            <p>
              Sợi Mộc được khai sinh từ niềm đam mê với nông sản sạch và mong muốn bảo tồn phương thức ẩm thực truyền thống của vùng đất Cao Bằng. Chúng tôi nhận thấy hạt ngô tẻ trồng trên hốc đá có giá trị dinh dưỡng cao tuyệt vời nhưng chưa được khai thác xứng tầm.
            </p>
            <p>
              Với trăn trở đó, đội ngũ Sợi Mộc đã nghiên cứu phối hợp cùng nghệ nhân địa phương cải tiến quy trình, kết hợp cối đá nghiền truyền thống và công nghệ sấy lạnh khép kín tuần hoàn. Kết quả là những sợi bún ngô, phở ngô khô vàng mướt ra đời - mang trọn vẹn sinh khí và sự dẻo dai của núi rừng Cao Bằng.
            </p>
            <p>
              Tên gọi **Sợi Mộc** mang ý nghĩa về nét mộc mạc tự nhiên của sợi bún phở ngô, cùng sự sinh trưởng bền bỉ giữa đại ngàn đá núi.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="aspect-video w-full overflow-hidden bg-white border border-brand-green/10 relative">
              <Image
                src="/images/Hero.png"
                alt="Hình ảnh phở ngũ sắc Sợi Mộc"
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                loading="lazy"
                className="object-cover grayscale opacity-90 contrast-110 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
              />
            </div>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="border-t border-brand-green/10 pt-20">
          <div className="max-w-3xl mb-16 space-y-4">
            <span className="block text-xs font-black tracking-widest text-brand-green uppercase font-mono">
              BRAND CORE VALUES
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-normal uppercase text-brand-charcoal leading-[1.15] font-serif">
              GIÁ TRỊ CỐT LÕI
            </h2>
            <p className="text-brand-muted text-sm font-medium">
              4 kim chỉ nam dẫn lối mọi hoạt động của Sợi Mộc từ canh tác vùng nguyên liệu cho tới bàn ăn của khách hàng.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((val, idx) => (
              <div
                key={idx}
                className="bg-white border border-brand-green/10 p-8 flex gap-6 rounded-none group hover:border-brand-green/30 transition-colors"
              >
                <div className="p-3 bg-brand-cream border border-brand-green/10 w-fit h-fit flex-shrink-0 group-hover:bg-brand-green-pale group-hover:border-brand-green/20 transition-colors">
                  {val.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-brand-charcoal uppercase font-serif">
                    {val.title}
                  </h3>
                  <p className="text-brand-muted text-xs leading-relaxed font-medium">
                    {val.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quality Certifications & Legal Section */}
        <div className="border-t border-brand-green/10 pt-20 mt-20">
          <div className="max-w-3xl mb-16 space-y-4">
            <span className="block text-xs font-black tracking-widest text-brand-green uppercase font-mono">
              COMPLIANCE & QUALITY GUARANTEES
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-normal uppercase text-brand-charcoal leading-[1.15] font-serif">
              HỒ SƠ PHÁP LÝ & CHỨNG NHẬN
            </h2>
            <p className="text-brand-muted text-sm font-medium">
              Sản phẩm bún/phở ngô Sợi Mộc (Công ty TNHH Cao Tuyền) được sản xuất theo quy trình kiểm soát chất lượng nghiêm ngặt, đạt đầy đủ các chứng chỉ chất lượng quốc gia và quốc tế.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {certifications.map((cert, idx) => (
              <div
                key={idx}
                className="bg-white border border-brand-green/10 p-5 flex flex-col justify-between group hover:border-brand-green/30 transition-all duration-300 relative"
              >
                <div>
                  <div className="aspect-[3/4] w-full bg-stone-50 border border-brand-green/5 relative overflow-hidden mb-5">
                    <Image
                      src={cert.image}
                      alt={cert.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 250px"
                      loading="lazy"
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                    {/* Zoom button on hover */}
                    <div 
                      className="absolute inset-0 bg-brand-charcoal/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer z-10" 
                      onClick={() => setActiveCert(cert.image)}
                    >
                      <div className="bg-white/90 p-2.5 rounded-full text-brand-charcoal shadow-sm hover:scale-105 transition-transform">
                        <ZoomIn className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  <span className="inline-block text-[8px] font-black tracking-widest text-brand-green font-mono uppercase bg-brand-green-pale/50 px-2 py-0.5 border border-brand-green/10 mb-3">
                    {cert.category}
                  </span>
                  
                  <h3 className="text-xs font-bold text-brand-charcoal uppercase font-serif tracking-wide mb-2 line-clamp-2">
                    {cert.title}
                  </h3>
                  
                  <p className="text-[10px] text-brand-muted leading-relaxed font-medium">
                    {cert.desc}
                  </p>
                </div>
                
                <button
                  onClick={() => setActiveCert(cert.image)}
                  className="mt-5 w-full py-2.5 border border-brand-green/20 hover:border-brand-green hover:bg-brand-green hover:text-white text-[9px] font-black tracking-widest text-brand-green transition-all uppercase rounded-none cursor-pointer text-center"
                >
                  XEM CHI TIẾT ẢNH
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Zoom Modal */}
      <AnimatePresence>
        {activeCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-charcoal/80 backdrop-blur-xs flex items-center justify-center p-5 z-[999] cursor-zoom-out"
            onClick={() => setActiveCert(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              className="relative max-w-3xl max-h-[85vh] w-full aspect-[3/4] bg-white border border-brand-green/10 shadow-2xl overflow-hidden cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 bg-brand-charcoal/70 hover:bg-brand-charcoal text-white p-2 rounded-full cursor-pointer z-50 transition-colors shadow-sm focus:outline-none"
                onClick={() => setActiveCert(null)}
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-full h-full p-2 bg-white relative">
                <Image
                  src={activeCert}
                  alt="Chứng nhận phóng to"
                  fill
                  className="object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
