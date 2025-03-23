import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { cache } from 'react';

// Fungsi ini akan digunakan pada Server Components dan Route Handlers
// Kita menggunakan cache untuk memastikan hanya satu klien Supabase
// yang dibuat selama siklus hidup request
export const createServerClient = cache(() => {
  // Memeriksa cookies untuk request saat ini
  cookies();
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    }
  );
}); 