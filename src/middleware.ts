import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Fungsi ini akan dipanggil pada setiap request yang masuk
export async function middleware(req: NextRequest) {
  // Dapatkan response yang dapat dimodifikasi
  const res = NextResponse.next();

  // Dapatkan cookies dari request
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  // Membuat klien supabase
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        // Forward cookies dari request
        cookie: req.headers.get('cookie') || '',
      },
    },
  });
  
  try {
    // Mendapatkan sesi pengguna saat ini
    const { data: { session } } = await supabase.auth.getSession();
    
    // Jika pengguna tidak diautentikasi dan mencoba mengakses halaman yang dilindungi,
    // redirect ke halaman login
    if (!session && req.nextUrl.pathname.startsWith('/protected')) {
      const redirectUrl = new URL('/login', req.url);
      return NextResponse.redirect(redirectUrl);
    }
  } catch (error) {
    console.error('Middleware error:', error);
    
    // Jika terjadi error, asumsikan pengguna tidak memiliki sesi yang valid
    if (req.nextUrl.pathname.startsWith('/protected')) {
      const redirectUrl = new URL('/login', req.url);
      return NextResponse.redirect(redirectUrl);
    }
  }
  
  return res;
}

// Konfigurasi path mana yang akan diproses oleh middleware
export const config = {
  matcher: [
    // Proses rute untuk autentikasi dan halaman yang dilindungi
    '/login',
    '/protected/:path*',
  ],
}; 