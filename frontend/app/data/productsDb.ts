import prisma from '@/src/lib/prisma';
import { products as staticProducts, Product } from '@/app/data/products';

export async function getDbProducts(): Promise<Product[]> {
  try {
    let dbProducts = await prisma.product.findMany({
      orderBy: { createdAt: 'asc' }
    });

    if (dbProducts.length === 0) {
      console.log('Seeding initial products into database...');
      // Seed initial products from the static products.ts array
      await Promise.all(
        staticProducts.map(async (p) => {
          return prisma.product.create({
            data: {
              id: p.id,
              name: p.name,
              tagline: p.tagline,
              description: p.description,
              details: p.details,
              image: p.image,
              imagesJson: JSON.stringify(p.images || [p.image]),
              featuresJson: JSON.stringify(p.features || []),
              cookingTime: p.cookingTime,
              calories: p.nutrition?.calories || '',
              carbs: p.nutrition?.carbs || '',
              protein: p.nutrition?.protein || '',
              fiber: p.nutrition?.fiber || '',
              fat: p.nutrition?.fat || '',
              sizesJson: JSON.stringify(p.sizes || []),
              category: p.category,
              badge: p.badge || null,
              isActive: true
            }
          });
        })
      );
      
      // Fetch again after seeding
      dbProducts = await prisma.product.findMany({
        orderBy: { createdAt: 'asc' }
      });
    }

    // Filter to active products for customers
    return dbProducts
      .filter((p) => p.isActive)
      .map((p) => ({
        id: p.id,
        name: p.name,
        tagline: p.tagline,
        description: p.description,
        details: p.details,
        image: p.image,
        images: JSON.parse(p.imagesJson),
        features: JSON.parse(p.featuresJson),
        cookingTime: p.cookingTime,
        nutrition: {
          calories: p.calories,
          carbs: p.carbs,
          protein: p.protein,
          fiber: p.fiber,
          fat: p.fat
        },
        sizes: JSON.parse(p.sizesJson),
        category: p.category as 'corn' | 'specialty',
        badge: p.badge || undefined
      }));
  } catch (error) {
    console.error('Error fetching DB products:', error);
    // Fallback to static products if database fails
    return staticProducts;
  }
}

// Function specifically for admin view (returns all products including inactive ones)
export async function getAllDbProductsAdmin() {
  try {
    let dbProducts = await prisma.product.findMany({
      orderBy: { createdAt: 'asc' }
    });

    if (dbProducts.length === 0) {
      // Seed first
      await getDbProducts();
      dbProducts = await prisma.product.findMany({
        orderBy: { createdAt: 'asc' }
      });
    }

    return dbProducts.map((p) => ({
      id: p.id,
      name: p.name,
      tagline: p.tagline,
      description: p.description,
      details: p.details,
      image: p.image,
      images: JSON.parse(p.imagesJson),
      features: JSON.parse(p.featuresJson),
      cookingTime: p.cookingTime,
      nutrition: {
        calories: p.calories,
        carbs: p.carbs,
        protein: p.protein,
        fiber: p.fiber,
        fat: p.fat
      },
      sizes: JSON.parse(p.sizesJson),
      category: p.category,
      badge: p.badge || undefined,
      isActive: p.isActive,
      createdAt: p.createdAt
    }));
  } catch (error) {
    console.error('Error fetching all DB products:', error);
    return [];
  }
}
