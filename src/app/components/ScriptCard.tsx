import { Link } from "react-router";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight } from "lucide-react";
import type { Script } from "../../types/script";
import { StatusBadge } from "./StatusBadge";

interface ScriptCardProps {
  script: Script;
}

export function ScriptCard({ script }: ScriptCardProps) {
  const updatedAgo = formatDistanceToNow(new Date(script.updatedAt), { addSuffix: true });
  const preview = script.scriptText.replace(/\n+/g, " ").trim();

  return (
    <Link
      to={`/scripts/${script.id}`}
      className="block group border border-border bg-card rounded-lg p-5 hover:border-indigo-500/40 hover:bg-[#161923] transition-all duration-150"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-foreground leading-snug group-hover:text-indigo-300 transition-colors line-clamp-1 flex-1">
          {script.title}
        </h3>
        {script.category && (
          <span className="shrink-0 text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded border border-border">
            {script.category.name}
          </span>
        )}
      </div>

      <p className="mt-2 text-muted-foreground text-sm leading-relaxed line-clamp-2">
        {preview}
      </p>

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <StatusBadge status={script.status} />
          <span className="text-xs text-muted-foreground">{updatedAgo}</span>
        </div>
        <span className="text-xs text-muted-foreground flex items-center gap-1 group-hover:text-indigo-400 transition-colors">
          Open <ArrowRight size={12} />
        </span>
      </div>
    </Link>
  );
}
