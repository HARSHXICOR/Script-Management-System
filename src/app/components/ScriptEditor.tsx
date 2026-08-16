import { useEffect, useRef } from "react";

interface ScriptEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showCounts?: boolean;
  readOnly?: boolean;
  minRows?: number;
}

export function ScriptEditor({
  value,
  onChange,
  placeholder = "Write your Reel script here...",
  showCounts = true,
  readOnly = false,
  minRows = 12,
}: ScriptEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const charCount = value.length;
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight, minRows * 24)}px`;
  }, [value, minRows]);

  return (
    <div className="flex flex-col">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        rows={minRows}
        className="w-full bg-input-background border border-border rounded-lg p-4 text-sm text-foreground placeholder:text-muted-foreground leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500/60 transition-colors font-[var(--font-sans)] disabled:opacity-60"
        style={{ minHeight: `${minRows * 1.75}rem` }}
      />
      {showCounts && (
        <div className="mt-2 flex gap-4 text-xs text-muted-foreground font-mono">
          <span>{charCount.toLocaleString()} characters</span>
          <span>{wordCount.toLocaleString()} words</span>
        </div>
      )}
    </div>
  );
}
