import type { Metadata } from 'next';
import { Playfair_Display, Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingContact } from './components/FloatingContact';
import { Analytics } from '@vercel/analytics/next';

const playfair = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-playfair',
  weight: ['400', '700', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const beVietnam = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-vietnam',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sợi Mộc - Phở Ngô Khô & Bún Ngô Khô Đặc Sản Cao Bằng',
  description: 'Trải nghiệm dòng sản phẩm bún ngô, phở ngô khô sấy lạnh 36h thượng hạng. Nguồn carbohydrate sạch lành, tự nhiên, gluten-free cho lối sống khỏe và tập luyện thể thao đỉnh cao.',
  keywords: 'phở ngô, bún ngô, bún ngô khô, phở ngô khô, đặc sản cao bằng, sợi mộc, bún ngô cao bằng, ăn sạch eat clean, bún giảm cân',
  openGraph: {
    title: 'Sợi Mộc - Phở Ngô Khô & Bún Ngô Khô Đặc Sản Cao Bằng',
    description: 'Sản phẩm bún phở ngô khô sấy lạnh cao cấp phong cách năng động hiện đại.',
    images: ['/images/Hero.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${playfair.variable} ${beVietnam.variable}`}>
      <body className="bg-[#F9F4EC] text-[#1A1A1A] font-sans min-h-screen flex flex-col antialiased selection:bg-[#2D5A27] selection:text-white">
        <Navbar />
        <main className="flex-grow pt-20">
          {children}
        </main>
        <FloatingContact />
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
