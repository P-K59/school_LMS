"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ShieldCheck, Terminal, AlertCircle, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import { tokenService } from "../../lib/token";
import Link from "next/link";

export default function SchoolAdminLogin() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      await login(email, password);
      setMessage("Session authenticated successfully! Accessing panel...");
    } catch (err: any) {
      setError(err.message || "Failed to establish a secure connection.");
      setIsLoading(false);
    }
  };

  const handleDemoOnboard = async () => {
    setError(null);
    setMessage(null);
    setIsLoading(true);

    const randomId = Math.floor(1000 + Math.random() * 9000);
    const demoPayload = {
      schoolName: `Apex International School ${randomId}`,
      schoolEmail: `contact_${Date.now()}@apexedu.com`,
      schoolPhone: "9876543210",
      firstName: "Principal",
      lastName: "Apex",
      email: `admin_${Date.now()}@apexedu.com`,
      password: "password123",
    };

    try {
      setMessage("Registering Demo School Tenant...");
      const regData = await api.post("/auth/register-school", demoPayload);

      if (regData.success && regData.data) {
        const { accessToken, user: regUser, school: regSchool } = regData.data;
        tokenService.setSession(accessToken, regUser, regSchool);

        setEmail(demoPayload.email);
        setPassword(demoPayload.password);
        setMessage("School created! Loading dashboard... Enjoy the sandbox.");

        setTimeout(() => {
          router.push("/school-admin/dashboard");
        }, 1000);
      } else {
        throw new Error(regData.message || "Failed to register demo school.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to run automated onboarding.");
      setIsLoading(false);
    }
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
            <span className="text-[10px] text-slate-400 font-geist tracking-widest uppercase">School Hub</span>
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
              <h2 className="font-hanken font-bold text-2xl text-white tracking-tight">School Admin Portal</h2>
              <p className="text-xs text-slate-450 mt-1.5 font-medium max-w-[280px]">
                Enter your registered administrator email and secure password signature.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-950/30 border border-rose-900/50 flex items-start gap-3 text-rose-400 animate-shake">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <div className="text-xs font-semibold">{error}</div>
              </div>
            )}

            {/* Success Message */}
            {message && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-950/30 border border-emerald-900/50 flex items-start gap-3 text-emerald-400">
                <Sparkles size={18} className="shrink-0 mt-0.5" />
                <div className="text-xs font-semibold">{message}</div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-geist text-slate-400 uppercase tracking-wider mb-2 font-medium">
                  Administrator Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@school.com"
                    className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-geist text-slate-400 uppercase tracking-wider mb-2 font-medium">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
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
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-3 px-4 text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed mt-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    Authenticate Session
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 text-center text-xs text-slate-400 font-medium">
              Want to register a new school?{" "}
              <Link href="/auth/register-school" className="text-indigo-400 hover:underline">
                Register here
              </Link>
            </div>

            {/* Quick credentials banner */}
            <div className="mt-8 pt-6 border-t border-slate-900/60 flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 text-[11px] font-medium text-slate-550">
                <Terminal size={12} className="text-indigo-400" />
                <span>Need a clean testing sandbox?</span>
              </div>
              <button
                type="button"
                onClick={handleDemoOnboard}
                disabled={isLoading}
                className="w-full px-4 py-2.5 rounded-xl text-xs font-semibold text-indigo-400 bg-indigo-950/30 hover:bg-indigo-950/50 border border-indigo-900/50 hover:border-indigo-800/60 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles size={13} />
                One-Click Onboard Demo School
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-[1440px] mx-auto w-full px-6 py-6 border-t border-slate-900 flex items-center justify-center z-10 relative">
        <p className="text-[11px] text-slate-500 font-medium">
          &copy; 2026 EduVerse LMS Inc. School Hub Portal.
        </p>
      </footer>
    </div>
  );
}
