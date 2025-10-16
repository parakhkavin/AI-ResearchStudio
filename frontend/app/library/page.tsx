"use client";
import React, { useEffect, useMemo, useState } from "react";
import AnimatedCard from "@/components/AnimatedCard";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

type Paper = {
  id: number;
  title: string;
  year?: number;
  authors?: string;
  source?: string;
  created_at?: string;
  tags?: string[];
};

export default function LibraryPage() {
  const [q, setQ] = useState("");
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch from backend API
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE}/api/library`);
        const data = await res.json();
        if (!data.success) throw new Error(data.error || "Failed to load library");
        setPapers(data.data || []);
      } catch (e: any) {
        setError(e.message || "Failed to load library");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!q.trim()) return papers;
    const s = q.toLowerCase();
    return papers.filter(
      (p) =>
        (p.title && p.title.toLowerCase().includes(s)) ||
        (p.source && p.source.toLowerCase().includes(s))
    );
  }, [q, papers]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search papers"
          className="w-full rounded-xl border border-slate-300 bg-white/70 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading && <div className="subtle">Loading...</div>}
      {error && <div className="text-red-600 text-sm">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <AnimatedCard key={p.id}>
            <div className="flex flex-col gap-1">
              <div className="text-sm text-slate-500">
                {p.created_at ? new Date(p.created_at).getFullYear() : ""}
              </div>
              <h3 className="font-semibold">{p.title}</h3>
              <div className="subtle">{p.source || ""}</div>
              <div className="mt-3 flex gap-2">
                <a href="#" className="btn-ghost">
                  Open
                </a>
                <a href="/chat" className="btn-primary">
                  Chat
                </a>
              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>
    </div>
  );
}
