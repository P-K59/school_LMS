import React from "react";
import Link from "next/link";
import { School, BookOpen } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between text-slate-300 font-inter antialiased relative overflow-hidden">
      {/* Background glowing gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-indigo-500/10 to-transparent blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-blue-500/5 to-transparent blur-3xl" />

      {/* Header navbar */}
      <header className="max-w-[1440px] mx-auto w-full px-6 py-6 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 shadow-lg">
            <span className="font-hanken font-bold text-lg text-white">EV</span>
          </div>
          <div>
            <h1 className="font-hanken font-bold text-base leading-none text-white tracking-tight">EduVerse</h1>
            <span className="text-[10px] text-slate-400 font-geist tracking-widest uppercase">Management Suite</span>
          </div>
        </div>
        <span className="text-xs font-geist text-slate-500 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full uppercase tracking-wider">
          v2.1.0-beta
        </span>
      </header>

      {/* Main Panel Content */}
      <main className="max-w-[1440px] mx-auto w-full px-6 py-16 flex-1 flex flex-col items-center justify-center text-center z-10 relative">
        <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest bg-indigo-950/40 border border-indigo-900/60 px-3 py-1 rounded-full mb-6">
          Global Institutional Management
        </span>
        <h2 className="font-hanken font-bold text-4xl sm:text-5xl md:text-6xl text-white tracking-tight max-w-3xl leading-tight">
          Next-Generation SaaS Ecosystem Hub
        </h2>
        <p className="text-slate-400 text-base md:text-lg max-w-xl mt-6 leading-relaxed">
          Welcome to the central command hub of the EduVerse LMS platform. Manage registered academic institutions, configure subscriptions, customize pricing structures, and generate course assessments.
        </p>

        {/* Portal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 w-full max-w-3xl">
          {/* Card 2: School Admin Panel */}
          <div className="p-6 rounded-2xl bg-slate-900/20 border border-slate-900/60 opacity-60 flex flex-col justify-between text-left select-none relative">
            <span className="absolute top-4 right-4 text-[9px] font-bold font-geist bg-slate-900 border border-slate-800 text-slate-500 px-2 py-0.5 rounded-full">
              INTERN 3
            </span>
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-800/20 border border-slate-800/30 flex items-center justify-center text-slate-500 mb-4">
                <School size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-400 leading-snug">School Admin Panel</h3>
              <p className="text-xs text-slate-550 mt-1.5 leading-relaxed font-medium">
                Manage your specific school, assign teachers, monitor your students, and organize class timetables.
              </p>
            </div>
            <span className="mt-6 flex items-center justify-between text-xs font-bold text-slate-600">
              Restricted Module
            </span>
          </div>

          {/* Card 3: Student Portal */}
          <div className="p-6 rounded-2xl bg-slate-900/20 border border-slate-900/60 opacity-60 flex flex-col justify-between text-left select-none relative">
            <span className="absolute top-4 right-4 text-[9px] font-bold font-geist bg-slate-900 border border-slate-800 text-slate-500 px-2 py-0.5 rounded-full">
              INTERN 4
            </span>
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-800/20 border border-slate-800/30 flex items-center justify-center text-slate-500 mb-4">
                <BookOpen size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-400 leading-snug">Student Hub Portal</h3>
              <p className="text-xs text-slate-550 mt-1.5 leading-relaxed font-medium">
                Watch lecture videos, take dynamic module quizzes, and view personal progress performance certificates.
              </p>
            </div>
            <span className="mt-6 flex items-center justify-between text-xs font-bold text-slate-600">
              Restricted Module
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-[1440px] mx-auto w-full px-6 py-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 z-10 relative">
        <p className="text-xs text-slate-500 font-medium">
          &copy; 2026 EduVerse LMS Inc. All systems normal.
        </p>
        <div className="flex items-center gap-4 text-xs font-geist text-slate-500">
          <span>Terms of Licensing</span>
        </div>
      </footer>
    </div>
  );
}
