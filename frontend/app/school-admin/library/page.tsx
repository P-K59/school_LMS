"use client";

import React, { useState, useEffect } from "react";
import { api } from "../../lib/api";
import { BookOpen, Plus, Search, X, CheckCircle, RefreshCw, AlertCircle, ArrowLeftRight, UserCheck } from "lucide-react";

export default function LibraryCatalogPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  
  // Forms
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [activeReturnRecord, setActiveReturnRecord] = useState<any | null>(null);

  // New Book Form
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [quantity, setQuantity] = useState("10");

  // Issue Book Form
  const [issueStudentId, setIssueStudentId] = useState("");
  const [issueBookId, setIssueBookId] = useState("");
  const [issueDueDate, setIssueDueDate] = useState("2026-07-15");

  // Return Form
  const [fineAmount, setFineAmount] = useState("0");

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
      const booksRes = await api.get("/school-admin/library/books");
      const issuesRes = await api.get("/school-admin/library/issues");
      const studentsRes = await api.get("/school-admin/students");

      setBooks(booksRes.data || []);
      setIssues(issuesRes.data || []);
      setStudents(studentsRes.data || []);

      if (booksRes.data && booksRes.data.length > 0) {
        setIssueBookId(booksRes.data[0].id);
      }
      if (studentsRes.data && studentsRes.data.length > 0) {
        setIssueStudentId(studentsRes.data[0].id);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load library catalog.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/school-admin/library/books", {
        title,
        author,
        isbn: isbn || undefined,
        quantity,
      });
      setIsAddBookModalOpen(false);
      setTitle("");
      setAuthor("");
      setIsbn("");
      loadData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleIssueBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueStudentId || !issueBookId) return;
    setSaving(true);
    try {
      await api.post("/school-admin/library/issue", {
        studentId: issueStudentId,
        bookId: issueBookId,
        dueDate: issueDueDate,
      });
      setIsIssueModalOpen(false);
      loadData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReturnBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReturnRecord) return;
    setSaving(true);
    try {
      await api.post("/school-admin/library/return", {
        bookIssueId: activeReturnRecord.id,
        fineAmount,
      });
      setActiveReturnRecord(null);
      setFineAmount("0");
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
            <BookOpen className="text-indigo-500" /> Library Catalog
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Register library books, monitor inventory, check out books to students, and log returns.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsIssueModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-800 bg-slate-950 text-slate-350 hover:text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            <ArrowLeftRight size={14} /> Issue Book
          </button>
          <button
            onClick={() => setIsAddBookModalOpen(true)}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-premium"
          >
            <Plus size={14} /> Add Book
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Books inventory table (left) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 bg-slate-950/40 border border-slate-850 rounded-3xl backdrop-blur-md">
              <h3 className="text-sm font-bold text-white mb-4">Book Stock & Inventory</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="py-2.5">Title / Author</th>
                      <th className="py-2.5">ISBN</th>
                      <th className="py-2.5 text-center">Availability</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 text-slate-300">
                    {books.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center py-6 text-slate-500">No books registered in inventory.</td>
                      </tr>
                    ) : (
                      books.map((b) => (
                        <tr key={b.id}>
                          <td className="py-3 font-semibold text-white">
                            <p>{b.title}</p>
                            <span className="text-[10px] text-slate-500 block">by {b.author}</span>
                          </td>
                          <td className="py-3 font-geist text-slate-400">{b.isbn || "N/A"}</td>
                          <td className="py-3 text-center">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              b.availableQuantity > 0
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-450 border border-rose-500/20"
                            }`}>
                              {b.availableQuantity} / {b.quantity} Available
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Book issue history (right) */}
          <div className="lg:col-span-1 p-6 bg-slate-950/40 border border-slate-850 rounded-3xl backdrop-blur-md space-y-4">
            <h3 className="text-sm font-bold text-white">Check-Out Logs</h3>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {issues.length === 0 ? (
                <p className="text-slate-550 text-xs italic">No books issued currently.</p>
              ) : (
                issues.map((i) => (
                  <div key={i.id} className="p-4 bg-slate-900/60 border border-slate-850 rounded-2xl text-xs space-y-2">
                    <div>
                      <p className="font-bold text-slate-200">{i.book.title}</p>
                      <span className="text-[10px] text-slate-400 font-semibold block flex items-center gap-1 mt-0.5">
                        <UserCheck size={12} className="text-indigo-400" /> {i.student.firstName} {i.student.lastName}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 space-y-0.5">
                      <p>Issue Date: {new Date(i.issueDate).toLocaleDateString()}</p>
                      <p>Due Date: {new Date(i.dueDate).toLocaleDateString()}</p>
                      {i.returnDate ? (
                        <p className="text-emerald-450">Returned: {new Date(i.returnDate).toLocaleDateString()}</p>
                      ) : (
                        <p className="text-rose-450">Outstanding Checkout</p>
                      )}
                      {Number(i.fineAmount) > 0 && <p className="text-amber-400">Fine: ₹{i.fineAmount}</p>}
                    </div>

                    {!i.returnDate && (
                      <div className="pt-2 border-t border-slate-850 flex justify-end">
                        <button
                          onClick={() => setActiveReturnRecord(i)}
                          className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[9px] font-bold cursor-pointer"
                        >
                          Process Return
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Register Book Modal */}
      {isAddBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-350">
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-900">
              <h3 className="font-hanken font-bold text-lg text-white">Add Book to Catalog</h3>
              <button
                onClick={() => setIsAddBookModalOpen(false)}
                className="p-1.5 text-slate-500 hover:text-white rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleCreateBook} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Book Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Introduction to Algorithms"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Author Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Thomas H. Cormen"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">ISBN Code</label>
                  <input
                    type="text"
                    placeholder="978-0262033848"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Initial Stock Qty</label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-900">
                <button
                  type="button"
                  onClick={() => setIsAddBookModalOpen(false)}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-premium"
                >
                  Add Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Issue Book Modal */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-350">
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-900">
              <h3 className="font-hanken font-bold text-lg text-white">Issue Book to Student</h3>
              <button
                onClick={() => setIsIssueModalOpen(false)}
                className="p-1.5 text-slate-500 hover:text-white rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleIssueBook} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Select Student</label>
                <select
                  value={issueStudentId}
                  onChange={(e) => setIssueStudentId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} (Roll: {s.rollNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Select Book</label>
                <select
                  value={issueBookId}
                  onChange={(e) => setIssueBookId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {books.filter((b) => b.availableQuantity > 0).map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title} (Stock: {b.availableQuantity})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Due Date for Return</label>
                <input
                  type="date"
                  required
                  value={issueDueDate}
                  onChange={(e) => setIssueDueDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-900">
                <button
                  type="button"
                  onClick={() => setIsIssueModalOpen(false)}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || students.length === 0 || books.filter((b) => b.availableQuantity > 0).length === 0}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-premium"
                >
                  Check Out Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Return Book Modal / Process Fine */}
      {activeReturnRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-350">
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-900">
              <h3 className="font-hanken font-bold text-base text-white">Log Return & Process Fine</h3>
              <button
                onClick={() => setActiveReturnRecord(null)}
                className="p-1.5 text-slate-500 hover:text-white rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleReturnBook} className="p-6 space-y-4">
              <div className="text-xs bg-slate-900/55 p-3.5 border border-slate-850 rounded-2xl">
                <p className="font-bold text-white">Returning: {activeReturnRecord.book.title}</p>
                <p className="text-slate-400 mt-1">Issued to: {activeReturnRecord.student.firstName} {activeReturnRecord.student.lastName}</p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Delay Fine Amount (INR)</label>
                <input
                  type="number"
                  required
                  value={fineAmount}
                  onChange={(e) => setFineAmount(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-900">
                <button
                  type="button"
                  onClick={() => setActiveReturnRecord(null)}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-premium"
                >
                  Complete Book Return
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
