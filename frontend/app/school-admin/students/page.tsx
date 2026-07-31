"use client";

import React, { useState, useEffect } from "react";
import { api } from "../../lib/api";
import { GraduationCap, Plus, Search, Upload, X, ShieldAlert, Award, Printer, UserPlus } from "lucide-react";

export default function StudentsRegistryPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  
  // Filters
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [activeIdCardStudent, setActiveIdCardStudent] = useState<any | null>(null);

  // Single Register Form
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("MALE");
  const [dob, setDob] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [address, setAddress] = useState("");

  // Bulk Import text state
  const [bulkJsonText, setBulkJsonText] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    loadStudents();
  }, [selectedClass, selectedSection]);

  const loadClasses = async () => {
    try {
      const res = await api.get("/school-admin/classes");
      setClasses(res.data || []);
      if (res.data && res.data.length > 0) {
        setClassId(res.data[0].id);
        setSections(res.data[0].sections || []);
        if (res.data[0].sections && res.data[0].sections.length > 0) {
          setSectionId(res.data[0].sections[0].id);
        }
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleClassChange = (cId: string) => {
    setClassId(cId);
    const cls = classes.find((c) => c.id === cId);
    const secs = cls ? cls.sections : [];
    setSections(secs);
    if (secs.length > 0) {
      setSectionId(secs[0].id);
    } else {
      setSectionId("");
    }
  };

  const loadStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      let path = "/users/students";
      const queries = [];
      if (selectedClass) queries.push(`classId=${selectedClass}`);
      if (selectedSection) queries.push(`sectionId=${selectedSection}`);
      if (queries.length > 0) path += `?${queries.join("&")}`;

      const res = await api.get(path);
      setStudents(res.data || []);
    } catch (err: any) {
      // Fallback try legacy route if needed
      try {
        const res = await api.get("/school-admin/students");
        setStudents(res.data || []);
      } catch (fallbackErr: any) {
        setError(err.message || "Failed to retrieve student records.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const payload = {
        firstName,
        lastName,
        email: email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@student.edu`,
        phone: phone || undefined,
      };

      await api.post("/users/students", payload);
      setIsAddModalOpen(false);
      // Reset form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setRollNumber("");
      setAdmissionNumber("");
      setFatherName("");
      setParentPhone("");
      setParentEmail("");
      setAddress("");
      
      loadStudents();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleBulkImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const parsedArray = JSON.parse(bulkJsonText);
      if (!Array.isArray(parsedArray)) {
        throw new Error("Payload must be a valid JSON array of student objects.");
      }

      await api.post("/school-admin/students/import", { students: parsedArray });
      setIsImportModalOpen(false);
      setBulkJsonText("");
      loadStudents();
    } catch (err: any) {
      setError(err.message || "Failed parsing or importing JSON data.");
    }
  };

  const autofillJSONTemplate = () => {
    if (classes.length === 0) return;
    const targetClass = classes[0];
    const targetSection = targetClass.sections[0] || { id: "demo-sec-id" };

    const demoArray = [
      {
        firstName: "Aarav",
        lastName: "Sharma",
        email: `aarav_${Date.now()}@eduverse.io`,
        gender: "MALE",
        dob: "2016-04-12",
        rollNumber: "101",
        classId: targetClass.id,
        sectionId: targetSection.id,
        parentFatherName: "Rajesh Sharma",
        parentPhone: "9988776655",
        address: "New Delhi, India"
      },
      {
        firstName: "Ananya",
        lastName: "Iyer",
        email: `ananya_${Date.now()}@eduverse.io`,
        gender: "FEMALE",
        dob: "2016-08-25",
        rollNumber: "102",
        classId: targetClass.id,
        sectionId: targetSection.id,
        parentFatherName: "Venkatesh Iyer",
        parentPhone: "9876543222",
        address: "Chennai, India"
      }
    ];
    setBulkJsonText(JSON.stringify(demoArray, null, 2));
  };

  // Filter students locally by search term
  const filteredStudents = students.filter((s) => {
    const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      s.rollNumber.includes(searchTerm) ||
      s.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-hanken font-bold text-4xl text-white tracking-tight flex items-center gap-3">
            <GraduationCap className="text-indigo-500" /> Student Registry
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Register students, perform bulk database imports, and generate kid-friendly ID cards.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-800 bg-slate-950 text-slate-350 hover:text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            <Upload size={14} /> Bulk JSON Import
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-premium"
          >
            <Plus size={14} /> Add Student
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/30 border border-rose-900/50 rounded-2xl text-rose-455 text-xs font-semibold">
          Error: {error}
        </div>
      )}

      {/* Filter Ledger */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-slate-950/40 border border-slate-850 rounded-2xl">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
          <input
            type="text"
            placeholder="Search by student name or roll no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setSelectedSection("");
            }}
            className="flex-1 md:flex-none text-xs bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="">-- All Classes --</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={selectedSection}
            disabled={!selectedClass}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="flex-1 md:flex-none text-xs bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-slate-300 focus:outline-none focus:border-indigo-500 disabled:opacity-40"
          >
            <option value="">-- All Sections --</option>
            {classes
              .find((c) => c.id === selectedClass)
              ?.sections.map((sec: any) => (
                <option key={sec.id} value={sec.id}>
                  {sec.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Database Listing Grid */}
      <div className="p-0 border border-slate-850 rounded-3xl bg-slate-950/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-850 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Roll No</th>
                <th className="py-4 px-4">Student Name</th>
                <th className="py-4 px-4">Admission Details</th>
                <th className="py-4 px-4">Class Division</th>
                <th className="py-4 px-4">Father Owner</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500 font-medium">
                    No student registrations found in database.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-900/10 transition-colors">
                    <td className="py-4 px-6 font-bold text-white">{s.rollNumber}</td>
                    <td className="py-4 px-4 font-semibold text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600/10 border border-indigo-500/15 flex items-center justify-center text-indigo-400 font-bold">
                          {s.firstName[0]}
                        </div>
                        <div>
                          <p>{s.firstName} {s.lastName}</p>
                          <span className="text-[10px] text-slate-500 uppercase font-geist">{s.gender}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-semibold">{s.admissionNumber}</p>
                      <span className="text-[10px] text-slate-500 font-geist">
                        {s.dob ? new Date(s.dob).toLocaleDateString() : "No DOB"}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-semibold">
                      <span className="bg-slate-900 border border-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-lg">
                        {s.class?.name || "Grade"} - {s.section?.name || "Sec"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-semibold text-slate-200">{s.parent?.fatherName}</p>
                      <span className="text-[10px] text-slate-500 block font-geist">{s.parent?.phone}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-450 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        {s.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setActiveIdCardStudent(s)}
                        className="p-1.5 bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:text-indigo-400 text-slate-400 rounded-lg transition-colors cursor-pointer"
                        title="Print ID Card"
                      >
                        <Printer size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-350">
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-900">
              <h3 className="font-hanken font-bold text-lg text-white flex items-center gap-2">
                <UserPlus className="text-indigo-500" /> Student Enrollment Registry
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-500 hover:text-white rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleRegisterStudent} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
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
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Roll Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 101"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Admission Code</label>
                  <input
                    type="text"
                    placeholder="ADM-9021"
                    value={admissionNumber}
                    onChange={(e) => setAdmissionNumber(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Class</label>
                  <select
                    value={classId}
                    onChange={(e) => handleClassChange(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Section</label>
                  <select
                    value={sectionId}
                    onChange={(e) => setSectionId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    {sections.map((sec) => (
                      <option key={sec.id} value={sec.id}>
                        {sec.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Student Email</label>
                  <input
                    type="email"
                    placeholder="student@school.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Student Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="border-t border-slate-900 pt-4 space-y-3">
                <h4 className="text-xs font-bold text-indigo-400">Parent / Guardian Legal Scope</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Father's Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Father's full name"
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Parent Phone</label>
                    <input
                      type="text"
                      required
                      placeholder="Mobile contact"
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Parent Email</label>
                    <input
                      type="email"
                      placeholder="parent@guardian.com"
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Residential Address</label>
                  <input
                    type="text"
                    required
                    placeholder="Residential address details"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
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
                  disabled={classes.length === 0}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-premium"
                >
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-350">
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-900">
              <h3 className="font-hanken font-bold text-lg text-white flex items-center gap-2">
                <Upload className="text-indigo-400" /> Bulk JSON Registry Import
              </h3>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-1.5 text-slate-500 hover:text-white rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleBulkImport} className="p-6 space-y-4">
              <div className="p-3 bg-indigo-950/30 border border-indigo-900/50 rounded-2xl flex gap-3 text-indigo-350 text-[11px] leading-relaxed">
                <ShieldAlert size={18} className="shrink-0 mt-0.5" />
                <div>
                  Enter a JSON array of student objects matching the parameters. Select 
                  <button type="button" onClick={autofillJSONTemplate} className="underline text-white font-bold ml-1 hover:text-indigo-300">
                    Auto-Fill Demo Template
                  </button> to see the exact syntax.
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">JSON Payload</label>
                <textarea
                  required
                  placeholder="[{ ... }, { ... }]"
                  value={bulkJsonText}
                  onChange={(e) => setBulkJsonText(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono h-48"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-900">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-premium"
                >
                  Commit Import
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ID Card Print Preview Modal */}
      {activeIdCardStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-950 border border-slate-850 rounded-3xl shadow-2xl p-6 text-slate-300 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-4 border-b border-slate-900 mb-6">
              <h3 className="text-sm font-bold text-white">ID Card Badge Generation</h3>
              <button
                onClick={() => setActiveIdCardStudent(null)}
                className="text-slate-500 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Cartoon Card UI Badge */}
            <div
              id="id-card-element"
              className="w-full max-w-[280px] mx-auto p-5 rounded-3xl bg-gradient-to-b from-indigo-950 to-slate-950 border-4 border-indigo-600 relative text-center overflow-hidden shadow-2xl my-2 text-slate-200"
            >
              <div className="absolute top-[-10%] right-[-10%] w-24 h-24 rounded-full bg-indigo-500/10 blur-xl" />
              <div className="absolute bottom-[-10%] left-[-10%] w-24 h-24 rounded-full bg-sky-500/10 blur-xl" />

              {/* School title */}
              <div className="flex items-center justify-center gap-1.5 mb-4">
                <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center font-bold text-white text-[10px]">
                  EV
                </div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-white">EduVerse Academy</span>
              </div>

              {/* Picture Frame */}
              <div className="w-20 h-20 rounded-full border-2 border-indigo-500/40 bg-slate-900/80 mx-auto mb-3 flex items-center justify-center text-indigo-400 font-bold text-2xl shadow-inner">
                {activeIdCardStudent.firstName[0]}
              </div>

              {/* Details */}
              <h4 className="font-hanken font-bold text-base text-white">
                {activeIdCardStudent.firstName} {activeIdCardStudent.lastName}
              </h4>
              <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest block mt-0.5">
                {activeIdCardStudent.class?.name || "Class"} - {activeIdCardStudent.section?.name || "Sec"}
              </span>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-900 text-left text-[9px] font-medium text-slate-400">
                <div>
                  <span>Roll No:</span>
                  <p className="font-bold text-white font-geist">{activeIdCardStudent.rollNumber}</p>
                </div>
                <div>
                  <span>Adm No:</span>
                  <p className="font-bold text-white font-geist truncate">{activeIdCardStudent.admissionNumber.slice(0, 10)}</p>
                </div>
                <div>
                  <span>Gender:</span>
                  <p className="font-bold text-white">{activeIdCardStudent.gender}</p>
                </div>
                <div>
                  <span>Emergency No:</span>
                  <p className="font-bold text-white font-geist">{activeIdCardStudent.parent?.phone || "N/A"}</p>
                </div>
              </div>

              {/* Badge Footer */}
              <div className="mt-5 text-[8px] font-bold text-indigo-500 tracking-widest uppercase flex items-center justify-center gap-1">
                <Award size={10} /> Certified Student Badge
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-slate-900">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer size={13} /> Print Card
              </button>
              <button
                onClick={() => setActiveIdCardStudent(null)}
                className="py-2 px-4 border border-slate-800 hover:bg-slate-900 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
