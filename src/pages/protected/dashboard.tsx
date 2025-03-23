import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../../lib/supabase/utils";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await auth.getUser();
        
        if (userData) {
          setUser(userData);
        } else {
          // Jika tidak ada user, redirect ke halaman login
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

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const navigateTo = (path: string) => {
    router.push(path);
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
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Selamat datang!</h2>
          <p className="mt-2 text-gray-600">
            Anda berhasil login dengan email: {user?.email}
          </p>
          
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div 
              onClick={() => navigateTo("/protected/upload")}
              className="cursor-pointer rounded-lg border border-gray-200 bg-white p-6 shadow hover:bg-gray-50"
            >
              <h3 className="text-lg font-medium text-gray-900">Storage</h3>
              <p className="mt-2 text-sm text-gray-500">
                Unggah dan kelola file menggunakan Supabase Storage.
              </p>
            </div>
            
            <div 
              onClick={() => navigateTo("/protected/realtime")}
              className="cursor-pointer rounded-lg border border-gray-200 bg-white p-6 shadow hover:bg-gray-50"
            >
              <h3 className="text-lg font-medium text-gray-900">Realtime</h3>
              <p className="mt-2 text-sm text-gray-500">
                Coba fitur realtime Supabase dengan chat sederhana.
              </p>
            </div>
          </div>
          
          <div className="mt-8 rounded-lg bg-gray-50 p-6">
            <h3 className="font-medium">Info Akun:</h3>
            <div className="mt-4 overflow-x-auto">
              <pre className="text-sm">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="font-medium">Fitur Supabase yang Terintegrasi:</h3>
            <ul className="mt-2 list-disc pl-5 text-gray-600">
              <li>
                <strong>Authentication</strong> - Login, pendaftaran, dan manajemen sesi pengguna
              </li>
              <li>
                <strong>Database</strong> - Akses dan manipulasi data di database PostgreSQL
              </li>
              <li>
                <strong>Storage</strong> - Unggah dan kelola file
              </li>
              <li>
                <strong>Realtime</strong> - Subscribe ke perubahan data secara real-time
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 