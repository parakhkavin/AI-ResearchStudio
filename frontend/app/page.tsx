"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import SectionHeader from "@/components/SectionHeader";
import StatCard from "@/components/StatCard";
import AnimatedCard from "@/components/AnimatedCard";
import React, { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

type WorkspaceStats = {
  papers?: number;
  embeddings?: number;
  chats?: number;
  last_import?: string;
};

export default function Page() {
  const [stats, setStats] = useState<WorkspaceStats>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/analytics`);
        const data = await res.json();

        // Flexible structure handling
        if (data.success && data.data) {
          setStats({
            papers: data.data.library_size || 0,
            embeddings: data.data.embeddings_count || 0,
            chats: data.data.chat_count || 0,
            last_import: data.data.last_import || "—",
          });
        }
      } catch (e) {
        console.error("Failed to fetch stats:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="rounded-3xl p-8 md:p-12 bg-gradient-to-r from-cyan-50 via-blue-50 to-violet-50 ring-1 ring-black/5">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              Your AI Research Workspace
            </h1>
          </motion.div>
          <p className="mt-3 text-slate-600">
            Upload PDFs, organize your library, chat with papers, and monitor insights in one cohesive interface.
          </p>
          <div className="mt-6 flex gap-3">
            <Link href="/upload" className="btn-primary">
              Upload PDF
            </Link>
            <Link href="/library" className="btn-ghost">
              View Library
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section>
        <SectionHeader
          title="Quick stats"
          subtitle="A glance at your workspace health"
        />
        {loading ? (
          <div className="text-slate-500 text-sm mt-3">Loading stats...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Papers" value={stats.papers?.toString() || "0"} hint="library" />
            <StatCard title="Embeddings" value={stats.embeddings?.toString() || "0"} hint="vector index" />
            <StatCard title="Chats" value={stats.chats?.toString() || "0"} hint="history" />
            <StatCard title="Last Import" value={stats.last_import || "—"} hint="recent" />
          </div>
        )}
      </section>

      {/* Next Steps */}
      <section>
        <SectionHeader
          title="Next steps"
          subtitle="Get started with the core features"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AnimatedCard>
            <h3 className="font-semibold">Upload</h3>
            <p className="mt-1 subtle">
              Add a PDF to your library. We will process and embed it for search.
            </p>
            <Link
              href="/upload"
              className="mt-4 inline-block btn-primary"
            >
              Go to Upload
            </Link>
          </AnimatedCard>
          <AnimatedCard>
            <h3 className="font-semibold">Chat</h3>
            <p className="mt-1 subtle">
              Ask questions across your papers and get citations in responses.
            </p>
            <Link
              href="/chat"
              className="mt-4 inline-block btn-primary"
            >
              Open Chat
            </Link>
          </AnimatedCard>
          <AnimatedCard>
            <h3 className="font-semibold">Analytics</h3>
            <p className="mt-1 subtle">
              See trends like topics, recency, and source distribution.
            </p>
            <Link
              href="/analytics"
              className="mt-4 inline-block btn-primary"
            >
              See Analytics
            </Link>
          </AnimatedCard>
        </div>
      </section>
    </div>
  );
}
