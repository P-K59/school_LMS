import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  subtext?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  variant?: "default" | "indigo" | "blue" | "emerald";
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtext,
  trend,
  icon,
  variant = "default",
}) => {
  const gradientStyles = {
    default: "bg-white dark:bg-zinc-900 border-outline-variant/30",
    indigo: "bg-gradient-to-br from-white to-purple-50/30 border-purple-100",
    blue: "bg-gradient-to-br from-white to-blue-50/30 border-blue-100",
    emerald: "bg-gradient-to-br from-white to-emerald-50/30 border-emerald-100",
  };

  return (
    <div className={`p-6 rounded-2xl border shadow-premium hover:shadow-premium-hover transition-all duration-300 ${gradientStyles[variant]} flex flex-col justify-between`}>
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-geist font-medium uppercase tracking-wider text-on-surface-variant/80">
            {title}
          </span>
          <h3 className="font-hanken font-bold text-3xl text-on-surface mt-1 tracking-tight">
            {value}
          </h3>
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary-container border border-surface-container-highest">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-surface-container/60">
        {trend && (
          <span
            className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
              trend.isPositive
                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                : "bg-rose-50 text-rose-600 border border-rose-100"
            }`}
          >
            {trend.isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {trend.value}
          </span>
        )}
        {subtext && (
          <span className="text-xs text-on-surface-variant font-medium">
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
};

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  isInteractive?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = "",
  isInteractive = false,
}) => {
  return (
    <div
      className={`glass-panel rounded-2xl p-6 shadow-premium ${
        isInteractive ? "hover:shadow-premium-hover hover:-translate-y-0.5 transition-all duration-300 cursor-pointer" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
};
