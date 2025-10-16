"use client";
import React, { useState } from "react";
import AnimatedCard from "@/components/AnimatedCard";

type Msg = { role: "user" | "assistant"; text: string };

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", text: "Hi, I’m your research assistant. Ask me anything about your papers!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    const q = input.trim();
    if (!q || loading) return;

    // Add user message instantly
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      const reply = data.response || data.answer || "No response from backend.";

      // Append assistant response
      setMessages((m) => [...m, { role: "assistant", text: reply }]);
    } catch (e: any) {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "Error connecting to backend: " + e.message },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-rows-[1fr_auto] h-[70vh] gap-4">
      <AnimatedCard>
        <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-2">
          {messages.map((m, i) => (
            <div
              key={i}
              className={m.role === "user" ? "text-right" : "text-left"}
            >
              <div
                className={`inline-block px-3 py-2 rounded-2xl ${
                  m.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white/70 border border-slate-200"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-left">
              <div className="inline-block px-3 py-2 rounded-2xl bg-white/70 text-slate-500 italic">
                Thinking...
              </div>
            </div>
          )}
        </div>
      </AnimatedCard>

      <div className="flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask about your uploaded papers"
          className="flex-1 rounded-xl border border-slate-300 bg-white/70 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={send}
          disabled={loading}
          className={`btn-primary ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          Send
        </button>
      </div>
    </div>
  );
}
