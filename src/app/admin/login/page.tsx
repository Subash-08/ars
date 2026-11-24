"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Zap } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [expired, setExpired] = useState(false);
  useEffect(() => {
    setExpired(new URLSearchParams(location.search).has("expired"));
  }, []);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not sign in. Please try again.");
      const section = new URLSearchParams(location.search).get("section");
      router.replace(section === "stories" ? "/admin?section=stories" : "/admin");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not sign in. Please try again.");
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#090b0e] text-white">
      <div className="w-full max-w-sm rounded-3xl p-8 border border-white/[0.1] bg-[#121620] shadow-2xl text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4 text-emerald-400">
          <Zap className="w-7 h-7" />
        </div>

        <h1 className="text-2xl font-black text-white">ARS Motors Salem</h1>
        <p className="mt-1 mb-6 text-sm text-slate-400">Admin sign-in</p>
        {expired && <p role="status" className="mb-4 rounded-xl border border-amber-300/25 bg-amber-300/10 px-3 py-2 text-sm text-amber-100">Your session expired. Sign in to continue.</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="admin-password" className="text-xs font-bold text-slate-300 block mb-2 text-left">
              Password
            </label>
            <input id="admin-password" name="password" type="password" autoComplete="current-password" required
              value={password} onChange={e => { setPassword(e.target.value); setMessage(""); }}
              className="w-full rounded-xl border border-white/10 bg-[#1b202d] px-4 py-3 text-base text-white focus:border-emerald-400 focus:outline-none"/>
          </div>

          {message && (
            <p role="alert" className="text-sm font-semibold text-rose-400">
              {message}
            </p>
          )}

          <button
            type="submit" disabled={busy}
            className="w-full py-3.5 px-6 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2"
          >
            <span>{busy ? "Signing in…" : "Sign in"}</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true"/>
          </button>
        </form>

      </div>
    </div>
  );
}
