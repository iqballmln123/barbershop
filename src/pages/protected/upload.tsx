import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { storage, auth } from "../../lib/supabase/utils";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await auth.getUser();
        
        if (userData) {
          setUser(userData);
          // Setelah user terautentikasi, kita bisa memuat file yang telah diunggah
          // Ini hanya contoh, dalam implementasi nyata Anda mungkin perlu menyimpan referensi file di database
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error checking user:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Buat URL preview untuk gambar
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) return;
    
    setUploading(true);
    
    try {
      // Buat nama file yang unik menggunakan timestamp
      const fileName = `${Date.now()}_${file.name}`;
      
      // Upload ke bucket 'images' di Supabase Storage
      const result = await storage.uploadFile('images', fileName, file);
      
      if (result) {
        const publicUrl = storage.getPublicUrl('images', fileName);
        setUploadedFiles((prev) => [...prev, publicUrl]);
        
        // Reset file input
        setFile(null);
        setPreview(null);
        
        // Reset file input element
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Gagal mengunggah file.");
    } finally {
      setUploading(false);
    }
  };

  const handleGoToDashboard = () => {
    router.push("/protected/dashboard");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl">Memuat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-4xl rounded-lg bg-white p-8 shadow">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Upload Gambar</h1>
          <button
            onClick={handleGoToDashboard}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Kembali ke Dashboard
          </button>
        </div>
        
        <div className="mt-8">
          <form onSubmit={handleUpload} className="space-y-6">
            <div>
              <label
                htmlFor="file-upload"
                className="block text-sm font-medium text-gray-700"
              >
                Pilih Gambar
              </label>
              <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                <div className="space-y-1 text-center">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="mx-auto h-64 w-auto object-contain"
                    />
                  ) : (
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  <div className="flex justify-center text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>Unggah file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">atau seret dan letakkan</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF hingga 10MB
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={!file || uploading}
                className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:bg-indigo-300"
              >
                {uploading ? "Mengunggah..." : "Unggah Gambar"}
              </button>
            </div>
          </form>
          
          {uploadedFiles.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-medium">Gambar yang Diunggah</h2>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {uploadedFiles.map((url, index) => (
                  <div key={index} className="overflow-hidden rounded-lg">
                    <img
                      src={url}
                      alt={`Uploaded ${index + 1}`}
                      className="h-40 w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-8 rounded-lg bg-yellow-50 p-4">
            <h3 className="font-medium text-yellow-800">Catatan Penting</h3>
            <p className="mt-2 text-sm text-yellow-700">
              Pada implementasi nyata, pastikan untuk mengonfigurasi kebijakan
              bucket Supabase dengan benar untuk membatasi akses. Juga, sebaiknya
              gunakan direktori user khusus (misalnya /user_12345/images/) 
              untuk mengorganisir file berdasarkan pemiliknya.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 