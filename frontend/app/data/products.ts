export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  details: string;
  image: string;
  features: string[];
  cookingTime: string;
  nutrition: {
    calories: string; // per 100g
    carbs: string;
    protein: string;
    fiber: string;
    fat: string;
  };
  sizes: {
    weight: string;
    price: number;
    priceStr: string;
    target: string;
  }[];
  category: 'corn' | 'specialty';
  badge?: string;
}

export const products: Product[] = [
  {
    id: 'pho-ngo-premium',
    name: 'PHỞ NGÔ KHÔ PREMIUM',
    tagline: 'SỨC MẠNH TỪ NGÔ BẢN ĐỊA CAO BẰNG',
    description: 'Sợi phở vàng óng tự nhiên từ ngô tẻ vùng cao, sấy lạnh 36h giữ trọn vẹn chất xơ và vitamin. Carb hấp thu chậm hỗ trợ tối ưu cho lối sống năng động và tập luyện.',
    details: 'Được chế biến từ hạt ngô tẻ thuần chủng trồng trên các hốc đá Cao Bằng. Áp dụng công nghệ nghiền cối đá thủy lực tốc độ chậm giúp bảo toàn lớp cám ngô giàu dinh dưỡng. Trải qua quy trình sấy lạnh khép kín 36 giờ, sợi phở ngô giữ được độ dai dẻo mộc mạc và hương thơm ngậy đặc trưng mà không cần bất cứ chất phụ gia nào.',
    image: '/images/pho1.jpg',
    features: ['100% Ngô bản địa Cao Bằng', 'Không chứa Gluten (Gluten-Free)', 'Carbohydrate phức hợp hấp thu chậm', 'Chỉ số đường huyết (GI) thấp'],
    cookingTime: '6 - 8 phút',
    nutrition: {
      calories: '345 kcal',
      carbs: '72.5g',
      protein: '8.5g',
      fiber: '4.2g',
      fat: '1.2g'
    },
    sizes: [
      { weight: '500g', price: 39000, priceStr: '39.000đ', target: 'Phù hợp 2-3 người ăn' },
      { weight: '1kg', price: 69000, priceStr: '69.000đ', target: 'Gia đình 4-5 người ăn' }
    ],
    category: 'corn',
    badge: 'BEST SELLER'
  },
  {
    id: 'bun-ngo-premium',
    name: 'BÚN NGÔ KHÔ PREMIUM',
    tagline: 'TIÊU CHUẨN MỚI CỦA SỢI BÚN SẠCH',
    description: 'Sợi bún tròn dai dẻo, mang màu sắc vàng nắng của ngô Cao Bằng. Sự lựa chọn hoàn hảo thay thế bún gạo thường cho chế độ ăn kiêng và kiểm soát cân nặng.',
    details: 'Sản phẩm bún ngô khô được định hình sợi tròn truyền thống nhưng mang đột phá về mặt dinh dưỡng. Sợi bún dai mướt, khi nấu không bị nát, có hậu vị ngọt thanh nhẹ của tinh bột ngô chín. Chứa hàm lượng chất xơ cao gấp 3 lần bún gạo thông thường giúp bạn no lâu hơn, cung cấp năng lượng bền bỉ cho cả ngày dài.',
    image: '/images/final.png',
    features: ['Không phẩm màu hóa học', 'Hàm lượng chất xơ cao vượt trội', 'Nguồn năng lượng sạch bền bỉ', 'Hỗ trợ ăn kiêng & Eat Clean'],
    cookingTime: '5 - 7 phút',
    nutrition: {
      calories: '342 kcal',
      carbs: '71.2g',
      protein: '8.2g',
      fiber: '4.0g',
      fat: '1.1g'
    },
    sizes: [
      { weight: '500g', price: 39000, priceStr: '39.000đ', target: 'Phù hợp 2-3 người ăn' },
      { weight: '1kg', price: 69000, priceStr: '69.000đ', target: 'Gia đình 4-5 người ăn' }
    ],
    category: 'corn',
    badge: 'NEW'
  },
  {
    id: 'pho-ngu-sac',
    name: 'PHỞ NGŨ SẮC CAO BẰNG',
    tagline: 'BẢN SẮC TRUYỀN THỐNG TRONG GIAO DIỆN HIỆN ĐẠI',
    description: 'Sự giao thoa đầy màu sắc giữa gạo đặc sản vùng cao và các loại rau củ hữu cơ tự nhiên (Lá cẩm, hoa đậu biếc, gấc, chùm ngây, ngô).',
    details: 'Phở Ngũ Sắc mang lại bàn ăn rực rỡ và giàu vi chất dinh dưỡng. 5 màu sắc đại diện cho 5 hương vị và dưỡng chất thực vật khác nhau: Màu vàng từ ngô tẻ, màu đỏ từ gấc, màu tím từ lá cẩm, màu xanh từ chùm ngây và màu xanh lam từ hoa đậu biếc. Sợi phở dai ngon đặc trưng vùng Cao Bằng, hoàn toàn tự nhiên, không hàn trang, không chất tẩy.',
    image: '/images/Hero.png',
    features: ['Chiết xuất rau củ quả tự nhiên', 'Giàu chất chống oxy hóa phytochemistry', 'Dai dẻo truyền thống Cao Bằng', 'Đẹp mắt, khơi dậy vị giác'],
    cookingTime: '6 - 8 phút',
    nutrition: {
      calories: '350 kcal',
      carbs: '74.0g',
      protein: '7.8g',
      fiber: '3.5g',
      fat: '0.8g'
    },
    sizes: [
      { weight: '500g', price: 49000, priceStr: '49.000đ', target: 'Phù hợp 2-3 người ăn' },
      { weight: '1kg', price: 95000, priceStr: '95.000đ', target: 'Gia đình 4-5 người ăn' }
    ],
    category: 'specialty',
    badge: 'SPECIAL EDITION'
  },
  {
    id: 'pho-hoa-dau-biec',
    name: 'PHỞ HOA ĐẬU BIẾC',
    tagline: 'SẮC TÍM THANH TAO, DINH DƯỠNG LÀNH MẠNH',
    description: 'Sợi phở sắc tím tự nhiên từ hoa đậu biếc, giàu chất chống oxy hóa tự nhiên giúp thanh lọc cơ thể và tăng cường sức đề kháng.',
    details: 'Được chế biến bằng cách kết hợp gạo bao thai đặc sản Cao Bằng với nước cốt hoa đậu biếc tươi. Sợi phở sau khi luộc có màu tím xanh nhạt rất đẹp, vị thanh nhẹ, dễ ăn. Chứa anthocyanin từ hoa đậu biếc - một chất chống oxy hóa mạnh mẽ giúp bảo vệ tế bào và làm chậm quá trình lão hóa.',
    image: '/images/anh2.jpg',
    features: ['Giàu Anthocyanin chống oxy hóa', 'Hương hoa đậu biếc thoảng nhẹ', 'Tốt cho tim mạch và làn da', '100% màu tự nhiên từ hoa tươi'],
    cookingTime: '6 - 8 phút',
    nutrition: {
      calories: '348 kcal',
      carbs: '73.2g',
      protein: '7.6g',
      fiber: '3.2g',
      fat: '0.7g'
    },
    sizes: [
      { weight: '500g', price: 42000, priceStr: '42.000đ', target: 'Phù hợp 2-3 người ăn' },
      { weight: '1kg', price: 72000, priceStr: '72.000đ', target: 'Gia đình 4-5 người ăn' }
    ],
    category: 'specialty'
  }
];
