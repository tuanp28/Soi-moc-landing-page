import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wanuvqejxogotqrxmdck.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_bYvknsun39Hg3d4xYQKSVA_7-IiLCCb';

// Create and export the Supabase Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Example function to query the 'products' table
 * @returns {Promise<any[]>} list of products
 */
export async function getProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      console.error('❌ Error fetching products from Supabase:', error.message);
      throw error;
    }

    console.log('📦 Products fetched from Supabase successfully:', data);
    return data;
  } catch (err) {
    console.error('❌ Failed to query products table:', err);
    return [];
  }
}
