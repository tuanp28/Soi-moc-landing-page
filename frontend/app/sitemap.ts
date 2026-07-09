import { MetadataRoute } from 'next';
import { getDbProducts } from '@/app/data/productsDb';
import { policies } from '@/app/data/policies';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Domain chính của website. Có thể cấu hình qua biến môi trường NEXT_PUBLIC_APP_URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://soimoc.vn';

  // 1. Các trang tĩnh công khai
  const staticRoutes = ['', '/products', '/about', '/contact', '/lucky-wheel'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. Danh sách sản phẩm động từ database
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await getDbProducts();
    productRoutes = products.map((product) => ({
      url: `${baseUrl}/products/${product.id}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));
  } catch (error) {
    console.error('Lỗi khi truy vấn sản phẩm cho sitemap:', error);
  }

  // 3. Danh sách trang chính sách
  const policyRoutes = Object.keys(policies).map((slug) => ({
    url: `${baseUrl}/policies/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...productRoutes, ...policyRoutes];
}
