"use client";
import React, { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import Lottie from "lottie-react";
import uploadAnim from "@/app/assets/upload.json";
import { motion } from "framer-motion";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const dropRef = useRef<HTMLDivElement>(null);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f && f.type === "application/pdf") {
      setFile(f);
    } else {
      toast.error("Please drop a PDF file.");
    }
  };

  const onBrowse = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    if (f && f.type === "application/pdf") setFile(f);
    else if (f) toast.error("Only PDF files are supported.");
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Select a PDF first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    setProgress(10);

    try {
      const res = await axios.post(`${API_BASE}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (evt) => {
          if (!evt.total) return;
          const pct = Math.round((evt.loaded * 100) / evt.total);
          setProgress(Math.min(95, pct));
        },
      });

      if (res.data && res.data.success) {
        toast.success("Upload complete");
      } else {
        toast.success("File uploaded successfully");
      }

      console.log("Upload result:", res.data);
      setFile(null);
      setProgress(100);
    } catch (err: any) {
      console.error("Upload failed:", err);
      toast.error(err.response?.data?.detail || "Upload failed");
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 700);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 items-stretch">
      <div className="card">
        <div
          ref={dropRef}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className="rounded-2xl border-2 border-dashed border-slate-300 p-6 bg-white/50 text-center"
        >
          <Lottie animationData={uploadAnim} loop className="mx-auto h-36" />
          <p className="font-medium">Drag and drop your PDF</p>
          <p className="subtle mt-1">or click below to browse</p>

          <label className="mt-4 inline-block btn-ghost cursor-pointer">
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={onBrowse}
            />
            Browse file
          </label>

          {file && <div className="mt-4 text-sm">{file.name}</div>}

          {loading && (
            <div className="mt-4 w-full bg-slate-200 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-blue-600 transition-all"
                style={{ width: progress + "%" }}
              />
            </div>
          )}

          <button
            onClick={handleUpload}
            className="mt-6 btn-primary disabled:opacity-50"
            disabled={!file || loading}
          >
            {loading ? "Uploading..." : "Upload PDF"}
          </button>
        </div>
      </div>

      <div className="card gradient-ring">
        <h3 className="font-semibold">Tips</h3>
        <ul className="mt-3 list-disc pl-5 text-sm text-slate-600 space-y-1">
          <li>PDF only for now</li>
          <li>Keep filenames readable</li>
          <li>Uploads are processed by the backend and embedded automatically</li>
        </ul>
      </div>
    </div>
  );
}
