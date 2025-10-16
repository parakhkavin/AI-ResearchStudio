"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import React from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/upload", label: "Upload" },
  { href: "/library", label: "Library" },
  { href: "/chat", label: "Chat" },
  { href: "/analytics", label: "Analytics" },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <div className="sticky top-0 z-40 backdrop-blur-xl border-b border-white/20 bg-white/60">
      <div className="container-page flex h-14 items-center justify-between">
        <Link href="/" className="font-bold tracking-tight text-lg">
          AI Research Studio
        </Link>
        <nav className="flex items-center gap-1">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-2 rounded-xl text-sm transition ${
                  active ? "bg-blue-600 text-white" : "hover:bg-slate-100"
                }`}
              >
                {active && (
                  <span className="absolute">
                    <motion.div
                      layoutId="nav-pill"
                      transition={{ type: "spring", bounce: 0.25, duration: 0.4 }}
                    />
                  </span>
                )}
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}