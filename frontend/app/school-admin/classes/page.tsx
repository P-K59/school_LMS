"use client";

import React, { useState, useEffect } from "react";
import { api } from "../../lib/api";
import { Plus, Settings, Layers, Calendar, HelpCircle, Sparkles, FolderPlus } from "lucide-react";

export default function ClassesSetupPage() {
  const [years, setYears] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  
  // Forms states
  const [yearName, setYearName] = useState("2026-27");
  const [yearStart, setYearStart] = useState("2026-06-01");
  const [yearEnd, setYearEnd] = useState("2027-05-31");
  
  const [className, setClassName] = useState("");
  const [classDesc, setClassDesc] = useState("");
  const [classYearId, setClassYearId] = useState("");
  
  const [sectionName, setSectionName] = useState("");
  const [sectionClassId, setSectionClassId] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const yearsRes = await api.get("/school-admin/academic-years");
      const classesRes = await api.get("/school-admin/classes");
      
      setYears(yearsRes.data || []);
      setClasses(classesRes.data || []);

      if (yearsRes.data && yearsRes.data.length > 0) {
        // Select active or first year as default for new classes
        const currentYear = yearsRes.data.find((y: any) => y.isCurrent) || yearsRes.data[0];
        setClassYearId(currentYear.id);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load database setup records.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateYear = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/school-admin/academic-years", {
        name: yearName,
        startDate: yearStart,
        endDate: yearEnd,
        isCurrent: true,
      });
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!className || !classYearId) return;
    try {
      await api.post("/school-admin/classes", {
        name: className,
        description: classDesc,
        academicYearId: classYearId,
      });
      setClassName("");
      setClassDesc("");
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionName || !sectionClassId) return;
    try {
      await api.post("/school-admin/sections", {
        name: sectionName,
        classId: sectionClassId,
      });
      setSectionName("");
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="font-hanken font-bold text-4xl text-white tracking-tight flex items-center gap-3">
          <Settings className="text-indigo-500 animate-spin-slow" /> System Setup & Classes
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Configure the base parameters of your academic institution.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/30 border border-rose-900/50 rounded-2xl text-rose-450 text-xs font-semibold">
          Error: {error}
        </div>
      )}

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left panel: Add operations */}
          <div className="space-y-6 lg:col-span-1">
            
            {/* Create Academic Year */}
            <div className="p-6 bg-slate-950/60 border border-slate-800 rounded-3xl backdrop-blur-md">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Calendar size={16} className="text-indigo-400" /> Define Academic Session
              </h3>
              <form onSubmit={handleCreateYear} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Session Name</label>
                  <input
                    type="text"
                    required
                    value={yearName}
                    onChange={(e) => setYearName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Start Date</label>
                    <input
                      type="date"
                      required
                      value={yearStart}
                      onChange={(e) => setYearStart(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">End Date</label>
                    <input
                      type="date"
                      required
                      value={yearEnd}
                      onChange={(e) => setYearEnd(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-2 px-3 text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus size={14} /> Establish Session
                </button>
              </form>
            </div>

            {/* Create Class */}
            <div className="p-6 bg-slate-950/60 border border-slate-800 rounded-3xl backdrop-blur-md">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Layers size={16} className="text-indigo-400" /> Create Grade Class
              </h3>
              <form onSubmit={handleCreateClass} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Select Session</label>
                  <select
                    value={classYearId}
                    onChange={(e) => setClassYearId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    {years.map((y) => (
                      <option key={y.id} value={y.id}>
                        {y.name} {y.isCurrent && "(Current)"}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Class Grade Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grade 5"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Description</label>
                  <input
                    type="text"
                    placeholder="Primary division"
                    value={classDesc}
                    onChange={(e) => setClassDesc(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={years.length === 0}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-2 px-3 text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40"
                >
                  <Plus size={14} /> Add Grade Class
                </button>
              </form>
            </div>

            {/* Create Section */}
            <div className="p-6 bg-slate-950/60 border border-slate-800 rounded-3xl backdrop-blur-md">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <FolderPlus size={16} className="text-indigo-400" /> Create Class Section
              </h3>
              <form onSubmit={handleCreateSection} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Target Class</label>
                  <select
                    value={sectionClassId}
                    onChange={(e) => setSectionClassId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">-- Choose Class --</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Section Code / Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Section A"
                    value={sectionName}
                    onChange={(e) => setSectionName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={classes.length === 0 || !sectionClassId}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-2 px-3 text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40"
                >
                  <Plus size={14} /> Create Section
                </button>
              </form>
            </div>
          </div>

          {/* Right panel: Listing of registered structure */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Active Academic Session details */}
            <div className="p-6 bg-slate-950/60 border border-slate-800 rounded-3xl backdrop-blur-md">
              <h3 className="text-sm font-bold text-white mb-4">Academic Sessions</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-2.5">Session Name</th>
                      <th className="py-2.5">Date Range</th>
                      <th className="py-2.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 text-slate-300">
                    {years.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center py-6 text-slate-500">No sessions configured.</td>
                      </tr>
                    ) : (
                      years.map((y) => (
                        <tr key={y.id}>
                          <td className="py-3 font-semibold text-white">{y.name}</td>
                          <td className="py-3 font-geist">
                            {new Date(y.startDate).toLocaleDateString()} to {new Date(y.endDate).toLocaleDateString()}
                          </td>
                          <td className="py-3 text-right">
                            {y.isCurrent ? (
                              <span className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-450 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                Active Current
                              </span>
                            ) : (
                              <span className="bg-slate-800 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                Legacy
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* School Curriculum Tree */}
            <div className="p-6 bg-slate-950/60 border border-slate-800 rounded-3xl backdrop-blur-md">
              <h3 className="text-sm font-bold text-white mb-4">Curriculum Divisions (Classes & Sections)</h3>
              {classes.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs border border-dashed border-slate-800 rounded-2xl">
                  No classes registered. Register a class on the left to initialize database records.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {classes.map((c) => (
                    <div key={c.id} className="p-4 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-slate-700 transition-all">
                      <div className="flex items-start justify-between pb-3 border-b border-slate-800/80">
                        <div>
                          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Layers size={14} className="text-indigo-400" /> {c.name}
                          </h4>
                          <span className="text-[10px] text-slate-500 block mt-0.5">{c.description || "No description"}</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Sections</span>
                        <div className="flex flex-wrap gap-1.5">
                          {c.sections.length === 0 ? (
                            <span className="text-[10px] text-slate-600 font-medium italic">No sections created</span>
                          ) : (
                            c.sections.map((sec: any) => (
                              <span
                                key={sec.id}
                                className="bg-slate-800 border border-slate-750 text-slate-350 text-[10px] font-semibold px-2 py-1 rounded-lg"
                              >
                                {sec.name}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
