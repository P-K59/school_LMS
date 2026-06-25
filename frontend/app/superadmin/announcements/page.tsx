"use client";

import React, { useState } from "react";
import { useMockData } from "../../context/MockDataContext";
import { GlassCard } from "../../components/Card";
import { Megaphone, Plus, Trash2, Calendar, Target, Globe, AlertTriangle, Eye, Send } from "lucide-react";

export default function AnnouncementsPage() {
  const { schools, announcements, addAnnouncement, deleteAnnouncement } = useMockData();

  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [targetSchoolId, setTargetSchoolId] = useState("all");
  const [status, setStatus] = useState<"Published" | "Draft">("Published");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    addAnnouncement({
      title,
      content,
      targetSchoolId,
      status,
    });

    // Reset Form
    setTitle("");
    setContent("");
    setTargetSchoolId("all");
    setStatus("Published");
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-hanken font-bold text-4xl text-on-surface tracking-tight">System Announcements</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Broadcast technical updates, compliance requirements, or general notifications across the platform.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Compose Announcement */}
        <div className="space-y-6">
          <GlassCard className="h-full">
            <h3 className="font-hanken font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
              <Megaphone size={18} className="text-primary" /> Compose Broadcast
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold font-geist text-slate-500 uppercase tracking-wider mb-1.5">Notification Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule Maintenance Notice"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold font-geist text-slate-500 uppercase tracking-wider mb-1.5">Broadcast Content</label>
                <textarea
                  required
                  placeholder="Write a clear, concise notice detailing actions admins must take..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 h-32"
                />
              </div>

              <div>
                <label className="block text-xs font-bold font-geist text-slate-500 uppercase tracking-wider mb-1.5">Target Audience</label>
                <select
                  value={targetSchoolId}
                  onChange={(e) => setTargetSchoolId(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">All Registered Schools</option>
                  {schools.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} Only
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold font-geist text-slate-500 uppercase tracking-wider mb-1.5">Release Status</label>
                <div className="flex gap-4">
                  {["Published", "Draft"].map((st) => (
                    <label key={st} className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        checked={status === st}
                        onChange={() => setStatus(st as any)}
                        className="text-primary focus:ring-primary border-slate-300"
                      />
                      {st}
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-container shadow-premium transition-colors mt-2 flex items-center justify-center gap-1.5"
              >
                <Send size={13} /> Publish Broadcast
              </button>
            </form>
          </GlassCard>
        </div>

        {/* Previous Announcements Log */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="h-full">
            <h3 className="font-hanken font-bold text-lg text-slate-800 mb-6">Historical Log</h3>

            <div className="space-y-4">
              {announcements.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm">
                  No announcements recorded in log.
                </div>
              ) : (
                announcements.map((a) => {
                  const targetName = a.targetSchoolId === "all" 
                    ? "Global Broadcast" 
                    : schools.find((s) => s.id === a.targetSchoolId)?.name || "Specific Institution";

                  return (
                    <div key={a.id} className="p-5 rounded-xl border border-slate-200 bg-white space-y-3 shadow-sm hover:border-slate-350 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-slate-850 leading-snug">{a.title}</h4>
                          <div className="flex flex-wrap items-center gap-2.5 mt-1.5 text-[10px] text-slate-400 font-geist">
                            <span className="flex items-center gap-1">
                              <Calendar size={11} /> {a.date}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className="flex items-center gap-1">
                              <Target size={11} /> {targetName}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold font-geist px-2.5 py-0.5 rounded-full border ${
                            a.status === "Published"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : "bg-slate-100 text-slate-500 border-slate-200"
                          }`}>
                            {a.status.toUpperCase()}
                          </span>
                          <button
                            onClick={() => deleteAnnouncement(a.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50 p-3 rounded-lg border border-slate-100">
                        {a.content}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
}
