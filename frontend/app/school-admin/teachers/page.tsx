"use client";

import React, { useState, useEffect } from "react";
import { api } from "../../lib/api";
import { Users, Plus, Search, X, CheckSquare, Square, Mail, Phone, Calendar } from "lucide-react";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeSubjectMappingTeacher, setActiveSubjectMappingTeacher] = useState<any | null>(null);

  // Single Register Form
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [designation, setDesignation] = useState("PGT Computer Science");
  const [qualification, setQualification] = useState("MCA, B.Ed");
  const [salary, setSalary] = useState("45000");
  const [joiningDate, setJoiningDate] = useState("2026-06-01");
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);

  // Mapping Form
  const [mappedSubjectIds, setMappedSubjectIds] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const teachersRes = await api.get("/school-admin/teachers");
      const subjectsRes = await api.get("/school-admin/subjects");
      setTeachers(teachersRes.data || []);
      setSubjects(subjectsRes.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load teacher records.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const payload = {
        firstName,
        lastName,
        email,
        phone: phone || undefined,
        employeeCode: employeeCode || undefined,
        designation,
        qualification,
        salary: salary ? Number(salary) : undefined,
        joiningDate: joiningDate || undefined,
        subjectIds: selectedSubjectIds,
      };

      await api.post("/school-admin/teachers", payload);
      setIsAddModalOpen(false);
      // Reset form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setEmployeeCode("");
      setSelectedSubjectIds([]);
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const toggleSubjectInRegisterForm = (subId: string) => {
    setSelectedSubjectIds((prev) =>
      prev.includes(subId) ? prev.filter((id) => id !== subId) : [...prev, subId]
    );
  };

  const toggleSubjectInMappingForm = (subId: string) => {
    setMappedSubjectIds((prev) =>
      prev.includes(subId) ? prev.filter((id) => id !== subId) : [...prev, subId]
    );
  };

  const handleOpenMappingModal = (teacher: any) => {
    setActiveSubjectMappingTeacher(teacher);
    const assignedIds = teacher.teacherSubjects.map((ts: any) => ts.subjectId);
    setMappedSubjectIds(assignedIds);
  };

  const handleSaveSubjectMapping = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubjectMappingTeacher) return;
    setError(null);

    try {
      await api.post("/school-admin/teachers/assign-subjects", {
        teacherId: activeSubjectMappingTeacher.id,
        subjectIds: mappedSubjectIds,
      });
      setActiveSubjectMappingTeacher(null);
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const filteredTeachers = teachers.filter((t) => {
    const fullName = `${t.firstName} ${t.lastName}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      t.employeeCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-hanken font-bold text-4xl text-white tracking-tight flex items-center gap-3">
            <Users className="text-indigo-500" /> Teacher Accounts
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage professional teacher profiles, track class assignments, and manage subjects.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-premium"
        >
          <Plus size={14} /> Add Teacher
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/30 border border-rose-900/50 rounded-2xl text-rose-455 text-xs font-semibold">
          Error: {error}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between gap-4 p-4 bg-slate-950/40 border border-slate-850 rounded-2xl">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
          <input
            type="text"
            placeholder="Search by teacher name or employee ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Teachers Grid */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredTeachers.length === 0 ? (
        <div className="text-center py-20 text-slate-500 text-sm border border-dashed border-slate-850 rounded-3xl">
          No teacher records registered. Click Add Teacher to create accounts.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-3xl border border-slate-850 bg-slate-950/40 hover:border-slate-800 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 pb-4 border-b border-slate-900 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
                    {t.firstName[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">
                      {t.firstName} {t.lastName}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-geist block">{t.employeeCode}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-400">
                  <p className="flex items-center gap-2">
                    <Mail size={12} className="text-slate-550" /> {t.user?.email || "No email"}
                  </p>
                  {t.phone && (
                    <p className="flex items-center gap-2">
                      <Phone size={12} className="text-slate-550" /> {t.phone}
                    </p>
                  )}
                  <p className="flex items-center gap-2">
                    <Calendar size={12} className="text-slate-550" /> Joined{" "}
                    {new Date(t.joiningDate).toLocaleDateString()}
                  </p>
                  <div className="pt-2">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
                      Qualifications
                    </span>
                    <p className="text-slate-300 font-semibold">{t.qualification}</p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-900">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-2">
                    Assigned Subjects
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {t.teacherSubjects.length === 0 ? (
                      <span className="text-[10px] text-slate-600 font-medium italic">No subjects mapped</span>
                    ) : (
                      t.teacherSubjects.map((ts: any) => (
                        <span
                          key={ts.id}
                          className="bg-slate-900 border border-slate-800 text-slate-350 text-[9px] px-2 py-0.5 rounded-md"
                        >
                          {ts.subject.name}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-900 flex justify-end">
                <button
                  onClick={() => handleOpenMappingModal(t)}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 text-indigo-400 rounded-xl text-[10px] font-bold cursor-pointer"
                >
                  Map Subjects
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Teacher Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-350">
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-900">
              <h3 className="font-hanken font-bold text-lg text-white">Enroll Professional Teacher</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-500 hover:text-white rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleRegisterTeacher} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Employee ID / Code</label>
                  <input
                    type="text"
                    placeholder="EMP-1002"
                    value={employeeCode}
                    onChange={(e) => setEmployeeCode(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Monthly Salary (INR)</label>
                  <input
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Email ID</label>
                  <input
                    type="email"
                    required
                    placeholder="teacher@school.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Phone Contact</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Joining Date</label>
                  <input
                    type="date"
                    value={joiningDate}
                    onChange={(e) => setJoiningDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Professional Qualification</label>
                <input
                  type="text"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Subject Mapping check grid */}
              <div className="pt-2">
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Subject Scope Assignment</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {subjects.map((sub) => {
                    const isChecked = selectedSubjectIds.includes(sub.id);
                    return (
                      <div
                        key={sub.id}
                        onClick={() => toggleSubjectInRegisterForm(sub.id)}
                        className={`p-3 rounded-2xl border flex items-center gap-2 cursor-pointer transition-all select-none ${
                          isChecked
                            ? "bg-indigo-600/10 border-indigo-500/35 text-indigo-400"
                            : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {isChecked ? <CheckSquare size={14} /> : <Square size={14} />}
                        <span className="text-[11px] font-semibold">{sub.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-900">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-premium"
                >
                  Enroll Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mapping Subjects Modal */}
      {activeSubjectMappingTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-350">
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-900">
              <h3 className="font-hanken font-bold text-lg text-white">
                Map Subjects: {activeSubjectMappingTeacher.firstName}
              </h3>
              <button
                onClick={() => setActiveSubjectMappingTeacher(null)}
                className="p-1.5 text-slate-500 hover:text-white rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSaveSubjectMapping} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 max-h-[40vh] overflow-y-auto pr-1">
                {subjects.map((sub) => {
                  const isChecked = mappedSubjectIds.includes(sub.id);
                  return (
                    <div
                      key={sub.id}
                      onClick={() => toggleSubjectInMappingForm(sub.id)}
                      className={`p-3 rounded-2xl border flex items-center gap-2 cursor-pointer transition-all select-none ${
                        isChecked
                          ? "bg-indigo-600/10 border-indigo-500/35 text-indigo-400"
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {isChecked ? <CheckSquare size={14} /> : <Square size={14} />}
                      <span className="text-[11px] font-semibold">{sub.name}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-900">
                <button
                  type="button"
                  onClick={() => setActiveSubjectMappingTeacher(null)}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-premium"
                >
                  Save Assignments
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
