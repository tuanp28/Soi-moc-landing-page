import { createClient } from '@supabase/supabase-js';

// Helper function to safely retrieve environment variables across Vite, Next.js, and Node environments
const getEnvVar = (name) => {
  // 1. Browser/Client-side environment
  if (typeof window !== 'undefined') {
    // Check Vite import.meta.env
    try {
      if (typeof import.meta !== 'undefined' && import.meta.env) {
        if (import.meta.env[name]) return import.meta.env[name];
        // Fallback translation between Next.js/Vite prefixes
        if (name.startsWith('VITE_')) {
          const nextName = name.replace('VITE_', 'NEXT_PUBLIC_');
          if (import.meta.env[nextName]) return import.meta.env[nextName];
        }
        if (name.startsWith('NEXT_PUBLIC_')) {
          const viteName = name.replace('NEXT_PUBLIC_', 'VITE_');
          if (import.meta.env[viteName]) return import.meta.env[viteName];
        }
      }
    } catch (e) {
      // import.meta.env might throw in some bundlers if not configured
    }

    // Check window.process.env if injected
    if (window.process?.env?.[name]) return window.process.env[name];
  }

  // 2. Node.js / Server-side environment
  if (typeof process !== 'undefined' && process.env) {
    if (process.env[name]) return process.env[name];
    if (name.startsWith('VITE_')) {
      const nextName = name.replace('VITE_', 'NEXT_PUBLIC_');
      if (process.env[nextName]) return process.env[nextName];
    }
    if (name.startsWith('NEXT_PUBLIC_')) {
      const viteName = name.replace('NEXT_PUBLIC_', 'VITE_');
      if (process.env[viteName]) return process.env[viteName];
    }
  }

  return '';
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL') || getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY') || getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');

// Verify environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Supabase Connection Warning:\n' +
    'Missing environment variables. Please check your .env or .env.local file.\n' +
    'Required variables:\n' +
    '  - VITE_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL\n' +
    '  - VITE_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY'
  );
} else {
  console.log('✅ Supabase environment variables detected successfully.');
}

// Create and export the Supabase Client
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', // fallback to avoid crashing on init
  supabaseAnonKey || 'placeholder'
);

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
