"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SectionHeader from "@/components/SectionHeader";
import { Book, Brain, MessageSquare, Library } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

type AnalyticsData = {
  top_keyword?: string;
  newest_paper?: string;
  most_queried?: string;
  library_size?: number;
  topic_chart?: { label: string; value: number }[];
  source_chart?: { label: string; value: number }[];
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/analytics`);
        if (!res.ok) throw new Error(`Failed to fetch analytics (${res.status})`);
        const d = await res.json();
        if (d.success) setData(d.data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch analytics");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const stats = [
    { title: "Top Topic", value: data.top_keyword || "—", hint: "last 30 days", icon: Brain },
    { title: "Newest Paper", value: data.newest_paper || "—", hint: "recency", icon: Book },
    { title: "Most Queried", value: data.most_queried || "—", hint: "chat", icon: MessageSquare },
    { title: "Library Size", value: data.library_size?.toString() || "—", hint: "papers", icon: Library },
  ];

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Analytics"
        subtitle="Visual insights into your research activity"
      />

      {loading && <div className="text-slate-500 text-sm">Loading analytics...</div>}
      {error && <div className="text-red-600 text-sm">{error}</div>}

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ title, value, hint, icon: Icon }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.03 }}
            className="rounded-2xl p-5 shadow-md bg-gradient-to-br from-blue-50 via-violet-50 to-cyan-50 border border-slate-200"
          >
            <div className="flex items-center gap-3 mb-2 text-slate-600">
              <Icon size={22} />
              <h3 className="font-semibold text-slate-700">{title}</h3>
            </div>
            <div className="text-3xl font-bold text-slate-900">{value}</div>
            <p className="text-xs text-slate-500 mt-1">{hint}</p>
          </motion.div>
        ))}
      </div>

      {/* Divider */}
      <hr className="my-6 border-slate-200" />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topic chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 bg-white/80 rounded-2xl shadow-md border border-slate-200"
        >
          <h3 className="text-lg font-semibold mb-4 text-slate-800">Top Topics</h3>
          {data.topic_chart && data.topic_chart.length > 0 ? (
            <div className="space-y-3">
              {data.topic_chart.map((t, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm text-slate-600 mb-1">
                    <span>{t.label}</span>
                    <span>{t.value}</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(t.value, 100)}%` }}
                      className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-slate-500 text-sm">No topic data yet</div>
          )}
        </motion.div>

        {/* Source chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 bg-white/80 rounded-2xl shadow-md border border-slate-200"
        >
          <h3 className="text-lg font-semibold mb-4 text-slate-800">Top Sources</h3>
          {data.source_chart && data.source_chart.length > 0 ? (
            <div className="space-y-3">
              {data.source_chart.map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm text-slate-600 mb-1">
                    <span>{s.label}</span>
                    <span>{s.value}</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(s.value, 100)}%` }}
                      className="h-2 bg-gradient-to-r from-violet-500 to-pink-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-slate-500 text-sm">No source data yet</div>
          )}
        </motion.div>
      </div>
    </div>
  );
}