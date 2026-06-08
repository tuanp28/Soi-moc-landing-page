'use client';

import React, { useState } from 'react';
import { Award, Compass, Eye, ShieldCheck, ZoomIn, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const LeafSVG: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 8C8 10 5.9 16.1 5.1 19C7.4 18.2 13.5 16 15.5 7.1C16.2 4.1 18.3 2 18.3 2S16.2 4.1 17 8Z" />
    <path d="M2 22C2 22 5.5 17.5 11.5 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

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
    <div className="relative min-h-screen bg-gradient-to-b from-[#F2EADF] via-[#FAF6EE] to-[#F2EADF] dark:from-[#151A13] dark:via-[#111510] dark:to-[#151A13] py-16 md:py-24 overflow-hidden font-sans text-brand-charcoal">
      
      {/* Background Graphic Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2ddd5_1px,transparent_1px),linear-gradient(to_bottom,#e2ddd5_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(250,246,238,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(250,246,238,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_30%,#F9F4EC_95%] dark:bg-radial-[circle_at_center,transparent_30%,#111510_95%] pointer-events-none" />

      {/* Decorative Dashed Arc Circles */}
      <div className="absolute top-[20%] right-[-100px] w-[500px] h-[500px] rounded-full border border-dashed border-[#2D5A27]/10 dark:border-white/5 pointer-events-none z-0" />
      <div className="absolute bottom-[20%] left-[-150px] w-[400px] h-[400px] rounded-full border border-dashed border-[#2D5A27]/8 dark:border-white/5 pointer-events-none z-0" />

      {/* Glowing Ambient Mesh Orbs */}
      <div className="absolute top-1/4 left-1/10 w-[350px] h-[350px] rounded-full bg-brand-green/8 dark:bg-brand-green/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-[450px] h-[450px] rounded-full bg-brand-gold/10 dark:bg-brand-gold/5 blur-3xl pointer-events-none" />

      {/* Drifting Organic Particles (Falling Blurry Green Leaves) */}
      <motion.div
        animate={{
          y: [-20, 800],
          x: [0, 40, 0],
          rotate: [0, 240],
          opacity: [0, 0.95, 0.95, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-[5%] left-[25%] w-5 h-3 bg-[#2D5A27]/40 dark:bg-brand-green/25 rounded-full blur-[1px] pointer-events-none z-0"
      />
      <motion.div
        animate={{
          y: [-20, 600],
          x: [0, -30, 0],
          rotate: [45, 285],
          opacity: [0, 0.95, 0.95, 0]
        }}
        transition={{ duration: 18, repeat: Infinity, delay: 5, ease: "linear" }}
        className="absolute top-[15%] left-[65%] w-4.5 h-2.5 bg-[#2D5A27]/35 dark:bg-brand-green/20 rounded-full blur-[1.2px] pointer-events-none z-0"
      />
      <motion.div
        animate={{
          y: [-20, 700],
          x: [0, 35, 0],
          rotate: [90, 330],
          opacity: [0, 0.95, 0.95, 0]
        }}
        transition={{ duration: 22, repeat: Infinity, delay: 10, ease: "linear" }}
        className="absolute top-[10%] left-[85%] w-3.5 h-2 bg-[#C8953A]/45 dark:bg-brand-gold/25 rounded-full blur-[0.8px] pointer-events-none z-0"
      />

      {/* Floating Organic Leaves */}
      <motion.div
        animate={{
          y: [0, -18, 0],
          x: [0, 12, 0],
          rotate: [0, 30, 0]
        }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        className="absolute top-[15%] left-[5%] text-brand-green/15 w-8 h-8 pointer-events-none hidden lg:block z-0"
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
        className="absolute bottom-[30%] right-[5%] text-brand-gold/15 w-10 h-10 pointer-events-none hidden lg:block z-0"
      >
        <LeafSVG className="w-full h-full text-brand-gold/10" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-5 md:px-10 relative z-10">
        
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border-b border-brand-green/10 pb-10 mb-16"
        >
          <span className="block text-xs font-black tracking-widest text-brand-green uppercase font-mono">
            OUR STORY
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-normal uppercase text-brand-charcoal mt-3 leading-[1.15] font-serif">
            CÂU CHUYỆN SỢI MỘC
          </h1>
          <p className="text-brand-muted text-sm font-medium mt-3 max-w-xl">
            Hành trình đưa hạt ngô Cao Bằng vượt ngàn trùng đá tai mèo trở thành siêu thực phẩm năng lượng trên bàn ăn hiện đại.
          </p>
        </motion.div>

        {/* Narrative Split Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6 text-brand-muted text-sm md:text-base leading-relaxed font-medium"
          >
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-normal uppercase text-brand-charcoal font-serif leading-[1.15] sm:whitespace-nowrap">
              KHỞI NGUỒN TỪ CAO NGUYÊN ĐÁ
            </h2>
            <p>
              Sợi Mộc được khai sinh từ niềm đam mê với nông sản sạch và mong muốn bảo tồn phương thức ẩm thực truyền thống của vùng đất biên viễn Cao Bằng. Chúng tôi nhận thấy hạt ngô tẻ trồng trên hốc đá có giá trị dinh dưỡng cao tuyệt vời nhưng chưa được khai thác xứng tầm.
            </p>
            <p>
              Với trăn trở đó, đội ngũ Sợi Mộc đã nghiên cứu phối hợp cùng nghệ nhân địa phương cải tiến quy trình, kết hợp cối đá nghiền truyền thống và công nghệ sấy lạnh khép kín tuần hoàn. Kết quả là những sợi bún ngô, phở ngô khô vàng mướt ra đời - mang trọn vẹn sinh khí và sự dẻo dai của núi rừng Cao Bằng.
            </p>
            <p>
              Tên gọi **Sợi Mộc** mang ý nghĩa về nét mộc mạc tự nhiên của sợi bún phở ngô, cùng sự sinh trưởng bền bỉ giữa đại ngàn đá núi.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6"
          >
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
          </motion.div>
        </div>

        {/* Core Values Section */}
        <div className="border-t border-brand-green/10 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mb-16 space-y-4"
          >
            <span className="block text-xs font-black tracking-widest text-brand-green uppercase font-mono">
              BRAND CORE VALUES
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-normal uppercase text-brand-charcoal leading-[1.15] font-serif">
              GIÁ TRỊ CỐT LÕI
            </h2>
            <p className="text-brand-muted text-sm font-medium">
              4 kim chỉ nam dẫn lối mọi hoạt động của Sợi Mộc từ canh tác vùng nguyên liệu cho tới bàn ăn của khách hàng.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
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
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quality Certifications & Legal Section */}
        <div className="border-t border-brand-green/10 pt-20 mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mb-16 space-y-4"
          >
            <span className="block text-xs font-black tracking-widest text-brand-green uppercase font-mono">
              COMPLIANCE & QUALITY GUARANTEES
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-normal uppercase text-brand-charcoal leading-[1.15] font-serif">
              HỒ SƠ PHÁP LÝ & CHỨNG NHẬN
            </h2>
            <p className="text-brand-muted text-sm font-medium">
              Sản phẩm bún/phở ngô Sợi Mộc (Công ty TNHH Cao Tuyền) được sản xuất theo quy trình kiểm soát chất lượng nghiêm ngặt, đạt đầy đủ các chứng chỉ chất lượng quốc gia và quốc tế.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {certifications.map((cert, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
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
              </motion.div>
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
                className="absolute top-4 right-4 bg-brand-charcoal/70 hover:bg-brand-charcoal text-white dark:text-brand-cream p-2 rounded-full cursor-pointer z-50 transition-colors shadow-sm focus:outline-none"
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
