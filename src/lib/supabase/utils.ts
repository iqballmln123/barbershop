import { supabase } from './client';

// Fungsi untuk database
export const db = {
  // Contoh fungsi untuk mengambil data
  async get<T>(table: string, query?: any): Promise<T[]> {
    let req = supabase.from(table).select('*');
    
    if (query) {
      req = req.match(query);
    }
    
    const { data, error } = await req;
    
    if (error) {
      console.error('Error fetching data:', error);
      return [];
    }
    
    return data as T[];
  },
  
  // Contoh fungsi untuk menyimpan data
  async insert<T>(table: string, data: Partial<T>) {
    const { data: result, error } = await supabase.from(table).insert(data).select();
    
    if (error) {
      console.error('Error inserting data:', error);
      return null;
    }
    
    return result;
  },
  
  // Contoh fungsi untuk mengupdate data
  async update<T>(table: string, id: string | number, data: Partial<T>) {
    const { data: result, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Error updating data:', error);
      return null;
    }
    
    return result;
  },
  
  // Contoh fungsi untuk menghapus data
  async delete(table: string, id: string | number) {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting data:', error);
      return false;
    }
    
    return true;
  },
};

// Fungsi untuk autentikasi
export const auth = {
  // Mendaftar dengan email dan password
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      console.error('Error signing up:', error);
      return null;
    }
    
    return data;
  },
  
  // Login dengan email dan password
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Error signing in:', error);
      return null;
    }
    
    return data;
  },
  
  // Logout
  async signOut() {
    try {
      // Hapus sesi dari Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        return false;
      }
      
      // Hapus juga item localStorage jika ada
      if (typeof window !== 'undefined') {
        localStorage.removeItem('supabase.auth.token');
      }
      
      return true;
    } catch (error) {
      console.error('Unexpected error in signOut:', error);
      return false;
    }
  },
  
  // Mendapatkan user yang sedang login
  async getUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        if (error.name === 'AuthSessionMissingError') {
          console.log('Tidak ada sesi pengguna yang aktif');
          return null;
        }
        console.error('Error getting user:', error);
        return null;
      }
      
      return data.user;
    } catch (error) {
      console.error('Unexpected error in getUser:', error);
      return null;
    }
  },
  
  // Mendapatkan sesi saat ini
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        return null;
      }
      
      return data.session;
    } catch (error) {
      console.error('Unexpected error in getSession:', error);
      return null;
    }
  }
};

// Fungsi untuk storage
export const storage = {
  // Upload file
  async uploadFile(bucket: string, path: string, file: File) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);
    
    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }
    
    return data;
  },
  
  // Mendapatkan URL publik dari file
  getPublicUrl(bucket: string, path: string) {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  },
  
  // Menghapus file
  async deleteFile(bucket: string, path: string) {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    
    if (error) {
      console.error('Error deleting file:', error);
      return false;
    }
    
    return true;
  },
};

// Fungsi untuk realtime
export const realtime = {
  // Subscribe ke perubahan tabel
  subscribe(table: string, callback: (payload: any) => void) {
    return supabase
      .channel(`public:${table}`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
      .subscribe();
  },
}; 