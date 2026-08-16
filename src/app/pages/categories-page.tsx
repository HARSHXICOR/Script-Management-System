import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ChevronLeft, Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { categoryApi } from "../../api/categories";
import type { Category } from "../../types/category";

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    categoryApi.getCategories().then(setCategories).finally(() => setLoading(false));
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setAdding(true);
    try {
      const cat = await categoryApi.createCategory(newName.trim());
      setCategories((prev) => [...prev, cat]);
      setNewName("");
      toast.success(`Category "${cat.name}" added.`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to add category.");
    } finally {
      setAdding(false);
    }
  }

  async function handleUpdate(id: number) {
    if (!editName.trim()) return;
    try {
      const updated = await categoryApi.updateCategory(id, editName.trim());
      setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
      setEditingId(null);
      toast.success("Category renamed.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to rename.");
    }
  }

  async function handleDelete(id: number, name: string) {
    setDeletingId(id);
    try {
      await categoryApi.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success(`"${name}" deleted.`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete.");
    } finally {
      setDeletingId(null);
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

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-foreground">Categories</h1>
          <p className="text-muted-foreground text-sm mt-1">Organize your scripts by topic.</p>
        </div>
      </div>

      {/* Add form */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-8">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New category name..."
          className="flex-1 bg-input-background border border-border rounded-md px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500/60 transition-colors"
        />
        <button
          type="submit"
          disabled={adding || !newName.trim()}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors disabled:opacity-50"
        >
          <Plus size={14} />
          Add
        </button>
      </form>

      {loading && (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {!loading && categories.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">
          No categories yet. Add your first one above.
        </div>
      )}

      {!loading && categories.length > 0 && (
        <ul className="space-y-1.5">
          {categories.map((cat) => (
            <li
              key={cat.id}
              className="flex items-center gap-3 px-4 py-3 bg-card border border-border rounded-lg group"
            >
              {editingId === cat.id ? (
                <>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleUpdate(cat.id);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    autoFocus
                    className="flex-1 bg-input-background border border-indigo-500/60 rounded px-2 py-1 text-sm text-foreground focus:outline-none"
                  />
                  <button
                    onClick={() => handleUpdate(cat.id)}
                    className="text-emerald-400 hover:text-emerald-300 transition-colors p-1"
                    aria-label="Save"
                  >
                    <Check size={14} />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1"
                    aria-label="Cancel"
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm text-foreground">{cat.name}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => { setEditingId(cat.id); setEditName(cat.name); }}
                      className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded hover:bg-secondary"
                      aria-label={`Rename ${cat.name}`}
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      disabled={deletingId === cat.id}
                      className="text-muted-foreground hover:text-red-400 transition-colors p-1.5 rounded hover:bg-secondary disabled:opacity-50"
                      aria-label={`Delete ${cat.name}`}
                    >
                      {deletingId === cat.id ? (
                        <span className="w-3 h-3 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin block" />
                      ) : (
                        <Trash2 size={13} />
                      )}
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
