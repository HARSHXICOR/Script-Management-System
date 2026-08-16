import { RouterProvider } from "react-router";
import { Toaster } from "sonner";
import { router } from "./routes";
import { AuthProvider } from "./context/auth-context";

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#1a1d28",
            border: "1px solid rgba(255,255,255,0.07)",
            color: "#e8eaf0",
          },
        }}
      />
    </AuthProvider>
  );
}
