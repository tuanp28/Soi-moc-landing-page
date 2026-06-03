'use client';

import React from 'react';
import Image from 'next/image';
import { Quote } from 'lucide-react';

export const Manifesto: React.FC = () => {
  return (
    <section className="relative py-24 bg-white overflow-hidden border-y border-brand-green/10">
      {/* Decorative Giant Background Word */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[20vw] font-black leading-none text-brand-green/[0.02] select-none tracking-tighter uppercase font-sans pointer-events-none">
        SOIMOC
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Block: Image Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[3/4] w-full max-w-sm mx-auto overflow-hidden bg-brand-cream/50 border border-brand-green/10">
              <Image
                src="/images/anh2.jpg"
                alt="Quy trình chế biến bún phở ngô khô"
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                loading="lazy"
                className="object-cover grayscale opacity-90 contrast-110 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/10 via-transparent to-transparent z-10" />
            </div>

            {/* Float badge */}
            <div className="absolute bottom-6 right-6 lg:-right-6 bg-brand-green text-white p-6 max-w-[200px] shadow-lg">
              <Quote className="w-5 h-5 mb-2 stroke-[3] text-brand-green-pale" />
              <p className="text-[10px] font-black tracking-widest uppercase font-mono mb-1 text-brand-green-pale/80">CAM KẾT SẠCH</p>
              <p className="text-xs font-bold leading-tight">100% không hàn the, không chất tẩy trắng hóa học.</p>
            </div>
          </div>

          {/* Right Block: Content */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="block text-xs font-black tracking-widest text-brand-green uppercase font-mono">
                TUYÊN NGÔN THƯƠNG HIỆU
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight uppercase leading-[1.2] text-brand-charcoal font-serif">
                TRUYỀN THUYẾT VÀNG TỪ HẠT NGÔ VÙNG CAO
              </h2>
            </div>

            <div className="space-y-6 text-brand-muted text-sm md:text-base leading-relaxed font-medium">
              <p>
                Tại Cao Bằng, cây ngô tẻ không chỉ là một cây lương thực. Nó là sức sống mãnh liệt sinh trưởng giữa những hốc đá tai mèo sắc nhọn, chịu đựng cái lạnh buốt giá và nắng gắt khô cằn của cao nguyên đá. Chính sự tôi luyện khắc nghiệt đó đã kết tinh nên những hạt ngô vàng chắc nịch, dồi dào dinh dưỡng và đậm đà hương vị mộc mạc.
              </p>
              
              <div className="border-l-4 border-brand-green pl-6 my-8 py-2 bg-brand-cream/80">
                <p className="text-brand-charcoal text-base md:text-lg font-bold italic tracking-wide font-serif">
                  "Chúng tôi không chỉ giới thiệu sản phẩm. Chúng tôi mang đến nét đẹp ẩm thực nguyên bản và những gì trong lành nhất từ đất đá Cao Bằng đến gian bếp gia đình Việt."
                </p>
              </div>

              <p>
                Kế thừa phương thức truyền thống kết hợp với quy trình sấy lạnh khép kín hiện đại, Sợi Mộc tự hào giới thiệu những thớ bún/phở ngô dai mềm mộc mạc và giữ lại trọn vẹn lớp xơ ngô quê bổ dưỡng cho cơ thể. Mỗi món ăn làm từ ngô khô Sợi Mộc là một bước đệm cho sức sống dẻo dai lành mạnh mỗi ngày.
              </p>
            </div>

            {/* Achievement / Values Counter */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-brand-green/10">
              <div>
                <p className="text-3xl font-black text-brand-charcoal font-serif">100%</p>
                <p className="text-[9px] text-brand-muted font-bold uppercase tracking-wider mt-1">Nguyên bản Cao Bằng</p>
              </div>
              <div>
                <p className="text-3xl font-black text-brand-green font-serif">36H</p>
                <p className="text-[9px] text-brand-muted font-bold uppercase tracking-wider mt-1">Sấy lạnh khép kín</p>
              </div>
              <div>
                <p className="text-3xl font-black text-brand-charcoal font-serif">3X</p>
                <p className="text-[9px] text-brand-muted font-bold uppercase tracking-wider mt-1">Chất xơ so với bún thường</p>
              </div>
              <div>
                <p className="text-3xl font-black text-brand-green font-serif">0%</p>
                <p className="text-[9px] text-brand-muted font-bold uppercase tracking-wider mt-1">Chất phụ gia bảo quản</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
export default Manifesto;
