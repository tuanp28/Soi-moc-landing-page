'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, ShieldCheck, Snowflake } from 'lucide-react';

interface ValueItem {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  badge?: string;
}

export const ValueShowcase: React.FC = () => {
  const values: ValueItem[] = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-brand-green" />,
      title: '3X CHẤT XƠ TỰ NHIÊN',
      subtitle: 'HỖ TRỢ EAT CLEAN & GIẢM CÂN',
      description: 'Hàm lượng chất xơ dồi dào gấp 3 lần bún gạo thường giúp cơ thể no lâu, thúc đẩy tiêu hóa và hỗ trợ kiểm soát cân nặng tự nhiên.',
      badge: 'ĐẶC TIÊU'
    },
    {
      icon: <Activity className="w-8 h-8 text-brand-green" />,
      title: 'CHỈ SỐ ĐƯỜNG HUYẾT THẤP',
      subtitle: 'ỔN ĐỊNH ĐƯỜNG HUYẾT (GI THẤP)',
      description: 'Nguồn tinh bột hấp thu chậm từ ngô tẻ thuần chủng Cao Bằng giúp giải phóng năng lượng bền bỉ, thích hợp cho người tiểu đường và tập gym.',
      badge: 'SỨC KHỎE'
    },
    {
      icon: <Snowflake className="w-8 h-8 text-brand-green" />,
      title: 'SẤY LẠNH KHÉP KÍN 36H',
      subtitle: 'BẢO TOÀN VI CHẤT DINH DƯỠNG',
      description: 'Áp dụng công nghệ sấy lạnh khép kín nhiệt độ thấp trong 36 giờ, sợi bún giữ trọn vẹn vitamin, màu sắc và độ thơm ngậy đặc trưng của ngô.',
      badge: 'CÔNG NGHỆ'
    },
    {
      icon: <Clock className="w-8 h-8 text-brand-green" />,
      title: '100% NGUYÊN BẢN CAO BẰNG',
      subtitle: 'NGÔ SẠCH HỐC ĐÁ QUẢNG UYÊN',
      description: 'Chế biến thủ công truyền thống bởi HTX nông nghiệp Cao Bằng. Không chất phụ gia bảo quản, không hàn the hay chất tẩy trắng hóa học.',
      badge: 'CHỨNG NHẬN OCOP'
    }
  ];

  return (
    <section className="py-20 bg-white border-b border-brand-green/10 relative overflow-hidden">
      {/* Background visual accents */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-brand-green-pale/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-brand-gold/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 md:px-10 relative z-10">
        
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-block text-xs font-black tracking-widest text-brand-green uppercase font-mono bg-brand-green-pale/50 px-3 py-1 border border-brand-green/10">
            SỨC MẠNH DINH DƯỠNG SẠCH
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-normal uppercase text-brand-charcoal font-serif leading-tight">
            TẠI SAO BẠN NÊN CHỌN SỢI MỘC?
          </h2>
          <p className="text-brand-muted text-sm md:text-base font-medium max-w-2xl mx-auto leading-relaxed">
            Sợi bún và phở ngô của chúng tôi được tối ưu hóa cho lối sống lành mạnh, kết hợp tinh hoa nông sản Cao Bằng và công nghệ chế biến hiện đại.
          </p>
        </div>

        {/* Lưới Grid Giá Trị */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="bg-brand-cream/40 border border-brand-green/10 hover:border-brand-green/30 p-6 flex flex-col justify-between relative group transition-all duration-300"
            >
              {item.badge && (
                <span className="absolute top-4 right-4 bg-brand-green-pale text-brand-green border border-brand-green/20 px-2 py-0.5 text-[8px] font-black tracking-widest font-mono uppercase">
                  {item.badge}
                </span>
              )}

              <div>
                <div className="w-16 h-16 bg-white border border-brand-green/10 flex items-center justify-center mb-6 shadow-2xs group-hover:scale-105 transition-transform duration-300">
                  {item.icon}
                </div>

                <h3 className="text-base font-black tracking-wide text-brand-charcoal uppercase font-serif mb-1">
                  {item.title}
                </h3>
                
                <h4 className="text-[10px] font-black tracking-widest text-brand-green font-mono uppercase mb-4">
                  {item.subtitle}
                </h4>

                <p className="text-brand-muted text-xs leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ValueShowcase;
