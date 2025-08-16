
"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";

let socket: any;

export default function ChatWidget() {
  const [messages, setMessages] = useState<{ user: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // pobranie zalogowanego użytkownika
    fetch("/api/me")
      .then(res => res.json())
      .then(data => {
        if (data?.email) setUsername(data.email);
      });

    fetch("/api/socket"); // inicjalizacja backendu
    socket = io({ path: "/api/socket" });

    socket.on("chatMessage", (msg: { user: string; text: string }) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("chatMessage", input.trim());
      setInput("");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 text-black z-[9999]">
      {open ? (
        <div className="bg-white shadow-lg rounded-lg w-80 h-96 flex flex-col">
          <div className="bg-blue-500 text-white px-3 py-2 flex justify-between items-center rounded-t-lg">
            <span>Czat graczy</span>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {messages.map((msg, i) => (
              <div key={i} className="text-sm">
                <b>{msg.user}: </b> {msg.text}
              </div>
            ))}
          </div>
          <div className="p-2 border-t text-black">
            <div className="flex gap-1">
              <input
                type="text"
                placeholder="Napisz wiadomość..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="border p-1 flex-1"
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-500 text-black p-3 rounded-full shadow-lg"
        >
          💬
        </button>
      )}
    </div>
  );
}