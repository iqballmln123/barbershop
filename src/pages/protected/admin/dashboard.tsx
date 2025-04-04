import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../../../lib/supabase/utils";
import { supabase } from "../../../lib/supabase/client";

type User = {
  id: string;
  email: string;
  name?: string;
  role: string;
  created_at: string;
}

export default function AdminDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Cek apakah pengguna adalah admin
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const userData = await auth.getUser();
        
        if (userData) {
          // Cek apakah user memiliki peran admin
          const profiles = await db.get("profiles", { user_id: userData.id });
          const userProfile = profiles[0];
          
          if (userProfile?.role === "admin") {
            setUser(userData);
            fetchUsers();
          } else {
            // Jika bukan admin, redirect ke dashboard biasa
            router.push("/protected/dashboard");
          }
        } else {
          // Jika tidak ada user, redirect ke halaman login
          router.push("/login");
        }
      } catch (error) {
        console.error("Error checking admin:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  // Ambil daftar semua pengguna
  const fetchUsers = async () => {
    try {
      // Mengambil data profile dari tabel profiles yang berisi info peran
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (profilesError) {
        throw profilesError;
      }
      
      if (profiles) {
        setUsers(profiles);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Gagal mengambil data pengguna");
    }
  };

  // Fungsi untuk mengubah peran pengguna
  const changeUserRole = async (userId: string, newRole: string) => {
    setUserLoading(true);
    
    try {
      // Update peran pengguna di database
      const result = await db.update("profiles", userId, { role: newRole });
      
      if (result) {
        // Refresh daftar pengguna
        await fetchUsers();
        setError(null);
      } else {
        setError("Gagal mengubah peran pengguna");
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      setError("Terjadi kesalahan saat mengubah peran pengguna");
    } finally {
      setUserLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
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
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between rounded-lg bg-white p-6 shadow">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-600">Login sebagai: {user?.email}</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => router.push("/protected/dashboard")}
              className="rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
            >
              Dashboard User
            </button>
            <button
              onClick={handleLogout}
              className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-6 text-xl font-semibold">Manajemen Pengguna</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Peran
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Tanggal Daftar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {user.name || "-"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString("id-ID")}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                        <button
                          onClick={() =>
                            changeUserRole(
                              user.id,
                              user.role === "admin" ? "customer" : "admin"
                            )
                          }
                          disabled={userLoading}
                          className={`rounded px-3 py-1 text-xs ${
                            user.role === "admin"
                              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                              : "bg-purple-100 text-purple-800 hover:bg-purple-200"
                          }`}
                        >
                          {userLoading
                            ? "Memproses..."
                            : user.role === "admin"
                            ? "Ubah ke Customer"
                            : "Ubah ke Admin"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      Tidak ada pengguna yang ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 