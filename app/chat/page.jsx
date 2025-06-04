"use client";
import { useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: "system", content: "Hola, soy el asistente virtual de awaq." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();

      if (data.error) {
        setMessages([...newMessages, { role: "assistant", content: `⚠️ Error: ${data.error}` }]);
      } else {
        const reply = data.choices?.[0]?.message?.content || "⚠️ No hubo respuesta del modelo.";
        setMessages([...newMessages, { role: "assistant", content: reply }]);
      }
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "⚠️ Error al conectar con el servidor." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] flex items-center justify-center px-4">
      <div className="bg-[#2e2e2e] text-white p-6 rounded-2xl shadow-lg w-full max-w-xl">
        <h1 className="text-2xl font-bold text-center mb-4">Awaq Bot 🐢</h1>

        <div className="bg-[#1a1a1a] h-96 overflow-y-scroll p-4 rounded-lg mb-4 border border-gray-700">
          {messages.map((msg, i) => (
            <p key={i} className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
              <span className="font-semibold">
                {msg.role === "user" ? "Tú" : "Bot"}:
              </span>{" "}
              {msg.content}
            </p>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Escribe algo..."
            className="flex-grow p-2 rounded-md bg-[#3a3a3a] border border-gray-600 text-white placeholder-gray-400"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            {loading ? "..." : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
}
