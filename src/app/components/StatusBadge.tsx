import type { ScriptStatus } from "../../types/script";

const config: Record<ScriptStatus, { label: string; className: string }> = {
  DRAFT: {
    label: "DRAFT",
    className: "bg-zinc-800 text-zinc-400 border border-zinc-700",
  },
  READY: {
    label: "READY",
    className: "bg-indigo-950 text-indigo-300 border border-indigo-800",
  },
  PUBLISHED: {
    label: "PUBLISHED",
    className: "bg-emerald-950 text-emerald-400 border border-emerald-800",
  },
  ARCHIVED: {
    label: "ARCHIVED",
    className: "bg-stone-900 text-stone-500 border border-stone-700",
  },
};

interface StatusBadgeProps {
  status: ScriptStatus;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const { label, className: base } = config[status] ?? config.DRAFT;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs tracking-wider font-mono ${base} ${className}`}
    >
      {label}
    </span>
  );
}
