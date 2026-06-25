"use client";

import React, { useState } from "react";
import { useMockData, PricingCustomization } from "../../context/MockDataContext";
import { GlassCard } from "../../components/Card";
import { DollarSign, Plus, Trash2, ShieldAlert, Award, Search, Info } from "lucide-react";

export default function PricingPage() {
  const {
    schools,
    courses,
    pricingCustomizations,
    setCustomPricing,
    removeCustomPricing,
  } = useMockData();

  // Form State
  const [selectedSchoolId, setSelectedSchoolId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [customPrice, setCustomPrice] = useState(499);
  
  // Search State
  const [searchSchool, setSearchSchool] = useState("");

  // Handlers
  const handleSetPricing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchoolId || !selectedCourseId || !customPrice) return;

    setCustomPricing(selectedSchoolId, selectedCourseId, customPrice);
    
    // Reset Form
    setSelectedSchoolId("");
    setSelectedCourseId("");
    setCustomPrice(499);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-hanken font-bold text-4xl text-on-surface tracking-tight">Institutional Pricing Matrix</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Configure custom course price levels for specific schools to accommodate regional agreements and enterprise contracts.
        </p>
      </div>

      {/* Grid: Form (left) & Current Custom Pricing (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Set Custom Price Form */}
        <div className="space-y-6">
          <GlassCard className="h-full">
            <h3 className="font-hanken font-bold text-lg text-slate-800 mb-4 flex items-center gap-1.5">
              <DollarSign size={18} className="text-primary" /> Create Price Override
            </h3>
            
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Select an active school administrative account and a platform-wide course to override default course pricing models.
            </p>

            <form onSubmit={handleSetPricing} className="space-y-4">
              <div>
                <label className="block text-xs font-bold font-geist text-slate-500 uppercase tracking-wider mb-1.5">Select Institution</label>
                <select
                  required
                  value={selectedSchoolId}
                  onChange={(e) => setSelectedSchoolId(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">-- Choose School --</option>
                  {schools.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.plan} Plan)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold font-geist text-slate-500 uppercase tracking-wider mb-1.5">Select Course</label>
                <select
                  required
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">-- Choose Course --</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} (Default: ₹{c.defaultPrice})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold font-geist text-slate-500 uppercase tracking-wider mb-1.5">Custom Price Override (INR)</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={customPrice}
                  onChange={(e) => setCustomPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <button
                type="submit"
                disabled={!selectedSchoolId || !selectedCourseId || !customPrice}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-container disabled:opacity-40 disabled:cursor-not-allowed shadow-premium transition-colors mt-2"
              >
                Apply Custom Pricing
              </button>
            </form>
          </GlassCard>
        </div>

        {/* Custom Pricing Grid Matrix */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="h-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-hanken font-bold text-lg text-slate-800">Custom Price Overrides</h3>
                <p className="text-xs text-slate-400 font-medium">Currently active custom pricing profiles</p>
              </div>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search school name..."
                  value={searchSchool}
                  onChange={(e) => setSearchSchool(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Pricing Override Details */}
            <div className="space-y-4">
              {schools
                .filter((s) => s.name.toLowerCase().includes(searchSchool.toLowerCase()))
                .map((s) => {
                  // Find all customizations for this school
                  const customizationsForSchool = pricingCustomizations.filter((p) => p.schoolId === s.id);
                  
                  return (
                    <div key={s.id} className="p-4.5 rounded-xl border border-slate-200/80 bg-slate-50/30 space-y-3.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                          <h4 className="text-sm font-bold text-slate-800">{s.name}</h4>
                          <span className="text-[10px] font-semibold font-geist text-slate-400 uppercase tracking-widest">{s.plan}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-geist">ID: {s.id}</span>
                      </div>

                      {/* Course lists */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {courses.map((c) => {
                          const override = customizationsForSchool.find((p) => p.courseId === c.id);
                          return (
                            <div key={c.id} className="bg-white p-3 rounded-lg border border-slate-150 flex items-center justify-between shadow-sm">
                              <div className="min-w-0 flex-1 pr-3">
                                <p className="text-xs font-bold text-slate-700 truncate leading-snug">{c.title}</p>
                                <span className="text-[10px] text-slate-400 font-geist block mt-0.5">Base Price: ₹{c.defaultPrice}</span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                {override ? (
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                                      ₹{override.customPrice}
                                    </span>
                                    <button
                                      onClick={() => removeCustomPricing(s.id, c.id)}
                                      title="Reset to default price"
                                      className="p-1 rounded text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors border border-transparent hover:border-rose-100"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                                    ₹{c.defaultPrice} (Default)
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
}
