import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Film, Lock, Mail, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/auth-context";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const from = (location.state as any)?.from?.pathname || "/scripts";

  function validate() {
    const errs: Record<string, string> = {};
    if (!email.trim()) {
      errs.email = "Email is required.";
    } else if (!email.includes("@")) {
      errs.email = "Please enter a valid email address.";
    }
    if (!password) {
      errs.password = "Password is required.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (err: any) {
      const msg = err?.message || "Invalid email or password.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleFillDemo() {
    setEmail("demo@example.com");
    setPassword("password123");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <Film size={18} className="text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Reel Script Manager
          </span>
        </div>
        <h2 className="text-center text-xl font-bold tracking-tight text-foreground">
          Sign in to your script library
        </h2>
        <p className="mt-1 text-center text-xs text-muted-foreground">
          Access your private Instagram Reel scripts and categories
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-card border border-border py-8 px-6 shadow-sm rounded-xl sm:px-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-foreground mb-1">
                Email address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <Mail size={14} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full bg-input-background border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500/60 transition-colors"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-foreground mb-1">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <Lock size={14} />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-input-background border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500/60 transition-colors"
                />
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Dev Demo Account helper */}
          <div className="mt-6 pt-5 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Dev Demo Account</span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
              >
                <Sparkles size={12} />
                Fill Demo Credentials
              </button>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground/80 font-mono">
              demo@example.com / password123
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
