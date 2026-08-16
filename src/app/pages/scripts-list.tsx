import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router";
import { Plus, Film } from "lucide-react";
import { scriptApi } from "../../api/scripts";
import { categoryApi } from "../../api/categories";
import type { Script } from "../../types/script";
import type { Category } from "../../types/category";
import { ScriptCard } from "../components/ScriptCard";
import { SearchBar } from "../components/SearchBar";
import { CategoryFilter } from "../components/CategoryFilter";
import { SkeletonCard } from "../components/SkeletonCard";

const PAGE_SIZE = 20;

export function ScriptsList() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    categoryApi.getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setPage(0);
    }, 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  const fetchScripts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const isSearching = debouncedQuery.trim() || selectedCategoryId;
      const res = isSearching
        ? await scriptApi.searchScripts({ q: debouncedQuery, categoryId: selectedCategoryId, page, size: PAGE_SIZE })
        : await scriptApi.getScripts(page, PAGE_SIZE);
      setScripts(res.content);
      setTotalElements(res.totalElements);
      setTotalPages(res.totalPages);
    } catch {
      setError("Failed to load scripts. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, selectedCategoryId, page]);

  useEffect(() => {
    fetchScripts();
  }, [fetchScripts]);

  const isSearching = debouncedQuery.trim() || selectedCategoryId;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Title row */}
      <div className="mb-6">
        <p className="text-muted-foreground text-sm">Store and find your Instagram Reel scripts.</p>
      </div>

      {/* Search + filter */}
      <div className="flex gap-2 mb-6">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <CategoryFilter
          categories={categories}
          selectedId={selectedCategoryId}
          onChange={(id) => { setSelectedCategoryId(id); setPage(0); }}
        />
      </div>

      {/* Count */}
      {!loading && !error && (
        <p className="text-sm text-muted-foreground mb-4 font-mono">
          {totalElements.toLocaleString()} {isSearching ? "result" : "script"}{totalElements !== 1 ? "s" : ""}
        </p>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-800 bg-red-950/30 p-4 text-sm text-red-400 mb-4">
          {error}
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Script list */}
      {!loading && !error && scripts.length > 0 && (
        <div className="space-y-3">
          {scripts.map((s) => <ScriptCard key={s.id} script={s} />)}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && scripts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          {isSearching ? (
            <>
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Film size={20} className="text-muted-foreground" />
              </div>
              <p className="text-foreground mb-1">No scripts found</p>
              <p className="text-muted-foreground text-sm">Try a different keyword or category.</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Film size={20} className="text-muted-foreground" />
              </div>
              <p className="text-foreground mb-1">No scripts yet</p>
              <p className="text-muted-foreground text-sm mb-6">Start building your Reel script library.</p>
              <Link
                to="/scripts/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-500 transition-colors"
              >
                <Plus size={14} />
                Create Script
              </Link>
            </>
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1.5 text-sm rounded-md border border-border text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>
          {Array.from({ length: totalPages }).map((_, i) => {
            if (totalPages > 7 && Math.abs(i - page) > 2 && i !== 0 && i !== totalPages - 1) {
              if (i === 1 && page > 3) return <span key={i} className="text-muted-foreground text-sm">…</span>;
              if (i === totalPages - 2 && page < totalPages - 4) return <span key={i} className="text-muted-foreground text-sm">…</span>;
              if (Math.abs(i - page) > 2) return null;
            }
            return (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-8 h-8 text-sm rounded-md transition-colors ${
                  i === page
                    ? "bg-indigo-600 text-white"
                    : "border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {i + 1}
              </button>
            );
          })}
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-3 py-1.5 text-sm rounded-md border border-border text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
