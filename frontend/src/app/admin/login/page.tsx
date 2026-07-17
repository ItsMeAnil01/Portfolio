"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { token } = await adminLogin(email, password);
      localStorage.setItem("admin_token", token);
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-ink px-6">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-panelBorder bg-panel p-8"
      >
        <div className="mb-6 font-mono text-xs uppercase tracking-wide text-signal">
          // admin access
        </div>
        <h1 className="mb-6 font-display text-2xl text-paper">Sign in</h1>

        <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wide text-muted">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-5 w-full rounded-md border border-panelBorder bg-ink px-3 py-2 font-body text-sm text-paper outline-none focus:border-signal"
        />

        <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wide text-muted">
          Password
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-5 w-full rounded-md border border-panelBorder bg-ink px-3 py-2 font-body text-sm text-paper outline-none focus:border-signal"
        />

        {error && <p className="mb-4 font-mono text-xs text-alert">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-signal px-6 py-3 font-mono text-sm font-medium text-ink transition hover:bg-signal/90 disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
