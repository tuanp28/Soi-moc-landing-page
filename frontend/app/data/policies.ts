export interface PolicySection {
  title: string;
  content: string;
  items?: { subtitle: string; text: string }[];
}

export interface Policy {
  slug: string;
  title: string;
  description: string;
  lastUpdated: string;
  sections: PolicySection[];
}

export const policies: Record<string, Policy> = {
  'dai-ly': {
    slug: 'dai-ly',
    title: 'Chính Sách Đại Lý & Hợp Tác',
    description: 'Hệ thống phân phối và chính sách hợp tác kinh doanh phở/bún ngô Sợi Mộc toàn quốc.',
    lastUpdated: 'Tháng 5, 2026',
    sections: [
      {
        title: '1. Quyền Lợi Của Đại Lý',
        content: 'Chúng tôi cam kết mang lại mức chiết khấu và quyền lợi tốt nhất để các đại lý, nhà phân phối an tâm cùng phát triển thương hiệu Sợi Mộc.',
        items: [
          {
            subtitle: 'Chiết khấu hấp dẫn',
            text: 'Hưởng mức chiết khấu cực kỳ cạnh tranh dựa trên số lượng đơn hàng nhập, đảm bảo biên lợi nhuận tốt cho đại lý kinh doanh.'
          },
          {
            subtitle: 'Độc quyền khu vực',
            text: 'Hỗ trợ bảo vệ thị trường, áp dụng chính sách đại lý độc quyền phân phối tại các quận/huyện hoặc tỉnh thành cụ thể đối với các đại lý cam kết doanh số cao.'
          },
          {
            subtitle: 'Hỗ trợ Marketing & Tư liệu',
            text: 'Đại lý được cung cấp hình ảnh sản phẩm chất lượng cao, banner quảng cáo, giấy chứng nhận an toàn thực phẩm, kiểm nghiệm dinh dưỡng và hỗ trợ chạy quảng cáo khu vực.'
          }
        ]
      },
      {
        title: '2. Yêu Cầu Đối Với Đại Lý',
        content: 'Để đảm bảo hình ảnh thương hiệu và chất lượng phục vụ khách hàng đồng đều, các đại lý cần tuân thủ một số quy định sau:',
        items: [
          {
            subtitle: 'Giá bán niêm yết',
            text: 'Đại lý cam kết bán đúng giá bán lẻ niêm yết do Sợi Mộc quy định hoặc không thấp hơn mức giá tối thiểu đã thỏa thuận để tránh tình trạng phá giá.'
          },
          {
            subtitle: 'Bảo quản sản phẩm',
            text: 'Sản phẩm bún/phở ngô khô cần được bảo quản ở nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp và độ ẩm cao nhằm duy trì hạn sử dụng tốt nhất (12 tháng).'
          }
        ]
      },
      {
        title: '3. Quy Trình Đăng Ký Đại Lý',
        content: 'Để trở thành đối tác chính thức, quý khách chỉ cần thực hiện 3 bước đơn giản: Liên hệ trực tiếp Hotline/Zalo -> Nhận báo giá & chính sách chiết khấu -> Ký kết hợp đồng thử nghiệm & nhập đơn hàng đầu tiên.'
      }
    ]
  },
  'mua-hang': {
    slug: 'mua-hang',
    title: 'Chính Sách Mua Hàng & Đặt Hàng',
    description: 'Hướng dẫn mua hàng online nhanh chóng, thuận tiện và an toàn trên website của Sợi Mộc.',
    lastUpdated: 'Tháng 5, 2026',
    sections: [
      {
        title: '1. Phương Thức Đặt Hàng',
        content: 'Khách hàng có thể lựa chọn 1 trong các hình thức đặt mua bún/phở ngô sau đây:',
        items: [
          {
            subtitle: 'Đặt hàng trực tiếp qua Website',
            text: 'Lựa chọn sản phẩm mong muốn, thêm vào giỏ hàng và gửi thông tin. Hệ thống sẽ tự động tạo đơn hàng và chuyển tiếp thông tin đơn hàng sang kênh Chat Zalo nhanh chóng.'
          },
          {
            subtitle: 'Đặt hàng qua Hotline/Zalo',
            text: 'Gọi điện thoại hoặc nhắn tin trực tiếp đến số điện thoại chăm sóc khách hàng: 0377159498 để được nhân viên tư vấn trực tiếp và lên đơn thủ công.'
          }
        ]
      },
      {
        title: '2. Quy Trình Xác Nhận Đơn Hàng',
        content: 'Sau khi nhận được thông tin đặt hàng, nhân viên của chúng tôi sẽ gọi điện hoặc nhắn tin Zalo xác nhận lại danh sách sản phẩm, địa chỉ nhận hàng và tổng chi phí (bao gồm phí vận chuyển nếu có) trong vòng 2 tiếng làm việc.'
      },
      {
        title: '3. Thay Đổi Hoặc Hủy Đơn Hàng',
        content: 'Khách hàng có nhu cầu thay đổi chủng loại sản phẩm, số lượng hoặc hủy đơn hàng đã đặt vui lòng liên hệ hotline: 0377159498 trước khi đơn hàng được bàn giao cho đơn vị vận chuyển (thường là trước 14h hàng ngày).'
      }
    ]
  },
  'doi-tra': {
    slug: 'doi-tra',
    title: 'Chính Sách Bảo Hành & Đổi Trả',
    description: 'Quy định đổi trả hàng hóa linh hoạt nhằm bảo vệ quyền lợi mua sắm cao nhất của khách hàng.',
    lastUpdated: 'Tháng 5, 2026',
    sections: [
      {
        title: '1. Trường Hợp Được Đổi Trả Hàng',
        content: 'Sợi Mộc sẵn sàng hỗ trợ đổi mới sản phẩm miễn phí cho khách hàng trong các trường hợp sau:',
        items: [
          {
            subtitle: 'Lỗi từ nhà sản xuất',
            text: 'Sản phẩm có dấu hiệu ẩm mốc trước hạn sử dụng, bao bì bị hở mép hàn từ nhà máy, sợi phở/bún bị vỡ vụn nghiêm trọng do đóng gói.'
          },
          {
            subtitle: 'Lỗi trong quá trình vận chuyển',
            text: 'Bao bì sản phẩm bị rách, nát, biến dạng do bên vận chuyển va đập mạnh làm ảnh hưởng đến chất lượng sản phẩm bên trong.'
          },
          {
            subtitle: 'Giao sai sản phẩm',
            text: 'Giao không đúng chủng loại (nhầm phở ngô thành bún ngô hoặc ngược lại), sai trọng lượng đóng gói so với đơn hàng đã xác nhận.'
          }
        ]
      },
      {
        title: '2. Điều Kiện Đổi Trả',
        content: 'Sản phẩm đổi trả phải đáp ứng các yêu cầu cơ bản: Thời gian phản hồi trong vòng 7 ngày kể từ khi nhận hàng. Khách hàng vui lòng chụp ảnh hoặc quay video ngắn tình trạng bao bì/sản phẩm lỗi khi khui hàng và gửi qua Zalo 0377159498 để được xử lý ngay lập tức.'
      },
      {
        title: '3. Chi Phí Đổi Trả',
        content: 'Sợi Mộc chịu 100% chi phí vận chuyển phát sinh khi đổi trả hàng lỗi do lỗi của chúng tôi hoặc đơn vị vận chuyển. Khách hàng không phải trả thêm bất cứ khoản phí nào.'
      }
    ]
  },
  'bao-mat': {
    slug: 'bao-mat',
    title: 'Chính Sách Bảo Mật Thông Tin',
    description: 'Cam kết bảo vệ tuyệt đối thông tin cá nhân và dữ liệu mua hàng của quý khách.',
    lastUpdated: 'Tháng 5, 2026',
    sections: [
      {
        title: '1. Thu Thập Thông Tin Cá Nhân',
        content: 'Khi quý khách đặt mua hàng trên website, chúng tôi chỉ thu thập các thông tin cơ bản phục vụ cho việc xử lý và giao nhận đơn hàng bao gồm: Họ tên, số điện thoại, địa chỉ nhận hàng và ghi chú (nếu có).'
      },
      {
        title: '2. Mục Đích Sử Dụng Thông Tin',
        content: 'Thông tin cá nhân thu thập được chỉ được sử dụng trong nội bộ Sợi Mộc cho các mục đích: Xác nhận và thực hiện giao đơn hàng; Giải quyết các vấn đề phát sinh khi khiếu nại, đổi trả; Gửi thông báo ưu đãi hoặc tri ân khách hàng thân thiết (nếu khách hàng đồng ý nhận).'
      },
      {
        title: '3. Cam Kết Bảo Mật',
        content: 'Chúng tôi cam kết không bán, chia sẻ hay trao đổi thông tin cá nhân của khách hàng cho bất kỳ bên thứ ba nào khác ngoài đơn vị vận chuyển (Giao Hàng Tiết Kiệm, Viettel Post, v.v.) để phục vụ việc giao nhận đơn hàng. Mọi thông tin đều được mã hóa lưu trữ an toàn.'
      }
    ]
  },
  'thanh-toan': {
    slug: 'thanh-toan',
    title: 'Chính Sách Phương Thức Thanh Toán',
    description: 'Các hình thức thanh toán linh hoạt, tiện lợi và an toàn khi mua hàng tại Sợi Mộc.',
    lastUpdated: 'Tháng 5, 2026',
    sections: [
      {
        title: '1. Thanh Toán Khi Nhận Hàng (COD)',
        content: 'Đây là phương thức thanh toán an tâm nhất. Quý khách được quyền mở thùng kiểm tra số lượng và tình trạng sản phẩm bên ngoài trước khi thanh toán tiền mặt trực tiếp cho nhân viên giao hàng.'
      },
      {
        title: '2. Chuyển Khoản Ngân Hàng (Mã QR Swift)',
        content: 'Khách hàng có thể thanh toán trước bằng cách chuyển khoản qua ngân hàng. Hệ thống của chúng tôi sẽ cung cấp thông tin tài khoản và mã QR để quý khách quét thanh toán nhanh chóng. Nội dung chuyển khoản vui lòng ghi rõ [Họ tên + Số điện thoại mua hàng].'
      },
      {
        title: '3. Xác Nhận Thanh Toán Chuyển Khoản',
        content: 'Ngay sau khi nhận được tiền chuyển khoản thành công, chúng tôi sẽ nhắn tin xác nhận và tiến hành đóng gói, gửi hàng sớm nhất.'
      }
    ]
  },
  'van-chuyen': {
    slug: 'van-chuyen',
    title: 'Chính Sách Vận Chuyển & Giao Nhận',
    description: 'Thời gian giao nhận, chi phí vận chuyển và quy trình đồng kiểm hàng hóa toàn quốc.',
    lastUpdated: 'Tháng 5, 2026',
    sections: [
      {
        title: '1. Phạm Vi Vận Chuyển',
        content: 'Sợi Mộc hợp tác cùng các đơn vị vận chuyển lớn (Giao Hàng Tiết Kiệm, Viettel Post, VNPost) cung cấp dịch vụ giao hàng tận nơi trên toàn quốc, bao gồm cả vùng sâu vùng xa và hải đảo.'
      },
      {
        title: '2. Chi Phí Vận Chuyển',
        content: 'Phí vận chuyển được tính dựa trên trọng lượng đơn hàng và khu vực địa lý của khách hàng:',
        items: [
          {
            subtitle: 'Nội thành Hà Nội',
            text: 'Đồng giá 20.000đ. Miễn phí vận chuyển cho đơn hàng từ 3kg trở lên.'
          },
          {
            subtitle: 'Các tỉnh thành khác',
            text: 'Đồng giá từ 30.000đ - 35.000đ tùy khoảng cách. Miễn phí vận chuyển cho toàn bộ đơn hàng từ 5kg trở lên.'
          }
        ]
      },
      {
        title: '3. Thời Gian Giao Nhận',
        content: 'Thời gian giao hàng tính từ lúc xác nhận đơn hàng thành công:',
        items: [
          {
            subtitle: 'Khu vực Hà Nội',
            text: 'Giao hàng nhanh trong vòng 12 - 24 giờ.'
          },
          {
            subtitle: 'Miền Trung & Miền Nam',
            text: 'Giao hàng trong vòng 2 - 4 ngày làm việc.'
          }
        ]
      },
      {
        title: '4. Quy Định Đồng Kiểm',
        content: 'Khi nhận hàng, khách hàng có quyền mở gói hàng ra kiểm tra số lượng bọc bún/phở ngô khô xem có đúng số lượng đặt hay bao bì có bị rách hỏng gì không trước khi ký nhận với shipper.'
      }
    ]
  },
  'thanh-vien': {
    slug: 'thanh-vien',
    title: 'Chính Sách Thành Viên & Đặc Quyền VIP',
    description: 'Quy chế thăng hạng, ưu đãi chiết khấu trực tiếp và hành trình tri ân thành viên thân thiết tại Sợi Mộc.',
    lastUpdated: 'Tháng 6, 2026',
    sections: [
      {
        title: '1. Quy Chế Thăng Cấp Bậc VIP',
        content: 'Hệ thống thành viên Sợi Mộc Club tự động tính điểm tích lũy dựa trên tổng giá trị các đơn hàng giao thành công (ở trạng thái Đã hoàn thành) của tài khoản:',
        items: [
          {
            subtitle: 'Hạng Bạc (Silver)',
            text: 'Tự động nâng hạng khi tổng chi tiêu tích lũy đạt từ 500.000đ trở lên.'
          },
          {
            subtitle: 'Hạng Vàng (Gold)',
            text: 'Tự động nâng hạng khi tổng chi tiêu tích lũy đạt từ 2.000.000đ trở lên.'
          },
          {
            subtitle: 'Hạng Kim Cương (Diamond)',
            text: 'Tự động nâng hạng khi tổng chi tiêu tích lũy đạt từ 5.000.000đ trở lên.'
          }
        ]
      },
      {
        title: '2. Đặc Quyền Chiết Khấu Trực Tiếp',
        content: 'Thành viên VIP sẽ được hưởng mức giảm giá trực tiếp vào đơn hàng tại giỏ hàng mà không cần nhập mã giảm giá:',
        items: [
          {
            subtitle: 'Hạng Bạc (Silver)',
            text: 'Giảm trực tiếp 5% giá trị toàn bộ sản phẩm bún, phở ngô khi mua sắm.'
          },
          {
            subtitle: 'Hạng Vàng (Gold)',
            text: 'Giảm trực tiếp 10% giá trị toàn bộ sản phẩm bún, phở ngô khi mua sắm.'
          },
          {
            subtitle: 'Hạng Kim Cương (Diamond)',
            text: 'Giảm trực tiếp 15% giá trị toàn bộ sản phẩm bún, phở ngô khi mua sắm.'
          }
        ]
      },
      {
        title: '3. Hành Trình Quà Tặng Tri Ân',
        content: 'Tính từ thời điểm đăng ký tài khoản, khách hàng sẽ nhận được các voucher và phần quà tri ân đặc biệt tại các mốc thời gian đồng hành:',
        items: [
          {
            subtitle: 'Mốc 1 Tháng (30 ngày)',
            text: 'Nhận ngay Voucher giảm giá 20.000đ trực tiếp vào đơn hàng kế tiếp.'
          },
          {
            subtitle: 'Mốc 6 Tháng (180 ngày)',
            text: 'Nhận ngay Voucher giảm giá 50.000đ trực tiếp vào đơn hàng kế tiếp.'
          },
          {
            subtitle: 'Mốc 1 Năm (365 ngày)',
            text: 'Nhận Hộp quà tri ân đặc biệt được thiết kế theo cấp bậc VIP của chủ tài khoản: Standard Edition (Voucher 100k), Silver Edition (Hộp quà + Voucher 100k), Gold Edition (Hộp quà đặc biệt + Voucher 200k), Diamond Edition (Hộp quà cao cấp + Voucher 300k).'
          }
        ]
      },
      {
        title: '4. Điều Khoản Áp Dụng',
        content: 'Hệ thống tự động đồng bộ và hiển thị tiến trình thăng cấp trực tiếp tại trang Hồ Sơ của bạn. Mọi hành vi tạo đơn ảo hoặc gian lận hủy đơn sẽ bị hệ thống tự động loại trừ khỏi doanh số tích lũy.'
      }
    ]
  }
};
