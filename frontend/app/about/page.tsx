'use client';

import React from 'react';
import { Award, Compass, Eye, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutPage() {
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
              Sợi Mộc được khai sinh từ niềm đam mê với nông sản sạch và mong muốn bảo tồn phương thức ẩm thực truyền thống của vùng đất biên viễn Cao Bằng. Chúng tôi nhận thấy hạt ngô tẻ trồng trên hốc đá có giá trị dinh dưỡng cao tuyệt vời nhưng chưa được khai thác xứng tầm.
            </p>
            <p>
              Với trăn trở đó, đội ngũ Sợi Mộc đã nghiên cứu phối hợp cùng nghệ nhân địa phương cải tiến quy trình, kết hợp cối đá nghiền truyền thống và công nghệ sấy lạnh khép kín tuần hoàn. Kết quả là những sợi bún ngô, phở ngô khô vàng mướt ra đời - mang trọn vẹn sinh khí và sự dẻo dai của núi rừng Cao Bằng.
            </p>
            <p>
              Tên gọi **Sợi Mộc** mang ý nghĩa về nét mộc mạc tự nhiên của sợi bún phở ngô, cùng sự sinh trưởng bền bỉ giữa đại ngàn đá núi.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="aspect-video w-full overflow-hidden bg-white border border-brand-green/10">
              <img
                src="/images/Hero.png"
                alt="Hình ảnh phở ngũ sắc Sợi Mộc"
                className="w-full h-full object-cover grayscale opacity-90 contrast-110 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
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

      </div>
    </div>
  );
}
