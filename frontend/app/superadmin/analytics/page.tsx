"use client";

import React, { useState, useEffect } from "react";
import { useMockData } from "../../context/MockDataContext";
import { GlassCard, KPICard } from "../../components/Card";
import { BarChart3, TrendingUp, Users, BookOpen, GraduationCap, Percent, Award } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function AnalyticsPage() {
  const { schools, courses } = useMockData();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculation summaries
  const totalSchools = schools.length;
  const totalStudents = schools.reduce((sum, s) => sum + s.studentCount, 0);
  
  // Plan counts
  const planStats = {
    Base: schools.filter(s => s.plan === "Base").length,
    Pro: schools.filter(s => s.plan === "Pro").length,
    Enterprise: schools.filter(s => s.plan === "Enterprise").length,
  };

  const revenueMap = { Base: 600, Pro: 1450, Enterprise: 4200 };
  
  const enterpriseRevenue = planStats.Enterprise * revenueMap.Enterprise;
  const proRevenue = planStats.Pro * revenueMap.Pro;
  const baseRevenue = planStats.Base * revenueMap.Base;
  const totalRevenue = enterpriseRevenue + proRevenue + baseRevenue;

  const mrrData = [
    { name: "Enterprise Tier", value: enterpriseRevenue, color: "#4f46e5", bgClass: "bg-primary-container" },
    { name: "Pro Tier", value: proRevenue, color: "#39b8fd", bgClass: "bg-secondary-container" },
    { name: "Base Tier", value: baseRevenue, color: "#516177", bgClass: "bg-tertiary-container" },
  ];

  const getPercentage = (value: number) => {
    if (totalRevenue === 0) return "0.0%";
    return ((value / totalRevenue) * 100).toFixed(1) + "%";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-hanken font-bold text-4xl text-on-surface tracking-tight">Platform Analytics</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Detailed metrics overview tracking global institutional activity, revenue distributions, and curriculum engagement.
        </p>
      </div>

      {/* KPI Cards row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard
          title="Avg Course Completion"
          value="74.2%"
          subtext="across all schools"
          trend={{ value: "+2.4%", isPositive: true }}
          icon={<Percent size={20} />}
          variant="default"
        />
        <KPICard
          title="Avg Quiz Score"
          value="82/100"
          subtext="platform-wide average"
          trend={{ value: "+4.1%", isPositive: true }}
          icon={<Award size={20} />}
          variant="indigo"
        />
        <KPICard
          title="Student Engagements"
          value="18,432"
          subtext="active logins today"
          trend={{ value: "+8%", isPositive: true }}
          icon={<Users size={20} />}
          variant="blue"
        />
        <KPICard
          title="Course Count"
          value={courses.length.toString()}
          subtext="live lessons in system"
          trend={{ value: "Operational", isPositive: true }}
          icon={<BookOpen size={20} />}
          variant="emerald"
        />
      </div>

      {/* Analytical Visuals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Revenue Share Pie Chart */}
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-hanken font-bold text-lg text-slate-800">MRR Distribution</h3>
              <p className="text-xs text-slate-400 font-medium">Revenue allocation per subscription tier</p>
            </div>
            <span className="text-sm font-bold text-slate-700">Total: ${totalRevenue.toLocaleString()}/mo</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-4">
            {/* Recharts Pie (Donut) Chart */}
            <div className="w-40 h-40 flex items-center justify-center">
              {!mounted ? (
                <div className="w-32 h-32 rounded-full border-8 border-slate-100 border-t-indigo-600 animate-spin" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mrrData}
                      cx="50%"
                      cy="50%"
                      innerRadius={38}
                      outerRadius={52}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {mrrData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any) => [`$${value.toLocaleString()}`, "Revenue"]}
                      contentStyle={{ 
                        background: "rgba(255, 255, 255, 0.95)", 
                        border: "1px solid rgba(228, 225, 238, 0.8)", 
                        borderRadius: "12px", 
                        fontSize: "12px",
                        boxShadow: "0 10px 25px -5px rgba(77, 68, 227, 0.1)"
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="space-y-3.5 w-full sm:w-auto">
              {mrrData.map((entry, idx) => (
                <div key={idx} className="flex items-center justify-between gap-6">
                  <span className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                    <span className={`w-3 h-3 rounded ${entry.bgClass}`} /> {entry.name}
                  </span>
                  <strong className="text-xs text-slate-800 font-geist">{getPercentage(entry.value)}</strong>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Quiz Performance analytics */}
        <GlassCard>
          <div>
            <h3 className="font-hanken font-bold text-lg text-slate-800">Quiz Grade Distribution</h3>
            <p className="text-xs text-slate-400 font-medium mb-6">Student marks allocation percentages</p>
          </div>

          <div className="space-y-4">
            {[
              { label: "Grade A (90-100)", percentage: 38, color: "bg-indigo-600" },
              { label: "Grade B (80-89)", percentage: 44, color: "bg-blue-500" },
              { label: "Grade C (70-79)", percentage: 12, color: "bg-emerald-500" },
              { label: "Grade D & Under (Below 70)", percentage: 6, color: "bg-slate-400" },
            ].map((grade) => (
              <div key={grade.label} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{grade.label}</span>
                  <span className="font-geist">{grade.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`${grade.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${grade.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

      </div>
    </div>
  );
}
