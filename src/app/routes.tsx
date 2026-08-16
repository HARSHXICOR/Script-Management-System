import { createBrowserRouter, Navigate } from "react-router";
import { AppHeader } from "./components/app-header";
import { ScriptsList } from "./pages/scripts-list";
import { ScriptNew } from "./pages/script-new";
import { ScriptDetail } from "./pages/script-detail";
import { ScriptEdit } from "./pages/script-edit";
import { CategoriesPage } from "./pages/categories-page";
import { LoginPage } from "./pages/login";
import { SignupPage } from "./pages/signup";
import { ProtectedRoute } from "./components/ProtectedRoute";

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />
      <main>{children}</main>
    </div>
  );
}

function withProtectedLayout(Component: React.ComponentType) {
  return function ProtectedWrappedPage() {
    return (
      <ProtectedRoute>
        <AppLayout>
          <Component />
        </AppLayout>
      </ProtectedRoute>
    );
  };
}

export const router = createBrowserRouter([
  { path: "/login", Component: LoginPage },
  { path: "/signup", Component: SignupPage },
  { path: "/", element: <Navigate to="/scripts" replace /> },
  { path: "/scripts", Component: withProtectedLayout(ScriptsList) },
  { path: "/scripts/new", Component: withProtectedLayout(ScriptNew) },
  { path: "/scripts/:id", Component: withProtectedLayout(ScriptDetail) },
  { path: "/scripts/:id/edit", Component: withProtectedLayout(ScriptEdit) },
  { path: "/categories", Component: withProtectedLayout(CategoriesPage) },
  { path: "*", element: <Navigate to="/scripts" replace /> },
]);
