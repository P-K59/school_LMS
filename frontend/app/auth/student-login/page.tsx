"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, BookOpen, ArrowRight, Sparkles, User, Smile } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import { tokenService } from "../../lib/token";

export default function StudentLogin() {
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
      setMessage("Welcome back! Loading your learning dashboard...");
    } catch (err: any) {
      setError(err.message || "Failed to establish a secure connection.");
      setIsLoading(false);
    }
  };

  const handleDemoStudentLogin = async () => {
    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      setMessage("Initializing learning sandbox...");
      await login("student@apexedu.com", "password123");
      
      setEmail("student@apexedu.com");
      setPassword("password123");
      setMessage("Awesome! Welcome to your student portal!");
    } catch (err: any) {
      setError(err.message || "Failed to run automated demo login.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between text-slate-350 font-inter antialiased relative overflow-hidden">
      {/* Background glowing gradients with playful pink/indigo shades */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-pink-500/10 via-indigo-500/10 to-transparent blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-purple-500/5 to-transparent blur-3xl" />

      {/* Header navbar */}
      <header className="max-w-[1440px] mx-auto w-full px-6 py-6 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 to-indigo-500 shadow-lg animate-bounce duration-1000">
            <span className="font-hanken font-bold text-lg text-white">EV</span>
          </div>
          <div>
            <h1 className="font-hanken font-bold text-base leading-none text-white tracking-tight">EduVerse</h1>
            <span className="text-[10px] text-pink-400 font-geist tracking-widest uppercase font-semibold">Student Hub</span>
          </div>
        </div>
      </header>

      {/* Main Panel Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12 z-10 relative">
        <div className="w-full max-w-md">
          {/* Card Wrapper with Playful glassmorphism and pink/purple borders */}
          <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
            {/* Top decorative bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" />
            
            {/* Header section inside card */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-4 shadow-inner">
                <Smile size={24} className="animate-spin duration-3000" />
              </div>
              <h2 className="font-hanken font-bold text-2xl text-white tracking-tight">Student Portal</h2>
              <p className="text-xs text-slate-400 mt-1.5 font-medium max-w-[280px]">
                Log in to watch fun videos, pass quizzes, and earn cool badges!
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-950/30 border border-rose-900/50 flex items-start gap-3 text-rose-450 animate-shake">
                <Smile size={18} className="shrink-0 mt-0.5 rotate-180" />
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
                  Student Email
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
                    placeholder="student@school.com"
                    className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all font-medium"
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
                    className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-pink-600 hover:bg-pink-500 text-white rounded-xl py-3 px-4 text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-pink-500/20 disabled:opacity-50 disabled:cursor-not-allowed mt-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    Let's Go!
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Playful Demo Login Section */}
            <div className="mt-8 pt-6 border-t border-slate-900/60 flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                <Smile size={12} className="text-pink-400" />
                <span>Just exploring? Try the sandbox!</span>
              </div>
              <button
                type="button"
                onClick={handleDemoStudentLogin}
                disabled={isLoading}
                className="w-full px-4 py-2.5 rounded-xl text-xs font-semibold text-pink-400 bg-pink-950/20 hover:bg-pink-950/40 border border-pink-900/40 hover:border-pink-850 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles size={13} />
                One-Click Demo Student Login
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-[1440px] mx-auto w-full px-6 py-6 border-t border-slate-900 flex items-center justify-center z-10 relative">
        <p className="text-[11px] text-slate-500 font-medium">
          © 2026 EduVerse LMS Inc. Student Hub.
        </p>
      </footer>
    </div>
  );
}
