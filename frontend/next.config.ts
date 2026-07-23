import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true, // Nén gzip/brotli phản hồi để tải trang nhanh hơn
  images: {
    formats: ['image/avif', 'image/webp'], // Ưu tiên các định dạng ảnh siêu nhẹ
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wanuvqejxogotqrxmdck.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  compiler: {
    // Tự động xóa console.log ở môi trường production để tối ưu tốc độ chạy
    removeConsole: process.env.NODE_ENV === 'production',
  },
  reactStrictMode: true,
};

export default nextConfig;
