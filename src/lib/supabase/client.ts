import { createClient } from '@supabase/supabase-js';

// Ini adalah konfigurasi untuk sisi klien (browser)
// Nilai-nilai ini harus didapatkan dari dashboard Supabase setelah membuat proyek
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Aktifkan persistensi sesi
    autoRefreshToken: true, // Otomatis refresh token
    storageKey: 'supabase.auth.token', // Kunci untuk menyimpan token di localStorage
  },
}); 