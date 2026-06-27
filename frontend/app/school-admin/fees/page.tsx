"use client";

import React, { useState, useEffect } from "react";
import { api } from "../../lib/api";
import { CreditCard, Plus, IndianRupee, Printer, X, RefreshCw, Landmark, BookOpen, AlertCircle } from "lucide-react";

export default function FeesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [feeStructures, setFeeStructures] = useState<any[]>([]);
  const [studentFees, setStudentFees] = useState<any[]>([]);

  // Form states
  const [structureClassId, setStructureClassId] = useState("");
  const [tuitionFee, setTuitionFee] = useState("12000");
  const [transportFee, setTransportFee] = useState("3000");
  const [examFee, setExamFee] = useState("1500");
  const [libraryFee, setLibraryFee] = useState("1000");
  const [miscFee, setMiscFee] = useState("800");

  // Modals
  const [isStructureModalOpen, setIsStructureModalOpen] = useState(false);
  const [activePaymentRecord, setActivePaymentRecord] = useState<any | null>(null);
  const [activeReceiptRecord, setActiveReceiptRecord] = useState<any | null>(null);

  // Allocate Fee modal form
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
  const [allocateStudentId, setAllocateStudentId] = useState("");
  const [allocateStructureId, setAllocateStructureId] = useState("");
  const [allocateDueDate, setAllocateDueDate] = useState("2026-10-31");
  const [allStudents, setAllStudents] = useState<any[]>([]);

  // Payment log form
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState("CASH");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const classesRes = await api.get("/school-admin/classes");
      const structuresRes = await api.get("/school-admin/fees/structures");
      const studentFeesRes = await api.get("/school-admin/fees/student-fees");
      const studentsRes = await api.get("/school-admin/students");

      setClasses(classesRes.data || []);
      setFeeStructures(structuresRes.data || []);
      setStudentFees(studentFeesRes.data || []);
      setAllStudents(studentsRes.data || []);

      if (classesRes.data && classesRes.data.length > 0) {
        setStructureClassId(classesRes.data[0].id);
      }
      if (structuresRes.data && structuresRes.data.length > 0) {
        setAllocateStructureId(structuresRes.data[0].id);
      }
      if (studentsRes.data && studentsRes.data.length > 0) {
        setAllocateStudentId(studentsRes.data[0].id);
      }
    } catch (err: any) {
      setError(err.message || "Failed to retrieve billing ledger from database.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStructure = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/school-admin/fees/structures", {
        classId: structureClassId,
        tuitionFee,
        transportFee,
        examFee,
        libraryFee,
        miscFee,
      });
      setIsStructureModalOpen(false);
      loadData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAllocateFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allocateStudentId || !allocateStructureId) return;
    setSaving(true);
    try {
      await api.post("/school-admin/fees/allocate", {
        studentId: allocateStudentId,
        feeStructureId: allocateStructureId,
        dueDate: allocateDueDate,
      });
      setIsAllocateModalOpen(false);
      loadData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePaymentRecord || !payAmount) return;
    setSaving(true);
    try {
      await api.post("/school-admin/fees/pay", {
        studentFeeId: activePaymentRecord.id,
        amount: payAmount,
        paymentMethod: payMethod,
      });
      setActivePaymentRecord(null);
      setPayAmount("");
      loadData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-hanken font-bold text-4xl text-white tracking-tight flex items-center gap-3">
            <CreditCard className="text-indigo-500" /> Fees & Invoices
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Configure fee catalogs, allocate invoices, record payments, and print student receipt slips.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsStructureModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-800 bg-slate-950 text-slate-350 hover:text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            <BookOpen size={14} /> Fee Catalog Setup
          </button>
          <button
            onClick={() => setIsAllocateModalOpen(true)}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-premium"
          >
            <Plus size={14} /> Invoice Student
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/30 border border-rose-900/50 rounded-2xl text-rose-455 text-xs font-semibold">
          Error: {error}
        </div>
      )}

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Structures sidebar */}
          <div className="lg:col-span-1 p-6 bg-slate-950/60 border border-slate-800 rounded-3xl backdrop-blur-md h-fit space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Landmark size={14} className="text-indigo-400" /> Fee Catalog
            </h3>
            <div className="space-y-3">
              {feeStructures.length === 0 ? (
                <p className="text-slate-550 text-xs italic">No fee catalogs configured. Set up structures above.</p>
              ) : (
                feeStructures.map((fs) => {
                  const total =
                    Number(fs.tuitionFee) +
                    Number(fs.transportFee) +
                    Number(fs.examFee) +
                    Number(fs.libraryFee) +
                    Number(fs.miscFee);
                  return (
                    <div key={fs.id} className="p-3.5 bg-slate-900/60 border border-slate-850 rounded-2xl text-xs">
                      <div className="font-bold text-white mb-2 pb-1 border-b border-slate-850 flex justify-between">
                        <span>{fs.class.name}</span>
                        <span className="text-indigo-400">₹{total.toLocaleString()}</span>
                      </div>
                      <div className="space-y-1 text-slate-400 text-[10px]">
                        <div className="flex justify-between"><span>Tuition:</span><span>₹{fs.tuitionFee}</span></div>
                        <div className="flex justify-between"><span>Transport:</span><span>₹{fs.transportFee}</span></div>
                        <div className="flex justify-between"><span>Library:</span><span>₹{fs.libraryFee}</span></div>
                        <div className="flex justify-between"><span>Exam:</span><span>₹{fs.examFee}</span></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Student invoices ledger */}
          <div className="lg:col-span-3 p-0 border border-slate-850 rounded-3xl bg-slate-950/20 overflow-hidden h-fit">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-slate-850 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-4 px-6">Roll No</th>
                    <th className="py-4 px-4">Student</th>
                    <th className="py-4 px-4">Class</th>
                    <th className="py-4 px-4">Account Balances</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 text-slate-350">
                  {studentFees.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-slate-500 font-medium">
                        No outstanding student invoices. Use "Invoice Student" to assign.
                      </td>
                    </tr>
                  ) : (
                    studentFees.map((sf) => (
                      <tr key={sf.id} className="hover:bg-slate-900/10">
                        <td className="py-4.5 px-6 font-bold text-white">{sf.student.rollNumber}</td>
                        <td className="py-4.5 px-4 font-semibold text-white">
                          {sf.student.firstName} {sf.student.lastName}
                        </td>
                        <td className="py-4.5 px-4">
                          {sf.student.class?.name} - {sf.student.section?.name}
                        </td>
                        <td className="py-4.5 px-4 font-geist">
                          <p className="font-bold text-slate-100">Total: ₹{sf.totalAmount}</p>
                          <span className="text-[10px] text-emerald-450 block">Paid: ₹{sf.paidAmount}</span>
                          <span className="text-[10px] text-rose-450 block">Due: ₹{sf.dueAmount}</span>
                        </td>
                        <td className="py-4.5 px-4">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            sf.status === "PAID"
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                              : sf.status === "PARTIAL"
                              ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                              : "bg-rose-500/10 border-rose-500/20 text-rose-450"
                          }`}>
                            {sf.status}
                          </span>
                        </td>
                        <td className="py-4.5 px-6 text-right">
                          <div className="flex justify-end gap-2.5">
                            {sf.status !== "PAID" && (
                              <button
                                onClick={() => {
                                  setActivePaymentRecord(sf);
                                  setPayAmount(sf.dueAmount.toString());
                                }}
                                className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                              >
                                Log Pay
                              </button>
                            )}
                            <button
                              onClick={() => setActiveReceiptRecord(sf)}
                              className="p-1.5 bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:text-indigo-400 text-slate-400 rounded-lg cursor-pointer"
                              title="Print Invoice Receipt"
                            >
                              <Printer size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Fee structure setup Modal */}
      {isStructureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-350">
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-900">
              <h3 className="font-hanken font-bold text-lg text-white">Create Fee Structure</h3>
              <button
                onClick={() => setIsStructureModalOpen(false)}
                className="p-1.5 text-slate-500 hover:text-white rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleCreateStructure} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Target Class</label>
                <select
                  value={structureClassId}
                  onChange={(e) => setStructureClassId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tuition Fee (INR)</label>
                  <input
                    type="number"
                    value={tuitionFee}
                    onChange={(e) => setTuitionFee(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Transport Fee (INR)</label>
                  <input
                    type="number"
                    value={transportFee}
                    onChange={(e) => setTransportFee(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Exam Fee</label>
                  <input
                    type="number"
                    value={examFee}
                    onChange={(e) => setExamFee(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Library Fee</label>
                  <input
                    type="number"
                    value={libraryFee}
                    onChange={(e) => setLibraryFee(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Misc Fee</label>
                  <input
                    type="number"
                    value={miscFee}
                    onChange={(e) => setMiscFee(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-900">
                <button
                  type="button"
                  onClick={() => setIsStructureModalOpen(false)}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-premium"
                >
                  Publish Structure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Allocation Modal */}
      {isAllocateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-350">
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-900">
              <h3 className="font-hanken font-bold text-lg text-white">Invoice Student Account</h3>
              <button
                onClick={() => setIsAllocateModalOpen(false)}
                className="p-1.5 text-slate-500 hover:text-white rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleAllocateFee} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Select Student</label>
                <select
                  value={allocateStudentId}
                  onChange={(e) => setAllocateStudentId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {allStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} (Roll: {s.rollNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Select Fee Catalog</label>
                <select
                  value={allocateStructureId}
                  onChange={(e) => setAllocateStructureId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {feeStructures.map((fs) => (
                    <option key={fs.id} value={fs.id}>
                      {fs.class.name} Structure (Tuition: ₹{fs.tuitionFee})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Billing Due Date</label>
                <input
                  type="date"
                  required
                  value={allocateDueDate}
                  onChange={(e) => setAllocateDueDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-900">
                <button
                  type="button"
                  onClick={() => setIsAllocateModalOpen(false)}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || allStudents.length === 0 || feeStructures.length === 0}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-premium"
                >
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {activePaymentRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-350">
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-900">
              <h3 className="font-hanken font-bold text-base text-white">Record Invoice Payment</h3>
              <button
                onClick={() => setActivePaymentRecord(null)}
                className="p-1.5 text-slate-500 hover:text-white rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleRecordPayment} className="p-6 space-y-4">
              <div className="text-xs bg-slate-900/50 p-3.5 rounded-2xl border border-slate-850">
                <p className="font-bold text-white">Student: {activePaymentRecord.student.firstName} {activePaymentRecord.student.lastName}</p>
                <span className="text-[10px] text-rose-450 block mt-1">Outstanding Account Balance: ₹{activePaymentRecord.dueAmount}</span>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Receipt Paid Amount (INR)</label>
                <input
                  type="number"
                  required
                  max={activePaymentRecord.dueAmount}
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Transaction Method</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="CASH">Cash Payment</option>
                  <option value="CARD">Debit / Credit Card</option>
                  <option value="ONLINE">Bank Transfer (NEFT/IMPS)</option>
                  <option value="RAZORPAY">Razorpay Gateway Gateway</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-900">
                <button
                  type="button"
                  onClick={() => setActivePaymentRecord(null)}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-premium"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice receipt print popup */}
      {activeReceiptRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-950 border border-slate-850 rounded-3xl shadow-2xl p-6 text-slate-300 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-4 border-b border-slate-900 mb-6">
              <h3 className="text-sm font-bold text-white">Generate Billing Receipt</h3>
              <button
                onClick={() => setActiveReceiptRecord(null)}
                className="text-slate-500 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Print UI Receipt card */}
            <div
              id="fee-receipt-print"
              className="w-full bg-slate-900 border border-slate-800 p-6 rounded-2xl text-slate-300 relative font-mono text-[10px] space-y-4"
            >
              <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                <div>
                  <h4 className="font-bold text-white text-xs">EDUVERSE LMS LTD.</h4>
                  <p className="text-slate-500 text-[8px] mt-0.5">Apex International School Division</p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-bold text-indigo-400 font-sans border border-indigo-900 bg-indigo-950/20 px-2 py-0.5 rounded-md">
                    OFFICIAL INVOICE
                  </span>
                </div>
              </div>

              <div>
                <p><span className="text-slate-500">Student:</span> <span className="text-white font-bold">{activeReceiptRecord.student.firstName} {activeReceiptRecord.student.lastName}</span></p>
                <p><span className="text-slate-500">Roll No:</span> <span className="text-slate-300 font-bold">{activeReceiptRecord.student.rollNumber}</span></p>
                <p><span className="text-slate-500">Class:</span> <span className="text-slate-300">{activeReceiptRecord.student.class?.name} - {activeReceiptRecord.student.section?.name}</span></p>
                <p><span className="text-slate-500">Due Date:</span> <span className="text-slate-400">{new Date(activeReceiptRecord.dueDate).toLocaleDateString()}</span></p>
              </div>

              <div className="border-t border-b border-slate-800 py-2.5 space-y-1.5">
                <div className="flex justify-between font-bold text-slate-400">
                  <span>Description</span>
                  <span>Amount</span>
                </div>
                <div className="flex justify-between">
                  <span>Grade Tuition Fee:</span>
                  <span>₹{activeReceiptRecord.feeStructure.tuitionFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transport Allocation:</span>
                  <span>₹{activeReceiptRecord.feeStructure.transportFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Library Catalog Fee:</span>
                  <span>₹{activeReceiptRecord.feeStructure.libraryFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Syllabus Exams:</span>
                  <span>₹{activeReceiptRecord.feeStructure.examFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Miscellaneous:</span>
                  <span>₹{activeReceiptRecord.feeStructure.miscFee}</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-bold text-white">
                  <span>Total Invoiced:</span>
                  <span>₹{activeReceiptRecord.totalAmount}</span>
                </div>
                <div className="flex justify-between text-emerald-450 font-bold">
                  <span>Total Amount Paid:</span>
                  <span>₹{activeReceiptRecord.paidAmount}</span>
                </div>
                <div className="flex justify-between text-rose-450 font-bold">
                  <span>Net Outstanding Balance:</span>
                  <span>₹{activeReceiptRecord.dueAmount}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-between items-end text-[8px] text-slate-550 font-sans">
                <div>
                  <p>Transaction Node: SECURE-API-v1</p>
                  <p>Status: {activeReceiptRecord.status}</p>
                </div>
                <div className="text-right border-t border-slate-800 pt-1 w-24">
                  <p className="italic font-bold text-slate-400">Admin Signatory</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-slate-900">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-premium"
              >
                <Printer size={13} /> Print Invoice Receipt
              </button>
              <button
                onClick={() => setActiveReceiptRecord(null)}
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
