"use client";

import { useState } from "react";
import axios from "axios";
import { api } from "@/utils/api";

type Citation = { index: number; id: string; snippet: string };
type ChatTurn = { role: "user" | "assistant"; content: string; citations?: Citation[] };

export default function ChatBox() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<ChatTurn[]>([]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userTurn: ChatTurn = { role: "user", content: input };
    setHistory((h) => [...h, userTurn]);
    setInput("");

    try {
      const res = await axios.post(`${api.baseURL}/chat/`, { message: userTurn.content });
      const assistantTurn: ChatTurn = {
        role: "assistant",
        content: res.data?.answer ?? "No response",
        citations: res.data?.citations || []
      };
      setHistory((h) => [...h, assistantTurn]);
    } catch (e: any) {
      setHistory((h) => [...h, { role: "assistant", content: `Error, ${e?.response?.data?.detail || e.message}` }]);
    }
  };

  return (
    <div className="grid gap-4">
      <div className="rounded-2xl border bg-white p-4 h-[520px] overflow-auto">
        {history.length === 0 && (
          <p className="text-slate-500 text-sm">Ask a question about your uploaded papers.</p>
        )}
        <div className="space-y-4">
          {history.map((t, idx) => (
            <div key={idx} className={t.role === "user" ? "text-right" : "text-left"}>
              <div
                className={
                  "inline-block px-3 py-2 rounded-2xl text-sm max-w-[90%] whitespace-pre-wrap " +
                  (t.role === "user" ? "bg-indigo-600 text-white" : "bg-slate-100")
                }
              >
                {t.content}
              </div>
              {t.role === "assistant" && t.citations && t.citations.length > 0 && (
                <div className="mt-2 text-xs text-slate-600 space-y-1">
                  <div className="font-semibold">Citations</div>
                  <ul className="list-disc ml-5">
                    {t.citations.map((c, i) => (
                      <li key={i}>
                        [{c.index}] <span className="font-mono">{c.id}</span>  
                        <span className="block italic text-slate-500">{c.snippet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 rounded-xl border px-3 py-2"
          placeholder="Type your question"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" ? sendMessage() : undefined}
        />
        <button onClick={sendMessage} className="px-4 py-2 rounded-xl bg-indigo-600 text-white">
          Send
        </button>
      </div>
    </div>
  );
}
