"use client";

import React, { useState } from "react";
import { useMockData, School } from "../../context/MockDataContext";
import { GlassCard } from "../../components/Card";
import {
  Search,
  Plus,
  Edit2,
  Lock,
  Unlock,
  Users,
  CreditCard,
  Building2,
  X,
} from "lucide-react";

export default function SchoolsPage() {
  const { schools, addSchool, updateSchool, toggleSchoolStatus } = useMockData();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Suspended">("All");

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  // Form States
  const [name, setName] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [plan, setPlan] = useState<"Base" | "Pro" | "Enterprise">("Pro");
  const [startDate, setStartDate] = useState("2026-06-25");
  const [expiryDate, setExpiryDate] = useState("2027-06-25");
  const [renewalStatus, setRenewalStatus] = useState<"Auto-Renew" | "Manual">("Auto-Renew");
  const [studentCount, setStudentCount] = useState(150);

  // Statistics
  const totalSchools = schools.length;
  const totalStudents = schools.reduce((sum, s) => sum + s.studentCount, 0);
  const enterpriseCount = schools.filter((s) => s.plan === "Enterprise").length;

  // Handlers
  const handleOpenAddModal = () => {
    setName("");
    setAdminName("");
    setAdminEmail("");
    setPlan("Pro");
    setStartDate("2026-06-25");
    setExpiryDate("2027-06-25");
    setRenewalStatus("Auto-Renew");
    setStudentCount(100);
    setIsAddModalOpen(true);
  };

  const handleAddSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !adminName || !adminEmail) return;

    addSchool({
      name,
      logo: name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2),
      adminName,
      adminEmail,
      plan,
      startDate,
      expiryDate,
      renewalStatus: renewalStatus as any,
      status: "Active",
      studentCount,
    });

    setIsAddModalOpen(false);
  };

  const handleOpenEditModal = (school: School) => {
    setSelectedSchool(school);
    setName(school.name);
    setAdminName(school.adminName);
    setAdminEmail(school.adminEmail);
    setPlan(school.plan);
    setStartDate(school.startDate);
    setExpiryDate(school.expiryDate);
    setRenewalStatus(school.renewalStatus as any);
    setStudentCount(school.studentCount);
    setIsEditModalOpen(true);
  };

  const handleEditSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchool || !name || !adminName || !adminEmail) return;

    updateSchool({
      ...selectedSchool,
      name,
      adminName,
      adminEmail,
      plan,
      startDate,
      expiryDate,
      renewalStatus: renewalStatus as any,
      studentCount,
    });

    setIsEditModalOpen(false);
    setSelectedSchool(null);
  };

  // Filter logic
  const filteredSchools = schools.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.adminEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || s.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-hanken font-bold text-4xl text-on-surface tracking-tight">
            Registered Institutions
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Manage and monitor all school entities in your ecosystem.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-container shadow-premium transition-all duration-200"
        >
          <Plus size={16} /> Add School
        </button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-white border border-outline-variant/30 shadow-premium flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-primary flex items-center justify-center border border-indigo-100">
            <Building2 size={24} />
          </div>
          <div>
            <span className="text-[11px] font-geist font-semibold text-on-surface-variant uppercase tracking-wider">Total Institutions</span>
            <h4 className="font-hanken font-bold text-2xl text-on-surface mt-0.5">{totalSchools}</h4>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-outline-variant/30 shadow-premium flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <Users size={24} />
          </div>
          <div>
            <span className="text-[11px] font-geist font-semibold text-on-surface-variant uppercase tracking-wider">Total Enrolled Students</span>
            <h4 className="font-hanken font-bold text-2xl text-on-surface mt-0.5">{totalStudents.toLocaleString()}</h4>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-outline-variant/30 shadow-premium flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <CreditCard size={24} />
          </div>
          <div>
            <span className="text-[11px] font-geist font-semibold text-on-surface-variant uppercase tracking-wider">Enterprise Subscriptions</span>
            <h4 className="font-hanken font-bold text-2xl text-on-surface mt-0.5">{enterpriseCount}</h4>
          </div>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search by school name, admin or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-300 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <div className="flex items-center gap-2 self-stretch md:self-auto">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap hidden sm:inline">Filter Status:</span>
          {["All", "Active", "Suspended"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status as any)}
              className={`flex-1 sm:flex-initial text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-200 ${
                statusFilter === status
                  ? "bg-white text-primary border border-primary/20 shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 border border-transparent"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Schools Table Card */}
      <GlassCard className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-geist font-semibold text-slate-500 uppercase tracking-widest">
                <th className="py-4 px-6">School Name</th>
                <th className="py-4 px-4">Admin Owner</th>
                <th className="py-4 px-4">Plan / Revenue</th>
                <th className="py-4 px-4">Students</th>
                <th className="py-4 px-4">Contract Expiry</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/70 text-sm text-slate-700">
              {filteredSchools.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 font-medium">
                    No institutions matches the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredSchools.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="py-4.5 px-6 font-semibold text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-primary font-bold text-xs">
                          {s.logo}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 leading-snug">{s.name}</p>
                          <span className="text-[10px] font-geist text-slate-400 uppercase tracking-widest">{s.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4.5 px-4">
                      <div>
                        <p className="font-semibold text-slate-800 leading-none">{s.adminName}</p>
                        <span className="text-xs text-slate-500 mt-1 block">{s.adminEmail}</span>
                      </div>
                    </td>
                    <td className="py-4.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold font-geist px-2 py-0.5 rounded-full ${
                          s.plan === "Enterprise"
                            ? "bg-purple-50 text-purple-600 border border-purple-100"
                            : s.plan === "Pro"
                            ? "bg-blue-50 text-blue-600 border border-blue-100"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}>
                          {s.plan.toUpperCase()}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          ${s.monthlyRevenue}/mo
                        </span>
                      </div>
                    </td>
                    <td className="py-4.5 px-4 font-geist font-medium text-slate-900">
                      {s.studentCount.toLocaleString()}
                    </td>
                    <td className="py-4.5 px-4 text-xs font-medium text-slate-600">
                      <div>
                        <p>{s.expiryDate}</p>
                        <span className="text-[10px] font-geist text-slate-400 mt-0.5 block">{s.renewalStatus}</span>
                      </div>
                    </td>
                    <td className="py-4.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                        s.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : "bg-rose-50 text-rose-700 border-rose-100"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.status === "Active" ? "bg-emerald-500" : "bg-rose-500"}`} />
                        {s.status}
                      </span>
                    </td>
                    <td className="py-4.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          onClick={() => toggleSchoolStatus(s.id)}
                          title={s.status === "Active" ? "Suspend Account" : "Activate Account"}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            s.status === "Active"
                              ? "text-rose-600 bg-rose-50 hover:bg-rose-100 border-rose-200"
                              : "text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border-emerald-200"
                          }`}
                        >
                          {s.status === "Active" ? <Lock size={15} /> : <Unlock size={15} />}
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(s)}
                          title="Edit Parameters"
                          className="p-1.5 text-slate-600 hover:text-primary bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors"
                        >
                          <Edit2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Add School Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden glass-modal border border-white/50 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-200">
              <h3 className="font-hanken font-bold text-lg text-slate-900">Add New Institution</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddSchool} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold font-geist text-slate-500 uppercase tracking-wider mb-1.5">School Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Greenwood Academy"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold font-geist text-slate-500 uppercase tracking-wider mb-1.5">Admin Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold font-geist text-slate-500 uppercase tracking-wider mb-1.5">Admin Email</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. j.doe@greenwood.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold font-geist text-slate-500 uppercase tracking-wider mb-1.5">Subscription Plan</label>
                  <select
                    value={plan}
                    onChange={(e) => setPlan(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                  >
                    <option value="Base">Base ($600/mo)</option>
                    <option value="Pro">Pro ($1,450/mo)</option>
                    <option value="Enterprise">Enterprise ($4,200/mo)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold font-geist text-slate-500 uppercase tracking-wider mb-1.5">Initial Students</label>
                  <input
                    type="number"
                    min={1}
                    value={studentCount}
                    onChange={(e) => setStudentCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold font-geist text-slate-500 uppercase tracking-wider mb-1.5">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold font-geist text-slate-500 uppercase tracking-wider mb-1.5">Contract Expiry</label>
                  <input
                    type="date"
                    required
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold font-geist text-slate-500 uppercase tracking-wider mb-1.5">Renewal Billing Mode</label>
                <div className="flex gap-4">
                  {["Auto-Renew", "Manual"].map((mode) => (
                    <label key={mode} className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="renewalStatus"
                        checked={renewalStatus === mode}
                        onChange={() => setRenewalStatus(mode as any)}
                        className="text-primary focus:ring-primary border-slate-300"
                      />
                      {mode}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-container shadow-premium transition-colors"
                >
                  Add School
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit School Modal */}
      {isEditModalOpen && selectedSchool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden glass-modal border border-white/50 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-200">
              <h3 className="font-hanken font-bold text-lg text-slate-900">Edit Institution Parameters</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleEditSchool} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold font-geist text-slate-500 uppercase tracking-wider mb-1.5">School Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold font-geist text-slate-500 uppercase tracking-wider mb-1.5">Admin Name</label>
                  <input
                    type="text"
                    required
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold font-geist text-slate-500 uppercase tracking-wider mb-1.5">Admin Email</label>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold font-geist text-slate-500 uppercase tracking-wider mb-1.5">Subscription Plan</label>
                  <select
                    value={plan}
                    onChange={(e) => setPlan(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                  >
                    <option value="Base">Base ($600/mo)</option>
                    <option value="Pro">Pro ($1,450/mo)</option>
                    <option value="Enterprise">Enterprise ($4,200/mo)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold font-geist text-slate-500 uppercase tracking-wider mb-1.5">Students Registered</label>
                  <input
                    type="number"
                    min={1}
                    value={studentCount}
                    onChange={(e) => setStudentCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold font-geist text-slate-500 uppercase tracking-wider mb-1.5">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold font-geist text-slate-500 uppercase tracking-wider mb-1.5">Contract Expiry</label>
                  <input
                    type="date"
                    required
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold font-geist text-slate-500 uppercase tracking-wider mb-1.5">Renewal Billing Mode</label>
                <div className="flex gap-4">
                  {["Auto-Renew", "Manual"].map((mode) => (
                    <label key={mode} className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="renewalStatus"
                        checked={renewalStatus === mode}
                        onChange={() => setRenewalStatus(mode as any)}
                        className="text-primary focus:ring-primary border-slate-300"
                      />
                      {mode}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-container shadow-premium transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
