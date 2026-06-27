"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MockDataProvider } from "../context/MockDataContext";
import { Sidebar } from "../components/Sidebar";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  const isLoginPage = pathname === "/superadmin";

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("superadmin_logged_in") === "true";

    if (isLoginPage) {
      if (isLoggedIn) {
        router.push("/superadmin/dashboard");
      } else {
        setAuthorized(true);
      }
    } else {
      if (!isLoggedIn) {
        router.push("/superadmin");
      } else {
        setAuthorized(true);
      }
    }
  }, [pathname, router, isLoginPage]);

  if (!authorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 font-inter">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-indigo-500/10 to-transparent blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-blue-500/5 to-transparent blur-3xl" />
        <div className="flex flex-col items-center gap-4 z-10">
          <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-indigo-500 animate-spin" />
          <p className="text-xs font-geist font-semibold uppercase tracking-widest text-slate-500">
            Checking Credentials...
          </p>
        </div>
      </div>
    );
  }

  if (isLoginPage) {
    return <MockDataProvider>{children}</MockDataProvider>;
  }

  return (
    <MockDataProvider>
      <div className="flex flex-col lg:flex-row min-h-screen bg-surface">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
            {children}
          </main>
        </div>
      </div>
    </MockDataProvider>
  );
}
