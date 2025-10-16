"use client";
import { motion } from "framer-motion";
import React from "react";

export default function AnimatedCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="card shadow-soft">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{ width: "100%" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
