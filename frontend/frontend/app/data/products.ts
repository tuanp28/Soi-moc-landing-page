export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  details: string;
  image: string;
  images?: string[];
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
    originalPrice?: number;
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
    image: '/images/pho-ngo-main.jpg',
    images: ['/images/pho-ngo-main.jpg', '/images/pho-ngo-premium.jpg'],
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
      { weight: '500g', price: 35000, priceStr: '35.000đ', target: 'Phù hợp 2-3 người ăn' },
      { weight: '1kg', price: 65000, priceStr: '65.000đ', target: 'Gia đình 4-5 người ăn' }
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
    image: '/images/bun-ngo-main.jpg',
    images: ['/images/bun-ngo-main.jpg', '/images/bun-ngo-1.jpg', '/images/bun-ngo-2.jpg', '/images/bun-ngo.jpg'],
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
      { weight: '500g', price: 32000, priceStr: '32.000đ', originalPrice: 35000, target: 'Phù hợp 2-3 người ăn' },
      { weight: '1kg', price: 64000, priceStr: '64.000đ', target: 'Gia đình 4-5 người ăn' }
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
    image: '/images/pho-ngu-sac.jpg',
    images: ['/images/pho-ngu-sac.jpg', '/images/pho1.jpg'],
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
      { weight: '1kg', price: 80000, priceStr: '80.000đ', target: 'Gia đình 4-5 người ăn' }
    ],
    category: 'specialty',
    badge: 'SPECIAL EDITION'
  },
  {
    id: 'bun-cam-cao-tuyen',
    name: 'BÚN CẨM CAO TUYỀN',
    tagline: 'SẮC TÍM THẢO MỘC, THƠM NGON TRUYỀN THỐNG',
    description: 'Bún cẩm Cao Tuyền có màu tím tự nhiên từ lá cẩm, sợi bún mềm, dai, thơm ngon và được chế biến thủ công từ gạo ngon địa phương.',
    details: 'Được chế biến thủ công truyền thống từ gạo ngon Cao Bằng và nước lá cẩm tươi tự nhiên, không chất phụ gia hay phẩm màu hóa học. Sản phẩm bún khô Cao Tuyền đã được vinh danh là sản phẩm công nghiệp nông thôn tiêu biểu của tỉnh Cao Bằng, mang hương vị mộc mạc đặc trưng, béo bùi của gạo vùng cao và sợi bún dai ngon dẻo dai.',
    image: '/images/bun-cam-2.jpg',
    images: ['/images/bun-cam-2.jpg', '/images/bun-cam.png'],
    features: ['100% Màu tự nhiên từ lá cẩm', 'Gạo Đoàn Kết Cao Bằng', 'Không chất bảo quản & phụ gia', 'Sản phẩm OCOP tiêu biểu'],
    cookingTime: '5 - 7 phút',
    nutrition: {
      calories: '346 kcal',
      carbs: '73.2g',
      protein: '8.0g',
      fiber: '3.6g',
      fat: '0.9g'
    },
    sizes: [
      { weight: '500g', price: 38000, priceStr: '38.000đ', target: 'Phù hợp 2-3 người ăn' }
    ],
    category: 'specialty'
  },
  {
    id: 'bun-den-cao-tuyen',
    name: 'BÚN ĐEN CAO TUYỀN',
    tagline: 'DINH DƯỠNG SỨC KHỎE TỪ GẠO LỨT ĐEN VÀ VỪNG ĐEN',
    description: 'Đặc sản bún khô Cao Bằng làm từ gạo lứt đen và vừng đen nguyên chất. Sợi bún dai mềm, màu đen tự nhiên, giàu protein và ít calo.',
    details: 'Sản xuất theo bí quyết thủ công truyền thống của người Cao Bằng từ gạo lứt đen và vừng đen nguyên chất. Bún đen Cao Tuyền có màu đen tím đẹp mắt hoàn toàn tự nhiên, không hàn the hay chất tẩy. Sản phẩm có lượng calo thấp, giàu chất xơ và protein, là lựa chọn tuyệt vời cho người ăn kiêng, tập gym hoặc theo chế độ eat clean lành mạnh.',
    image: '/images/bun-den-cao-tuyen.jpg',
    images: ['/images/bun-den-cao-tuyen.jpg', '/images/bun-den.png'],
    features: ['Gạo lứt đen & vừng đen nguyên chất', 'Giàu protein & khoáng chất', 'Ít calo, thích hợp ăn kiêng', 'Sản xuất thủ công truyền thống'],
    cookingTime: '6 - 8 phút',
    nutrition: {
      calories: '335 kcal',
      carbs: '69.5g',
      protein: '9.2g',
      fiber: '4.8g',
      fat: '1.4g'
    },
    sizes: [
      { weight: '500g', price: 40000, priceStr: '40.000đ', target: 'Phù hợp 2-3 người ăn' }
    ],
    category: 'specialty'
  }
];
