import { AlertTriangle } from "lucide-react";

interface DeleteDialogProps {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function DeleteDialog({ title, onConfirm, onCancel, loading = false }: DeleteDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-card border border-border rounded-xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
            <AlertTriangle size={16} className="text-red-400" />
          </div>
          <h2 id="delete-dialog-title" className="text-foreground">
            Delete Script?
          </h2>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Are you sure you want to delete{" "}
          <span className="text-foreground font-medium">"{title}"</span>? This
          action cannot be undone.
        </p>
        <div className="mt-6 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-500 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
