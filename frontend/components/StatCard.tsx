import React from "react";

export default function StatCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="card gradient-ring">
      <div className="flex items-baseline justify-between">
        <p className="subtle">{title}</p>
        {hint ? <span className="badge badge-blue">{hint}</span> : null}
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}