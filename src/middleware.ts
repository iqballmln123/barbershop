import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Fungsi ini akan dipanggil pada setiap request yang masuk
export async function middleware(req: NextRequest) {
  // Dapatkan response yang dapat dimodifikasi
  const res = NextResponse.next();

  // Membuat klien supabase untuk server-side
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => {
          res.cookies.set({ name, value, ...options });
        },
        remove: (name, options) => {
          res.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );
  
  try {
    // Mendapatkan sesi pengguna saat ini
    const { data: { session } } = await supabase.auth.getSession();
    
    // Jika pengguna tidak diautentikasi dan mencoba mengakses halaman yang dilindungi,
    // redirect ke halaman login
    if (!session && req.nextUrl.pathname.startsWith('/protected')) {
      const redirectUrl = new URL('/login', req.url);
      return NextResponse.redirect(redirectUrl);
    }

    // Jika ada sesi, cek role untuk halaman admin
    if (session && req.nextUrl.pathname.startsWith('/protected/admin')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();
      
      // Jika bukan admin, redirect ke dashboard biasa
      if (!profile || profile.role !== 'admin') {
        const redirectUrl = new URL('/protected/dashboard', req.url);
        return NextResponse.redirect(redirectUrl);
      }
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