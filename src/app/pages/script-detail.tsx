import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ChevronLeft, Copy, Check, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { scriptApi } from "../../api/scripts";
import type { Script } from "../../types/script";
import { StatusBadge } from "../components/StatusBadge";
import { DeleteDialog } from "../components/DeleteDialog";

export function ScriptDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [script, setScript] = useState<Script | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    scriptApi
      .getScript(Number(id))
      .then(setScript)
      .catch((err) => {
        setError(err?.status === 404 ? "Script not found." : "Failed to load script.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleCopy() {
    if (!script) return;
    try {
      await navigator.clipboard.writeText(script.scriptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy. Please copy manually.");
    }
  }

  async function handleDelete() {
    if (!script) return;
    setDeleting(true);
    try {
      await scriptApi.deleteScript(script.id);
      toast.success("Script deleted.");
      navigate("/scripts");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete script.";
      toast.error(msg);
      setDeleting(false);
      setShowDelete(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-24" />
          <div className="h-6 bg-muted rounded w-2/3 mt-6" />
          <div className="h-4 bg-muted rounded w-32" />
          <div className="h-px bg-border mt-6" />
          <div className="space-y-2 mt-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-4 bg-muted rounded" style={{ width: `${70 + Math.random() * 30}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !script) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link to="/scripts" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ChevronLeft size={14} /> Back to Scripts
        </Link>
        <div className="rounded-lg border border-red-800 bg-red-950/30 p-4 text-sm text-red-400">
          {error ?? "Script not found."}
        </div>
      </div>
    );
  }

  const charCount = script.scriptText.length;
  const wordCount = script.scriptText.trim() ? script.scriptText.trim().split(/\s+/).length : 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link
        to="/scripts"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ChevronLeft size={14} />
        Back to Scripts
      </Link>

      {/* Title + meta */}
      <h1 className="text-foreground mb-3">{script.title}</h1>
      <div className="flex flex-wrap items-center gap-2 mb-1.5">
        {script.category && (
          <span className="text-sm text-muted-foreground bg-secondary px-2 py-0.5 rounded border border-border">
            {script.category.name}
          </span>
        )}
        <StatusBadge status={script.status} />
      </div>
      <div className="flex gap-4 text-xs text-muted-foreground font-mono mt-2">
        <span>Created {format(new Date(script.createdAt), "MMM d, yyyy")}</span>
        <span>Updated {format(new Date(script.updatedAt), "MMM d, yyyy")}</span>
      </div>

      {/* Divider */}
      <div className="border-t border-border my-6" />

      {/* Script label */}
      <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono mb-4">Script</p>

      {/* Script body */}
      <div className="bg-card border border-border rounded-lg p-5">
        <pre className="whitespace-pre-wrap text-sm text-foreground leading-relaxed font-[var(--font-sans)] break-words">
          {script.scriptText}
        </pre>
      </div>

      {/* Counts */}
      <div className="mt-3 text-xs text-muted-foreground font-mono">
        {charCount.toLocaleString()} characters · {wordCount.toLocaleString()} words
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-md text-foreground hover:border-indigo-500/40 hover:text-indigo-300 transition-colors"
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          {copied ? "Copied!" : "Copy Script"}
        </button>
        <Link
          to={`/scripts/${script.id}/edit`}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors"
        >
          <Pencil size={14} />
          Edit
        </Link>
        <button
          onClick={() => setShowDelete(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-md text-muted-foreground hover:text-red-400 hover:border-red-800 transition-colors ml-auto"
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>

      {showDelete && (
        <DeleteDialog
          title={script.title}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
          loading={deleting}
        />
      )}
    </div>
  );
}
