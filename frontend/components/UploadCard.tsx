"use client";

import { useState } from "react";
import axios from "axios";
import { api } from "@/utils/api";

export default function UploadCard() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");

  const onUpload = async () => {
    if (!file) return;
    setStatus("Uploading...");
    try {
      const form = new FormData();
      form.append("file", file);
      const { data } = await axios.post(`${api.baseURL}/ingest/pdf`, form, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setStatus(`Uploaded. paper_id ${data.paper_id}, embedding_id ${data.embedding_id}, text_length ${data.chunks}`);
    } catch (e: any) {
      setStatus(`Upload failed, ${e?.response?.data?.detail || e.message}`);
    }
  };

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm grid gap-4">
      <div>
        <label className="block text-sm font-medium mb-2">Select PDF</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm"
        />
      </div>
      <button
        onClick={onUpload}
        className="w-fit px-4 py-2 rounded-xl bg-indigo-600 text-white"
      >
        Upload PDF
      </button>
      {status && <p className="text-sm text-slate-700">{status}</p>}
    </div>
  );
}
