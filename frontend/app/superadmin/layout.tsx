"use client";

import React from "react";
import { MockDataProvider } from "../context/MockDataContext";
import { Sidebar } from "../components/Sidebar";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
