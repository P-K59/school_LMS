"use client";

import React, { useState } from "react";
import { useMockData } from "../../context/MockDataContext";
import { GlassCard } from "../../components/Card";
import { Settings, Shield, Globe, Mail, CreditCard, Check } from "lucide-react";

export default function SettingsPage() {
  const { addActivity } = useMockData();
  
  // General branding
  const [platformName, setPlatformName] = useState("EduVerse LMS");
  const [supportEmail, setSupportEmail] = useState("support@eduverse.io");
  const [sandboxMode, setSandboxMode] = useState(true);

  // Subscription tiers pricing
  const [basePrice, setBasePrice] = useState(600);
  const [proPrice, setProPrice] = useState(1450);
  const [entPrice, setEntPrice] = useState(4200);

  // Success indicator
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addActivity("Platform branding and pricing configurations updated.", "System");
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-hanken font-bold text-4xl text-on-surface tracking-tight">Platform Configuration</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Adjust global site parameters, notification defaults, billing gateway test modes, and licensing base plans.
        </p>
      </div>

      <div className="max-w-3xl">
        <GlassCard>
          <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-4">
            <Settings size={20} className="text-primary" />
            <h3 className="font-hanken font-bold text-lg text-slate-800">System Parameters</h3>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Core branding */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-500 font-geist uppercase tracking-wider">Branding & Mailers</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-650 mb-1.5">Platform Display Name</label>
                  <input
                    type="text"
                    required
                    value={platformName}
                    onChange={(e) => setPlatformName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-650 mb-1.5">Default Support Email</label>
                  <input
                    type="email"
                    required
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            {/* Billing cost tiers */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-500 font-geist uppercase tracking-wider">Default Plan Pricing (USD / month)</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-650 mb-1.5">Base Plan License</label>
                  <input
                    type="number"
                    required
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-650 mb-1.5">Pro Plan License</label>
                  <input
                    type="number"
                    required
                    value={proPrice}
                    onChange={(e) => setProPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-650 mb-1.5">Enterprise License</label>
                  <input
                    type="number"
                    required
                    value={entPrice}
                    onChange={(e) => setEntPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            {/* Payment Integrations */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-500 font-geist uppercase tracking-wider">Payment Gateway sandbox</h4>
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <h5 className="text-xs font-bold text-slate-800">Stripe Sandbox mode</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Bypass real credit card routing for dashboard validation</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sandboxMode}
                    onChange={() => setSandboxMode(!sandboxMode)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
              {isSaved && (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 font-geist bg-emerald-50 border border-emerald-150 px-3 py-1.5 rounded-lg">
                  <Check size={14} /> Saved Parameters
                </span>
              )}
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-container shadow-premium transition-colors"
              >
                Save Settings
              </button>
            </div>

          </form>
        </GlassCard>
      </div>
    </div>
  );
}
