"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ShieldCheck, Terminal, AlertCircle, ArrowRight } from "lucide-react";

export default function SuperAdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (email === "owner@eduverse.io" && password === "password") {
      sessionStorage.setItem("superadmin_logged_in", "true");
      router.push("/superadmin/dashboard");
    } else {
      setError("Invalid credential signatures. Verification failed.");
      setIsLoading(false);
    }
  };

  const handleAutofill = () => {
    setEmail("owner@eduverse.io");
    setPassword("password");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between text-slate-300 font-inter antialiased relative overflow-hidden">
      {/* Background glowing gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-indigo-500/15 to-transparent blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-blue-500/10 to-transparent blur-3xl" />

      {/* Header navbar */}
      <header className="max-w-[1440px] mx-auto w-full px-6 py-6 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 shadow-lg">
            <span className="font-hanken font-bold text-lg text-white">EV</span>
          </div>
          <div>
            <h1 className="font-hanken font-bold text-base leading-none text-white tracking-tight">EduVerse</h1>
            <span className="text-[10px] text-slate-400 font-geist tracking-widest uppercase">System Hub</span>
          </div>
        </div>
      </header>

      {/* Main Panel Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12 z-10 relative">
        <div className="w-full max-w-md">
          {/* Card Wrapper with Glassmorphism */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
            {/* Top decorative bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500" />
            
            {/* Header section inside card */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 shadow-inner">
                <ShieldCheck size={24} />
              </div>
              <h2 className="font-hanken font-bold text-2xl text-white tracking-tight">System Access Portal</h2>
              <p className="text-xs text-slate-400 mt-1.5 font-medium max-w-[280px]">
                Authorized administrative personnel only. Terminal access logging is active.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-950/30 border border-rose-900/50 flex items-start gap-3 text-rose-400 animate-shake">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <div className="text-xs font-semibold">{error}</div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-geist text-slate-400 uppercase tracking-wider mb-2 font-medium">
                  Administrator Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-550">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@eduverse.io"
                    className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-geist text-slate-400 uppercase tracking-wider mb-2 font-medium">
                  Verification Code / Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-550">
                    <Lock size={16} />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-3 px-4 text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Establishing Secure Session...
                  </>
                ) : (
                  <>
                    Authenticate Session
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Quick credentials banner */}
            <div className="mt-8 pt-6 border-t border-slate-900/60 flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                <Terminal size={12} className="text-indigo-400" />
                <span>Need prototype credential signatures?</span>
              </div>
              <button
                type="button"
                onClick={handleAutofill}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-indigo-400 bg-indigo-950/30 hover:bg-indigo-950/50 border border-indigo-900/50 hover:border-indigo-800/60 transition-all cursor-pointer"
              >
                Auto-fill Master Credentials
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-[1440px] mx-auto w-full px-6 py-6 border-t border-slate-900 flex items-center justify-center z-10 relative">
        <p className="text-[11px] text-slate-500 font-medium">
          &copy; 2026 EduVerse LMS Inc. Secure Terminal Portal. All access is logged.
        </p>
      </footer>
    </div>
  );
}
