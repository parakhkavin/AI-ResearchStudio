import React from "react";

export default function SectionHeader({
  title,
  subtitle,
  cta,
}: {
  title: string;
  subtitle?: string;
  cta?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-3">
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle ? <p className="mt-1 subtle">{subtitle}</p> : null}
      </div>
      {cta}
    </div>
  );
}