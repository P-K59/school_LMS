"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SchoolAdminIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/school-admin/dashboard");
  }, [router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-400">Loading Admin Suite...</p>
      </div>
    </div>
  );
}
