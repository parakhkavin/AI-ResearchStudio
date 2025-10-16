"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { api } from "@/utils/api";

type Paper = {
  id: number;
  title: string;
  source: string;
  created_at: string;
};

export default function PaperList() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["papers"],
    queryFn: async (): Promise<Paper[]> => {
      const res = await axios.get(`${api.baseURL}/papers/`);
      return res.data;
    }
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">Failed to load papers</p>;

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Your Papers</h3>
        <button onClick={() => refetch()} className="text-sm underline">Refresh</button>
      </div>
      <ul className="divide-y">
        {(data || []).map((p) => (
          <li key={p.id} className="py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{p.title}</p>
                <p className="text-xs text-slate-600">{p.source}</p>
              </div>
              <div className="text-xs text-slate-500">
                {new Date(p.created_at).toLocaleString()}
              </div>
            </div>
          </li>
        ))}
        {(!data || data.length === 0) && (
          <li className="py-6 text-sm text-slate-600">No papers yet, upload one to get started.</li>
        )}
      </ul>
    </div>
  );
}
