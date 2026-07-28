"use client";

import React, { useState, useEffect } from "react";
import { api } from "../../lib/api";
import { CalendarCheck, Save, Search, Check, AlertTriangle, AlertCircle, RefreshCw, Send } from "lucide-react";

export default function AttendanceLedgerPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  
  // Filters
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  // Students list state
  const [students, setStudents] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Simulated Alert Box
  const [triggeredAlerts, setTriggeredAlerts] = useState<string[]>([]);

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    if (selectedClass && selectedSection && selectedDate) {
      loadAttendance();
    } else {
      setStudents([]);
    }
  }, [selectedClass, selectedSection, selectedDate]);

  const loadClasses = async () => {
    try {
      const res = await api.get("/school-admin/classes");
      setClasses(res.data || []);
      if (res.data && res.data.length > 0) {
        setSelectedClass(res.data[0].id);
        setSections(res.data[0].sections || []);
        if (res.data[0].sections && res.data[0].sections.length > 0) {
          setSelectedSection(res.data[0].sections[0].id);
        }
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleClassChange = (cId: string) => {
    setSelectedClass(cId);
    const cls = classes.find((c) => c.id === cId);
    const secs = cls ? cls.sections : [];
    setSections(secs);
    if (secs.length > 0) {
      setSelectedSection(secs[0].id);
    } else {
      setSelectedSection("");
    }
  };

  const loadAttendance = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await api.get(
        `/school-admin/attendance?classId=${selectedClass}&sectionId=${selectedSection}&date=${selectedDate}`
      );
      setStudents(res.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load class attendance logs.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId: string, status: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.studentId === studentId ? { ...s, status } : s))
    );
  };

  const handleSaveAttendance = async () => {
    setSaving(true);
    setError(null);
    setMessage(null);
    setTriggeredAlerts([]);

    const payload = {
      date: selectedDate,
      attendances: students.map((s) => ({
        studentId: s.studentId,
        status: s.status,
      })),
    };

    try {
      await api.post("/school-admin/attendance", payload);
      setMessage("Attendance logs saved and synchronized successfully.");

      // Calculate absent students for alerts
      const absentees = students.filter((s) => s.status === "ABSENT");
      if (absentees.length > 0) {
        const alertsList = absentees.map(
          (s) =>
            `[SMS ALERT SENT] To Parent of ${s.firstName}: "Dear Parent, your child ${s.firstName} ${s.lastName} was marked ABSENT today (${selectedDate})."`
        );
        setTriggeredAlerts(alertsList);
      }
    } catch (err: any) {
      setError(err.message || "Failed to commit attendance records.");
    } finally {
      setSaving(false);
    }
  };

  const markAllStatus = (status: string) => {
    setStudents((prev) => prev.map((s) => ({ ...s, status })));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-hanken font-bold text-4xl text-white tracking-tight flex items-center gap-3">
            <CalendarCheck className="text-indigo-500" /> Attendance Ledger
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Mark student attendance, review class reports, and trigger automated parent SMS alerts.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/30 border border-rose-900/50 rounded-2xl text-rose-455 text-xs font-semibold">
          Error: {error}
        </div>
      )}

      {message && (
        <div className="p-4 bg-emerald-950/30 border border-emerald-900/50 rounded-2xl text-emerald-400 text-xs font-semibold">
          {message}
        </div>
      )}

      {/* Filter and Command Ledger */}
      <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-3xl flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <select
            value={selectedClass}
            onChange={(e) => handleClassChange(e.target.value)}
            className="flex-1 lg:flex-none text-xs bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-slate-350 focus:outline-none focus:border-indigo-500"
          >
            <option value="">-- Select Class --</option>
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
            className="flex-1 lg:flex-none text-xs bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-slate-350 focus:outline-none focus:border-indigo-500 disabled:opacity-40"
          >
            <option value="">-- Select Section --</option>
            {sections.map((sec) => (
              <option key={sec.id} value={sec.id}>
                {sec.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="flex-1 lg:flex-none text-xs bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-slate-350 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {students.length > 0 && (
          <div className="flex gap-2 w-full lg:w-auto">
            <button
              onClick={() => markAllStatus("PRESENT")}
              className="flex-1 lg:flex-none px-3 py-1.5 border border-slate-850 hover:border-slate-800 text-slate-400 hover:text-slate-200 rounded-lg text-[10px] font-bold cursor-pointer"
            >
              Mark All Present
            </button>
            <button
              onClick={() => markAllStatus("ABSENT")}
              className="flex-1 lg:flex-none px-3 py-1.5 border border-rose-900/30 hover:border-rose-900/50 text-rose-500/80 hover:text-rose-400 rounded-lg text-[10px] font-bold cursor-pointer"
            >
              Mark All Absent
            </button>
          </div>
        )}
      </div>

      {/* Attendance Spreadsheet Grid */}
      <div className="p-0 border border-slate-850 rounded-3xl bg-slate-950/20 overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950/60 border-b border-slate-850 text-slate-500 font-bold uppercase tracking-wider">
              <th className="py-4 px-6 w-24">Roll No</th>
              <th className="py-4 px-6">Student Name</th>
              <th className="py-4 px-6 text-center">Status Selection</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900 text-slate-350">
            {loading ? (
              <tr>
                <td colSpan={3} className="text-center py-16">
                  <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                </td>
              </tr>
            ) : !selectedClass || !selectedSection ? (
              <tr>
                <td colSpan={3} className="text-center py-12 text-slate-500 font-medium">
                  Please select class and section filters to load attendance grid.
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-12 text-slate-500 font-medium">
                  No students enrolled in this section.
                </td>
              </tr>
            ) : (
              students.map((s) => (
                <tr key={s.studentId} className="hover:bg-slate-900/10">
                  <td className="py-4.5 px-6 font-bold text-white">{s.rollNumber}</td>
                  <td className="py-4.5 px-6 font-semibold text-white">
                    {s.firstName} {s.lastName}
                  </td>
                  <td className="py-4.5 px-6">
                    <div className="flex items-center justify-center gap-3">
                      {["PRESENT", "ABSENT", "LATE", "HALF_DAY"].map((st) => {
                        const isChecked = s.status === st;
                        let colorClass = "border-slate-800 text-slate-500 hover:text-slate-300";
                        if (isChecked) {
                          if (st === "PRESENT") colorClass = "bg-emerald-500/10 border-emerald-500/40 text-emerald-400";
                          if (st === "ABSENT") colorClass = "bg-rose-500/10 border-rose-500/40 text-rose-450";
                          if (st === "LATE") colorClass = "bg-amber-500/10 border-amber-500/40 text-amber-400";
                          if (st === "HALF_DAY") colorClass = "bg-sky-500/10 border-sky-500/40 text-sky-400";
                        }

                        return (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleStatusChange(s.studentId, st)}
                            className={`px-3 py-1.5 border rounded-xl text-[10px] font-bold transition-all cursor-pointer ${colorClass}`}
                          >
                            {st.replace("_", " ")}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Save Trigger */}
      {students.length > 0 && (
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSaveAttendance}
            disabled={saving}
            className="flex items-center gap-1.5 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl text-xs font-semibold cursor-pointer shadow-premium"
          >
            {saving ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <Save size={14} />
            )}
            Synchronize Attendance & Send Alerts
          </button>
        </div>
      )}

      {/* Simulated Alert Console */}
      {triggeredAlerts.length > 0 && (
        <div className="p-6 border border-indigo-900/30 bg-indigo-950/15 rounded-3xl space-y-3">
          <h4 className="text-xs font-bold text-indigo-400 flex items-center gap-2">
            <Send size={12} className="animate-pulse" /> Telemetry Communication Logs (Parent SMS Alerts)
          </h4>
          <div className="font-mono text-[10px] space-y-1.5 text-indigo-300">
            {triggeredAlerts.map((log, idx) => (
              <div key={idx} className="bg-slate-900/60 p-2.5 border border-slate-850 rounded-xl leading-relaxed">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
