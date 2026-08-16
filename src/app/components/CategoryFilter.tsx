import type { Category } from "../../types/category";

interface CategoryFilterProps {
  categories: Category[];
  selectedId: number | undefined;
  onChange: (id: number | undefined) => void;
}

export function CategoryFilter({ categories, selectedId, onChange }: CategoryFilterProps) {
  return (
    <div className="relative">
      <select
        value={selectedId ?? ""}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
        className="bg-input-background border border-border rounded-md px-3 py-2.5 pr-8 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500/60 transition-colors appearance-none cursor-pointer min-w-[160px]"
        aria-label="Filter by category"
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
    </div>
  );
}
