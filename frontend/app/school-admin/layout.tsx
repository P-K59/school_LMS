"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarCheck,
  CreditCard,
  BookOpen,
  Bus,
  Settings,
  LogOut,
  Building,
  UserCheck
} from "lucide-react";

export default function SchoolAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [schoolName, setSchoolName] = useState("EduVerse School");
  const [adminName, setAdminName] = useState("Administrator");

  useEffect(() => {
    const storedSchool = localStorage.getItem("school");
    const storedUser = localStorage.getItem("user");

    if (storedSchool) {
      try {
        const schoolObj = JSON.parse(storedSchool);
        setSchoolName(schoolObj.name || "Apex Academy");
      } catch (e) {}
    }

    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        setAdminName(`${userObj.firstName} ${userObj.lastName}`);
      } catch (e) {}
    }
  }, []);

  const menuItems = [
    { name: "Dashboard", href: "/school-admin/dashboard", icon: LayoutDashboard },
    { name: "Classes & Setup", href: "/school-admin/classes", icon: Settings },
    { name: "Students Registry", href: "/school-admin/students", icon: GraduationCap },
    { name: "Teacher Accounts", href: "/school-admin/teachers", icon: Users },
    { name: "Attendance Ledger", href: "/school-admin/attendance", icon: CalendarCheck },
    { name: "Fees & Invoices", href: "/school-admin/fees", icon: CreditCard },
    { name: "Library Catalog", href: "/school-admin/library", icon: BookOpen },
    { name: "Transport Map", href: "/school-admin/transport", icon: Bus },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("school");
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col justify-between shrink-0">
        <div>
          {/* Sidebar Header */}
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center font-bold text-white shadow-lg">
              EV
            </div>
            <div className="overflow-hidden">
              <h2 className="text-sm font-bold text-white truncate" title={schoolName}>
                {schoolName}
              </h2>
              <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase flex items-center gap-1">
                <Building size={9} />
                School Admin Panel
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 text-xs font-semibold rounded-xl transition-all ${
                    isActive
                      ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent"
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-indigo-400" : "text-slate-400"} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-indigo-400 border border-slate-700">
              <UserCheck size={14} />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-200 truncate">{adminName}</p>
              <span className="text-[9px] font-geist text-slate-500 uppercase tracking-widest">Active Session</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 border border-slate-800 hover:border-rose-900/30 transition-all cursor-pointer"
          >
            <LogOut size={14} />
            Revoke Session
          </button>
        </div>
      </aside>

      {/* Main Panel Frame */}
      <main className="flex-1 p-8 overflow-y-auto max-w-[1440px] mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
