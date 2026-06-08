'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Hammer, Wind, Activity, Award } from 'lucide-react';

export const TechShowcase: React.FC = () => {
  const steps = [
    {
      icon: <Hammer className="w-8 h-8 text-brand-green" />,
      title: 'STONE GROUND TECH',
      subtitle: 'Nghiền Cối Đá Thủy Lực',
      desc: 'Hạt ngô được nghiền bằng cối đá thủy lực với tốc độ quay cực thấp, triệt tiêu nhiệt lượng phát sinh nhằm bảo vệ tối đa các vitamin nhóm B, khoáng chất và lớp xơ quý giá.',
    },
    {
      icon: <Wind className="w-8 h-8 text-brand-green" />,
      title: '36H DEHYDRATION',
      subtitle: 'Sấy Lạnh Tuần Hoàn',
      desc: 'Quá trình sấy nhiệt độ thấp liên tục trong 36 giờ rút hơi nước tự nhiên từ sợi bún/phở một cách chậm rãi, tạo cấu trúc dai dẻo tự nhiên mà không cần hàn the hay bột lọc.',
    },
    {
      icon: <Activity className="w-8 h-8 text-brand-green" />,
      title: 'SLOW-RELEASE ENERGY',
      subtitle: 'Carbohydrate Phức Hợp',
      desc: 'Cấu trúc tinh bột ngô giữ nguyên sợi xơ xốp giải phóng glucose chậm rãi vào máu, duy trì mức năng lượng ổn định bền bỉ, thích hợp cho người tập gym, thể thao và giảm cân.',
    },
    {
      icon: <Award className="w-8 h-8 text-brand-green" />,
      title: 'GLUTEN FREE / VEGAN',
      subtitle: 'Độc Lập Từ Thiên Nhiên',
      desc: 'Sản phẩm thuần tự nhiên, không chứa protein gluten lúa mì gây đầy bụng hay dị ứng, lành tính tuyệt đối cho hệ tiêu hóa của người ăn eat clean hay ăn chay.',
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-brand-cream to-white border-b border-brand-green/10">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        
        {/* Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <span className="block text-xs font-black tracking-widest text-brand-green uppercase font-mono">
            TECHNOLOGY & NUTRITION
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight uppercase text-brand-charcoal leading-[1.2] font-serif">
            CÔNG NGHỆ CHẾ BIẾN & CHẤT LƯỢNG SỢI MỘC
          </h2>
          <p className="text-brand-muted text-sm md:text-base font-medium">
            Chúng tôi giới thiệu sợi phở/bún ngô mộc mạc làm bằng công nghệ hiện đại nhằm giữ lại các giá trị dinh dưỡng cao nhất, hỗ trợ tốt nhất cho hoạt động sống và sức khỏe của bạn.
          </p>
        </div>

        {/* Tech Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white border border-brand-green/10 p-8 flex flex-col justify-between h-full relative group transition-all duration-300 hover:border-brand-green/30 hover:shadow-sm"
            >
              {/* Subtle light effect on card top */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-green/0 to-transparent group-hover:via-brand-green/50 transition-all duration-300" />
              
              <div>
                <div className="mb-6 p-3 bg-brand-cream/50 w-fit rounded-none border border-brand-green/15 group-hover:bg-brand-green-pale group-hover:border-brand-green/35 transition-colors">
                  {step.icon}
                </div>
                <h3 className="text-xs font-black tracking-widest text-brand-muted/70 uppercase font-mono mb-1 group-hover:text-brand-green transition-colors">
                  {step.title}
                </h3>
                <h4 className="text-lg font-bold text-brand-charcoal uppercase mb-4 font-serif">
                  {step.subtitle}
                </h4>
                <p className="text-brand-muted text-xs leading-relaxed font-medium">
                  {step.desc}
                </p>
              </div>

              {/* Card Index in Footer */}
              <div className="mt-8 font-mono text-[9px] font-black text-brand-green-pale group-hover:text-brand-green/30 transition-colors">
                [ TECH 0{idx + 1} // SM-NUTRITION ]
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
export default TechShowcase;
