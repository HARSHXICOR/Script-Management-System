import { Link, useNavigate } from "react-router";
import { Plus, Film, Tag, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "../context/auth-context";

export function AppHeader() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link
          to="/scripts"
          className="flex items-center gap-2.5 text-foreground hover:text-indigo-300 transition-colors"
        >
          <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center">
            <Film size={14} className="text-white" />
          </div>
          <span className="hidden sm:block text-sm font-medium tracking-tight">
            Reel Script Manager
          </span>
          <span className="sm:hidden text-sm font-medium">Reel Scripts</span>
        </Link>

        <nav className="flex items-center gap-2">
          <a
            href="/swagger"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary"
            title="Interactive Swagger API Documentation"
          >
            <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
              API Docs
            </span>
          </a>
          <Link
            to="/categories"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary"
          >
            <Tag size={14} />
            <span className="hidden sm:inline">Categories</span>
          </Link>
          <button
            onClick={() => navigate("/scripts/new")}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors cursor-pointer"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">New Script</span>
            <span className="sm:hidden">New</span>
          </button>

          {user && (
            <div className="flex items-center pl-2 border-l border-border gap-2">
              <div
                title={user.email}
                className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-md max-w-[140px] truncate"
              >
                <UserIcon size={12} className="shrink-0 text-indigo-400" />
                <span className="truncate">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                title="Sign out"
                className="p-1.5 text-muted-foreground hover:text-red-400 rounded-md hover:bg-secondary transition-colors cursor-pointer"
                aria-label="Sign out"
              >
                <LogOut size={14} />
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
