
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import io from "socket.io-client";

let socket: any;

export default function ChatWidget() {
  const [messages, setMessages] = useState<{ user: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isAuth = Boolean(username);

  useEffect(() => {
    let active = true;

    
    (async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (!active) return;
        const u = data?.user;
        if (u) {
          const identity = String(u.username || u.name || u.email || '').trim();
          if (identity) {
            setUsername(identity);
            return;
          }
        }
      } catch {}
      try {
        const res2 = await fetch('/api/me');
        const data2 = await res2.json();
        if (!active) return;
        if (data2?.email) {
          setUsername(String(data2.email).trim());
        } else {
          setUsername(null);
        }
      } catch {
        setUsername(null);
      }
    })();

    return () => {
      active = false;
    };
  }, [pathname]);

  useEffect(() => {
    if (!isAuth) return; // tylko zalogowani inicjują socket

    fetch("/api/socket"); // inicjalizacja backendu
    socket = io({ path: "/api/socket" });

    const onMsg = (msg: { user: string; text: string }) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("chatMessage", onMsg);

    return () => {
      try {
        socket.off("chatMessage", onMsg);
        socket.disconnect();
      } catch {}
    };
  }, [isAuth]);

  const sendMessage = () => {
    if (!isAuth) return; // zabezpieczenie
    if (input.trim()) {
      socket.emit("chatMessage", input.trim());
      setInput("");
    }
  };

  // Ukryj cały widget (w tym przycisk) jeśli nie zalogowany
  if (!isAuth) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {open ? (
        <div className="w-80 md:w-96 h-[28rem] bg-gradient-to-br from-gray-900 via-gray-950 to-black border border-purple-700/50 rounded-2xl shadow-2xl shadow-purple-900/30 backdrop-blur-sm flex flex-col overflow-hidden">
          <div className="relative px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 border-b border-purple-500/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wide text-white">Czat graczy</span>
              <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
            </div>
            <div className="flex items-center gap-3 text-xs text-white/80">
              {username && <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/20">{username}</span>}
              <button onClick={() => setOpen(false)} className="rounded-full hover:bg-white/10 p-1 transition">
                ✖
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map((msg, i) => {
              const own = Boolean(username) && (String(msg.user).trim().toLowerCase() === String(username).trim().toLowerCase());
              return (
                <div key={i} className={`flex ${own ? 'justify-end' : 'justify-start'}`}>
                  <div className={`${own ? 'bg-purple-600/80 text-white border-purple-400/40' : 'bg-gray-800 text-gray-100 border-gray-700'} max-w-[75%] rounded-xl px-3 py-2 border shadow-lg`}>
                    <div className="text-[10px] opacity-80 mb-0.5">{own ? 'Ty' : msg.user}</div>
                    <div className="text-sm break-words">{msg.text}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 border-t border-purple-700/40 bg-black/40">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Napisz wiadomość..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-gray-900 text-white px-3 py-2 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-500"
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-lg hover:from-purple-500 hover:to-indigo-500 active:scale-95 transition"
              >
                Wyślij
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="relative group rounded-full p-4 bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.6)] hover:shadow-[0_0_28px_rgba(99,102,241,0.8)] transition transform hover:-translate-y-0.5"
          aria-label="Otwórz czat"
        >
          💬
          <span className="absolute inset-0 rounded-full ring-2 ring-purple-500/40 group-hover:ring-purple-400/60 transition" />
        </button>
      )}
    </div>
  );
}