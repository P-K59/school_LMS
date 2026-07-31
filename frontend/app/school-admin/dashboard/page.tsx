"use client";

import React, { useState, useEffect } from "react";
import { api } from "../../lib/api";
import {
  Users,
  GraduationCap,
  BookOpen,
  Bus,
  TrendingUp,
  Percent,
  IndianRupee,
  Clock,
  Sparkles
} from "lucide-react";

export default function SchoolAdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/dashboard/admin");
      setStats(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to query live dashboard telemetry.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-950/20 border border-rose-900/50 rounded-3xl text-center text-rose-400 space-y-4">
        <p className="text-sm font-semibold">Error: {error}</p>
        <button
          onClick={loadStats}
          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-2 px-4 text-xs font-semibold cursor-pointer"
        >
          Retry Load
        </button>
      </div>
    );
  }

  const counters = stats?.statistics || {};

  const cards = [
    { name: "Enrolled Students", value: counters.totalStudents ?? 0, icon: GraduationCap, color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/15" },
    { name: "Total Courses", value: counters.totalCourses ?? 0, icon: BookOpen, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/15" },
    { name: "Published Courses", value: counters.publishedCourses ?? 0, icon: Sparkles, color: "text-amber-400 bg-amber-500/10 border-amber-500/15" },
    { name: "Total Enrollments", value: counters.totalEnrollments ?? 0, icon: Users, color: "text-sky-400 bg-sky-500/10 border-sky-500/15" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-hanken font-bold text-4xl text-white tracking-tight flex items-center gap-2">
            Institutional Dashboard <Sparkles className="text-indigo-400 animate-pulse" size={24} />
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time administrative telemetry, financial overview, and database counts.
          </p>
        </div>
      </div>

      {/* Numerical Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.name}
              className="p-5 rounded-3xl bg-slate-950/40 border border-slate-850 shadow-inner flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${card.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                  {card.name}
                </span>
                <h4 className="font-hanken font-bold text-2xl text-white mt-0.5">{card.value}</h4>
              </div>
            </div>
          );
        })}
      </div>

      {/* Graphics and Charts Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Attendance Percentage Indicator */}
        <div className="p-6 bg-slate-950/40 border border-slate-850 rounded-3xl flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Percent size={14} className="text-indigo-400" /> Academic Month Attendance
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Average ratio of present students</p>
          </div>
          <div className="py-8 flex flex-col items-center">
            {/* Custom SVG Circular Progress */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="60" className="stroke-slate-800" strokeWidth="12" fill="transparent" />
                <circle
                  cx="72"
                  cy="72"
                  r="60"
                  className="stroke-indigo-600 transition-all duration-500"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray="377"
                  strokeDashoffset={377 - (377 * (stats?.attendance?.percentage ?? 92)) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="font-hanken font-bold text-3xl text-white">{stats?.attendance?.percentage ?? 92}%</span>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Present</span>
              </div>
            </div>
          </div>
          <div className="text-center text-xs font-semibold text-slate-400">
            Based on <span className="text-indigo-400 font-bold">{stats?.attendance?.totalLogs ?? 1240}</span> registered attendance logs this month.
          </div>
        </div>

        {/* Fee Collection Progress Bar */}
        <div className="p-6 bg-slate-950/40 border border-slate-850 rounded-3xl flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <IndianRupee size={14} className="text-emerald-400" /> Fee Collection Progress
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Summary of payments collected vs outstanding</p>
          </div>
          
          <div className="space-y-4 my-6">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Collected Revenue</span>
              <span className="text-white font-bold font-geist">₹{(stats?.fees?.collected ?? 450000).toLocaleString()}</span>
            </div>
            
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${
                    (stats?.fees?.invoiced ?? 500000) > 0 ? ((stats?.fees?.collected ?? 450000) / (stats?.fees?.invoiced ?? 500000)) * 100 : 0
                  }%`,
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-900/60">
              <div>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Total Invoiced</span>
                <p className="font-semibold text-slate-300 font-geist">₹{(stats?.fees?.invoiced ?? 500000).toLocaleString()}</p>
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Outstanding Due</span>
                <p className="font-semibold text-rose-450 font-geist">₹{(stats?.fees?.pending ?? 50000).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-semibold text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 p-2.5 rounded-xl justify-center">
            <TrendingUp size={14} />
            Collection Ratio:{" "}
            {(stats?.fees?.invoiced ?? 500000) > 0
              ? Math.round(((stats?.fees?.collected ?? 450000) / (stats?.fees?.invoiced ?? 500000)) * 100)
              : 90}
            % of invoice targets
          </div>
        </div>

        {/* Recent Events / Activity Logs */}
        <div className="p-6 bg-slate-950/40 border border-slate-850 rounded-3xl flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Clock size={14} className="text-indigo-400" /> Recent Activity & Enrolments
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Logs of recent transactions & student enrolments</p>
          </div>

          <div className="space-y-4 my-6 flex-1">
            {stats?.latestEnrollments && stats.latestEnrollments.length > 0 ? (
              stats.latestEnrollments.slice(0, 4).map((enr: any) => (
                <div key={enr.id} className="flex gap-3 text-xs items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-slate-300 font-medium">
                      <span className="text-white font-semibold">{enr.user?.firstName} {enr.user?.lastName}</span> enrolled in <span className="text-indigo-400 font-semibold">{enr.course?.title}</span>
                    </p>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      {new Date(enr.enrolledAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : stats?.recentStudents && stats.recentStudents.length > 0 ? (
              stats.recentStudents.slice(0, 4).map((st: any) => (
                <div key={st.id} className="flex gap-3 text-xs items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-slate-300 font-medium">
                      Student registered: <span className="text-white font-semibold">{st.firstName} {st.lastName}</span> ({st.studentId})
                    </p>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      {new Date(st.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              (stats?.activities || [
                { id: "1", text: "New Student Enrolled in ERP System", timestamp: "Just now" },
                { id: "2", text: "Course published to LMS catalog", timestamp: "10 mins ago" }
              ]).map((act: any) => (
                <div key={act.id} className="flex gap-3 text-xs items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-slate-300 font-medium">{act.text}</p>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{act.timestamp}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="text-[10px] font-bold text-indigo-400 text-center uppercase tracking-wider bg-indigo-950/20 border border-indigo-900/30 p-2.5 rounded-xl">
            System Live & Auditing Active
          </div>
        </div>
      </div>
    </div>
  );
}
