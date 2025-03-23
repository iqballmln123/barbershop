import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../lib/supabase/utils";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await auth.getUser();
        
        if (user) {
          // Jika pengguna sudah login, arahkan ke dashboard
          router.push("/protected/dashboard");
        } else {
          // Jika pengguna belum login, tampilkan halaman landing
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking user:", error);
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  // Fungsi untuk menavigasi ke halaman login
  const handleLoginClick = () => {
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl">Memuat...</p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Culture Barbershop</span>
              <span className="text-xl font-bold">Culture Barbershop</span>
            </a>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <button
              onClick={handleLoginClick}
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Log in <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </nav>
      </header>

      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Selamat Datang di Culture Barbershop
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Contoh aplikasi yang mengintegrasikan Supabase untuk database, autentikasi, penyimpanan, dan fitur real-time.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={handleLoginClick}
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Masuk Sekarang
              </button>
              <a
                href="https://supabase.com/docs"
                target="_blank"
                rel="noreferrer noopener"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Pelajari Lebih Lanjut <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-white">
        <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
          <p className="mt-10 text-center text-xs leading-5 text-gray-500">
            &copy; 2023 Culture Barbershop. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
