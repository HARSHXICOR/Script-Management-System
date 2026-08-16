import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { scriptApi } from "../../api/scripts";
import { categoryApi } from "../../api/categories";
import type { Category } from "../../types/category";
import type { ScriptStatus } from "../../types/script";
import { ScriptEditor } from "../components/ScriptEditor";

const STATUS_OPTIONS: { value: ScriptStatus; label: string }[] = [
  { value: "DRAFT", label: "Draft" },
  { value: "READY", label: "Ready" },
  { value: "PUBLISHED", label: "Published" },
  { value: "ARCHIVED", label: "Archived" },
];

export function ScriptNew() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [scriptText, setScriptText] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [status, setStatus] = useState<ScriptStatus>("DRAFT");
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    categoryApi.getCategories().then(setCategories).catch(() => {});
  }, []);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "Title is required.";
    else if (title.trim().length > 255) errs.title = "Title must be 255 characters or fewer.";
    if (!scriptText.trim()) errs.scriptText = "Script text is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const script = await scriptApi.createScript({
        title: title.trim(),
        scriptText: scriptText.trim(),
        categoryId,
        status,
      });
      toast.success("Script saved.");
      navigate(`/scripts/${script.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save script.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link
        to="/scripts"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ChevronLeft size={14} />
        Back to Scripts
      </Link>

      <h1 className="text-foreground mb-8">Create New Script</h1>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm text-foreground mb-1.5">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Best Cafe in Kharagpur"
            maxLength={255}
            className="w-full bg-input-background border border-border rounded-md px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500/60 transition-colors"
            aria-describedby={errors.title ? "title-error" : undefined}
          />
          {errors.title && (
            <p id="title-error" className="mt-1.5 text-xs text-red-400">
              {errors.title}
            </p>
          )}
        </div>

        {/* Category + Status row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm text-foreground mb-1.5">
              Category
            </label>
            <div className="relative">
              <select
                id="category"
                value={categoryId ?? ""}
                onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : null)}
                className="w-full bg-input-background border border-border rounded-md px-3 py-2.5 pr-8 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500/60 transition-colors appearance-none"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm text-foreground mb-1.5">
              Status
            </label>
            <div className="relative">
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as ScriptStatus)}
                className="w-full bg-input-background border border-border rounded-md px-3 py-2.5 pr-8 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500/60 transition-colors appearance-none"
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
          </div>
        </div>

        {/* Script */}
        <div>
          <label htmlFor="scriptText" className="block text-sm text-foreground mb-1.5">
            Script <span className="text-red-400">*</span>
          </label>
          <ScriptEditor
            value={scriptText}
            onChange={setScriptText}
            minRows={14}
          />
          {errors.scriptText && (
            <p className="mt-1.5 text-xs text-red-400">{errors.scriptText}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to="/scripts"
            className="px-4 py-2 text-sm rounded-md border border-border text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              "Save Script"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
