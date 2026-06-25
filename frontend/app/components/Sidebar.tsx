"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  School,
  BookOpen,
  DollarSign,
  CreditCard,
  Megaphone,
  BarChart3,
  Settings,
  Menu,
  X,
  User,
  LogOut,
  ShieldCheck,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/superadmin/dashboard", icon: LayoutDashboard },
  { name: "Schools", href: "/superadmin/schools", icon: School },
  { name: "Course Builder", href: "/superadmin/courses/builder", icon: BookOpen },
  { name: "Pricing Settings", href: "/superadmin/pricing", icon: DollarSign },
  { name: "Subscriptions", href: "/superadmin/subscriptions", icon: CreditCard },
  { name: "Announcements", href: "/superadmin/announcements", icon: Megaphone },
  { name: "Analytics", href: "/superadmin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/superadmin/settings", icon: Settings },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Header Bar */}
      <header className="flex lg:hidden items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800 text-white w-full sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-container to-secondary-container shadow-premium">
            <span className="font-hanken font-bold text-lg text-white">EV</span>
          </div>
          <div>
            <h1 className="font-hanken font-bold leading-none tracking-tight text-white">EduVerse</h1>
            <span className="text-[10px] text-slate-400 font-geist tracking-widest uppercase">Super Admin</span>
          </div>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-2 text-slate-400 hover:text-white transition-colors focus:outline-none"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Sidebar Overlay Drawer */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-[280px] bg-slate-950 border-r border-slate-900 flex flex-col justify-between text-slate-300 font-inter transform lg:transform-none transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Logo Section */}
          <div className="p-6 border-b border-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-container to-secondary-container shadow-premium">
                <span className="font-hanken font-bold text-lg text-white">EV</span>
              </div>
              <div>
                <h1 className="font-hanken font-bold text-base leading-none tracking-tight text-white">EduVerse</h1>
                <span className="text-[10px] text-slate-400 font-geist tracking-widest uppercase">Super Admin</span>
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 group relative ${
                    isActive
                      ? "bg-primary-container text-white shadow-premium"
                      : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-100"
                  }`}
                >
                  <Icon
                    size={20}
                    className={`stroke-[2px] transition-colors ${
                      isActive ? "text-white" : "text-slate-400 group-hover:text-slate-100"
                    }`}
                  />
                  <span>{item.name}</span>
                  {isActive && (
                    <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Admin Card */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/40">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/50 border border-slate-900">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <ShieldCheck size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">Platform Master</p>
              <p className="text-[11px] text-slate-500 font-geist truncate">owner@eduverse.io</p>
            </div>
            <Link
              href="/"
              title="Return to Hub"
              className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg transition-colors"
            >
              <LogOut size={16} />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};
