"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck, ArrowRight, Zap } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setError(false); setMessage("");
    try { const res = await fetch("/api/auth/login", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({password:pin}) }); const data=await res.json(); if(!res.ok) throw new Error(data.error || "Login failed"); router.replace("/admin"); }
    catch(err) { setError(true); setMessage(err instanceof Error ? err.message : "Login failed. Try again."); }
    finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#090b0e] text-white">
      <div className="w-full max-w-sm rounded-3xl p-8 border border-white/[0.1] bg-[#121620] shadow-2xl text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4 text-emerald-400">
          <Zap className="w-7 h-7" />
        </div>

        <h2 className="text-2xl font-black text-white">ARS Motors Salem</h2>
        <p className="text-xs text-slate-400 mt-1 mb-6">
          Staff CRM & Lead Management Portal
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-2 text-left">
              Staff password
            </label>
            <div className="relative">
              <input
                type="password" autoComplete="current-password"
                required
                placeholder="Enter your staff password"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                className="w-full bg-[#1b202d] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-center text-white focus:outline-none focus:border-emerald-400 font-mono tracking-widest text-lg"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute right-4 top-3.5" />
            </div>
          </div>

          {error && (
            <p className="text-xs font-semibold text-rose-400">
              {message}
            </p>
          )}

          <button
            type="submit" disabled={busy}
            className="w-full py-3.5 px-6 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2"
          >
            <span>Unlock CRM Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-white/[0.08] text-[11px] text-slate-500">
          Showroom Branches: Seelanaickenpatti & Madathur
        </div>
      </div>
    </div>
  );
}
