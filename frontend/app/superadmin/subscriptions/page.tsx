"use client";

import React, { useState } from "react";
import { useMockData, School } from "../../context/MockDataContext";
import { GlassCard } from "../../components/Card";
import {
  CreditCard,
  Calendar,
  Lock,
  Unlock,
  AlertCircle,
  Clock,
  RefreshCw,
  Search,
  CheckCircle,
  XCircle,
  Settings2,
  X,
} from "lucide-react";

export default function SubscriptionsPage() {
  const { schools, updateSchool, toggleSchoolStatus, addActivity } = useMockData();
  const [searchTerm, setSearchTerm] = useState("");

  // Modal and Form States
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [plan, setPlan] = useState<School["plan"]>("Pro");
  const [startDate, setStartDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [renewalStatus, setRenewalStatus] = useState<School["renewalStatus"]>("Auto-Renew");
  const [status, setStatus] = useState<School["status"]>("Active");

  // Calculations
  const activeSubs = schools.filter((s) => s.status === "Active");
  const monthlyMRR = activeSubs.reduce((sum, s) => sum + s.monthlyRevenue, 0);
  const suspendedSubs = schools.filter((s) => s.status === "Suspended").length;
  
  const now = new Date("2026-06-25");
  const expiringSoonCount = schools.filter((s) => {
    const exp = new Date(s.expiryDate);
    const diff = exp.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return s.status === "Active" && days > 0 && days <= 45;
  }).length;

  const handleOpenEdit = (school: School) => {
    setEditingSchool(school);
    setPlan(school.plan);
    setStartDate(school.startDate);
    setExpiryDate(school.expiryDate);
    setRenewalStatus(school.renewalStatus);
    setStatus(school.status);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSchool) return;

    const revenueMap = { Base: 600, Pro: 1450, Enterprise: 4200 };
    const updated: School = {
      ...editingSchool,
      plan,
      startDate,
      expiryDate,
      renewalStatus,
      status,
      monthlyRevenue: revenueMap[plan],
    };

    updateSchool(updated);
    setEditingSchool(null);
  };

  const handleRenew = (school: School) => {
    // Automatically extend contract by 1 year
    const exp = new Date(school.expiryDate);
    exp.setFullYear(exp.getFullYear() + 1);
    const extendedDate = exp.toISOString().split("T")[0];

    updateSchool({
      ...school,
      expiryDate: extendedDate,
      renewalStatus: "Auto-Renew",
    });

    addActivity(`Subscription for ${school.name} renewed until ${extendedDate}.`, "Finance");
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-hanken font-bold text-4xl text-on-surface tracking-tight">Subscription Controller</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Monitor recurring licensing profiles, customize billing dates, upgrade plans, and execute account locks/unlocks.
        </p>
      </div>

      {/* Subscription KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-5 rounded-2xl bg-white border border-outline-variant/30 shadow-premium flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-primary flex items-center justify-center border border-indigo-100">
            <CreditCard size={24} />
          </div>
          <div>
            <span className="text-[11px] font-geist font-semibold text-on-surface-variant uppercase tracking-wider">Total Monthly MRR</span>
            <h4 className="font-hanken font-bold text-2xl text-on-surface mt-0.5">${monthlyMRR.toLocaleString()}</h4>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-outline-variant/30 shadow-premium flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <CheckCircle size={24} />
          </div>
          <div>
            <span className="text-[11px] font-geist font-semibold text-on-surface-variant uppercase tracking-wider">Active Contracts</span>
            <h4 className="font-hanken font-bold text-2xl text-on-surface mt-0.5">{activeSubs.length}</h4>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-outline-variant/30 shadow-premium flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
            <XCircle size={24} />
          </div>
          <div>
            <span className="text-[11px] font-geist font-semibold text-on-surface-variant uppercase tracking-wider">Suspended / Inactive</span>
            <h4 className="font-hanken font-bold text-2xl text-on-surface mt-0.5">{suspendedSubs}</h4>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-outline-variant/30 shadow-premium flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <Clock size={24} />
          </div>
          <div>
            <span className="text-[11px] font-geist font-semibold text-on-surface-variant uppercase tracking-wider">Renewals Due (45d)</span>
            <h4 className="font-hanken font-bold text-2xl text-on-surface mt-0.5">{expiringSoonCount}</h4>
          </div>
        </div>
      </div>

      {/* Control panel & search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Search school subscriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs w-full bg-white border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Table grid */}
      <GlassCard className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-geist font-semibold text-slate-500 uppercase tracking-widest">
                <th className="py-4 px-6">School Details</th>
                <th className="py-4 px-4">Plan License</th>
                <th className="py-4 px-4">Billing Rate</th>
                <th className="py-4 px-4">Contract Dates</th>
                <th className="py-4 px-4">Renewal Mode</th>
                <th className="py-4 px-4">Account Status</th>
                <th className="py-4 px-6 text-right">Settings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/70 text-sm text-slate-700">
              {schools
                .filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((s) => {
                  const isExpiring = (() => {
                    const exp = new Date(s.expiryDate);
                    const diff = exp.getTime() - now.getTime();
                    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
                    return s.status === "Active" && days > 0 && days <= 45;
                  })();

                  return (
                    <tr key={s.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-primary text-xs">
                            {s.logo}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 leading-snug">{s.name}</p>
                            <span className="text-[10px] font-geist text-slate-400 block mt-0.5">{s.adminEmail}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`text-[10px] font-bold font-geist px-2 py-0.5 rounded-full ${
                          s.plan === "Enterprise"
                            ? "bg-purple-50 text-purple-600 border border-purple-100"
                            : s.plan === "Pro"
                            ? "bg-blue-50 text-blue-600 border border-blue-100"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}>
                          {s.plan.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-geist font-bold text-slate-900">
                        ${s.monthlyRevenue}/mo
                      </td>
                      <td className="py-4 px-4 text-xs font-semibold text-slate-600">
                        <div className="flex items-center gap-1.5 text-slate-500 font-normal">
                          <span>{s.startDate}</span>
                          <span>→</span>
                          <span className={`${isExpiring ? "text-rose-600 font-bold" : "text-slate-700"}`}>
                            {s.expiryDate}
                          </span>
                        </div>
                        {isExpiring && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-rose-500 font-geist mt-1 uppercase tracking-wider animate-pulse">
                            <AlertCircle size={10} /> Contract Expiring Soon
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1 text-xs font-medium text-slate-700">
                          <RefreshCw size={12} className={s.renewalStatus === "Auto-Renew" ? "text-indigo-500" : "text-slate-400"} />
                          {s.renewalStatus}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full border ${
                          s.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : "bg-rose-50 text-rose-700 border-rose-100"
                        }`}>
                          <span className={`w-1 h-1 rounded-full ${s.status === "Active" ? "bg-emerald-500" : "bg-rose-500"}`} />
                          {s.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => toggleSchoolStatus(s.id)}
                            title={s.status === "Active" ? "Suspend Account" : "Activate Account"}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              s.status === "Active"
                                ? "text-rose-600 bg-rose-50 hover:bg-rose-100 border-rose-200"
                                : "text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border-emerald-200"
                            }`}
                          >
                            {s.status === "Active" ? <Lock size={13} /> : <Unlock size={13} />}
                          </button>
                          {isExpiring && (
                            <button
                              onClick={() => handleRenew(s)}
                              className="text-xs font-bold text-indigo-600 hover:text-white hover:bg-indigo-600 px-3 py-1.5 rounded-lg border border-indigo-200 transition-colors"
                            >
                              Renew Contract
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenEdit(s)}
                            className="p-1.5 text-slate-600 hover:text-primary bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors"
                          >
                            <Settings2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Edit Modal */}
      {editingSchool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden glass-modal border border-white/50 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-200">
              <h3 className="font-hanken font-bold text-lg text-slate-900">Manage Licensing Profile</h3>
              <button
                onClick={() => setEditingSchool(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold font-geist text-slate-500 uppercase tracking-wider mb-1.5">Institution</label>
                <p className="text-sm font-bold text-slate-800">{editingSchool.name}</p>
              </div>

              <div>
                <label className="block text-xs font-bold font-geist text-slate-500 uppercase tracking-wider mb-1.5">Subscription Tier</label>
                <select
                  value={plan}
                  onChange={(e) => setPlan(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Base">Base ($600/mo)</option>
                  <option value="Pro">Pro ($1,450/mo)</option>
                  <option value="Enterprise">Enterprise ($4,200/mo)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold font-geist text-slate-500 uppercase tracking-wider mb-1.5">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold font-geist text-slate-500 uppercase tracking-wider mb-1.5">Contract Expiry</label>
                  <input
                    type="date"
                    required
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold font-geist text-slate-500 uppercase tracking-wider mb-1.5">Billing Mode</label>
                <select
                  value={renewalStatus}
                  onChange={(e) => setRenewalStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Auto-Renew">Auto-Renew</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold font-geist text-slate-500 uppercase tracking-wider mb-1.5">Account Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingSchool(null)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-container shadow-premium transition-colors"
                >
                  Save Licensing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
