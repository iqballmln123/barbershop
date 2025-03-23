import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth, realtime, db } from "../../lib/supabase/utils";

// Type untuk pesan chat
interface ChatMessage {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  user_email?: string;
}

export default function RealtimePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Effect untuk memeriksa apakah pengguna sudah login
  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await auth.getUser();
        
        if (userData) {
          setUser(userData);
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

  // Effect untuk memuat pesan dan berlangganan ke perubahan realtime
  useEffect(() => {
    if (!user) return;

    // Muat pesan awal
    const loadMessages = async () => {
      try {
        const messagesData = await db.get<ChatMessage>("messages");
        // Urutkan pesan berdasarkan waktu
        const sortedMessages = messagesData.sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        setMessages(sortedMessages);
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };

    loadMessages();

    // Berlangganan ke perubahan di tabel messages
    const subscription = realtime.subscribe("messages", (payload) => {
      console.log("Real-time update:", payload);
      
      if (payload.eventType === "INSERT") {
        setMessages((prev) => [...prev, payload.new as ChatMessage]);
      } else if (payload.eventType === "UPDATE") {
        setMessages((prev) =>
          prev.map((message) =>
            message.id === payload.new.id ? (payload.new as ChatMessage) : message
          )
        );
      } else if (payload.eventType === "DELETE") {
        setMessages((prev) =>
          prev.filter((message) => message.id !== payload.old.id)
        );
      }
    });

    // Membersihkan subscription saat komponen di-unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  // Kirim pesan baru
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !user) return;
    
    try {
      await db.insert<ChatMessage>("messages", {
        user_id: user.id,
        content: newMessage,
        user_email: user.email,
      });
      
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Gagal mengirim pesan");
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
          <h1 className="text-2xl font-bold">Chat Realtime</h1>
          <button
            onClick={handleGoToDashboard}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Kembali ke Dashboard
          </button>
        </div>
        
        <div className="mt-8">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="h-96 overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-center text-gray-500">Belum ada pesan</p>
              ) : (
                <ul className="space-y-4">
                  {messages.map((message) => (
                    <li
                      key={message.id}
                      className={`flex ${
                        message.user_id === user?.id ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs rounded-lg px-4 py-2 ${
                          message.user_id === user?.id
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        <div className="text-xs font-medium">
                          {message.user_email || "Pengguna"}
                        </div>
                        <div className="mt-1">{message.content}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
          <form onSubmit={handleSendMessage} className="mt-4">
            <div className="flex">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ketik pesan..."
                className="block w-full rounded-l-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <button
                type="submit"
                className="rounded-r-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
              >
                Kirim
              </button>
            </div>
          </form>
          
          <div className="mt-8 rounded-lg bg-yellow-50 p-4">
            <h3 className="font-medium text-yellow-800">Catatan Penggunaan</h3>
            <p className="mt-2 text-sm text-yellow-700">
              Untuk menggunakan fitur realtime Supabase, Anda perlu:
            </p>
            <ul className="mt-2 list-disc pl-5 text-sm text-yellow-700">
              <li>Membuat tabel 'messages' di database Supabase</li>
              <li>Mengaktifkan Realtime di proyek Supabase melalui dashboard</li>
              <li>
                Mengonfigurasi kebijakan Row Level Security (RLS) yang sesuai untuk kebutuhan Anda
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 