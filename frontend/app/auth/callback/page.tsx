'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/src/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Supabase client automatically handles hash/query parameter parsing for token recovery
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        router.push('/reset-password');
      } else if (event === 'SIGNED_IN' && session) {
        router.push('/profile');
      }
    });

    // Fallback redirect if user is already signed in or nothing happens in 5 seconds
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/profile');
      }
    };
    checkSession();

    const timeout = setTimeout(() => {
      router.push('/profile');
    }, 6000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F4EC] dark:bg-[#111510] transition-colors duration-300">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
        <h3 className="font-serif text-lg font-bold text-brand-green dark:text-brand-green-light uppercase tracking-wider animate-pulse">
          Đang xác thực tài khoản Google
        </h3>
        <p className="text-xs text-brand-muted uppercase tracking-widest font-mono">
          Vui lòng đợi trong giây lát...
        </p>
      </div>
    </div>
  );
}
