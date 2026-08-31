"use client";
import React from "react";
import Link from "next/link";
import { AlertTriangle, ShieldAlert, CheckCircle2, Clock, ArrowRight } from "lucide-react";

interface CardProps {
  title: string;
  value?: number;
  type: "overstock" | "understock" | "unbalanced" | "unprocessed";
}

export const EnhancedCardDashboard: React.FC<CardProps> = ({ title, value = 0, type }) => {
  const configs = {
    overstock: {
      icon: AlertTriangle,
      badge: "Kapasitas Berlebih",
      textColor: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-950/30",
      borderColor: "border-amber-200/60 dark:border-amber-900/40",
      iconBg: "bg-amber-500 text-white",
      filterParam: "Overstock",
    },
    understock: {
      icon: ShieldAlert,
      badge: "Perlu Re-Order",
      textColor: "text-rose-600 dark:text-rose-400",
      bgColor: "bg-rose-50 dark:bg-rose-950/30",
      borderColor: "border-rose-200/60 dark:border-rose-900/40",
      iconBg: "bg-rose-500 text-white",
      filterParam: "Understock",
    },
    unbalanced: {
      icon: CheckCircle2,
      badge: "JS vs Balance Selisih",
      textColor: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
      borderColor: "border-purple-200/60 dark:border-purple-900/40",
      iconBg: "bg-purple-500 text-white",
      filterParam: "",
    },
    unprocessed: {
      icon: Clock,
      badge: "Pending Process",
      textColor: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      borderColor: "border-blue-200/60 dark:border-blue-900/40",
      iconBg: "bg-[#2957A5] text-white",
      filterParam: "Uncompleted",
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className={`rounded-2xl border ${config.borderColor} bg-white dark:bg-gray-900 p-5 shadow-xs transition-all hover:shadow-md dark:border-gray-800`}>
      <div className="flex items-center justify-between">
        <div className={`flex items-center justify-center w-11 h-11 rounded-xl ${config.iconBg} shadow-xs`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${config.bgColor} ${config.textColor}`}>
          {config.badge}
        </span>
      </div>

      <div className="mt-4">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {title}
        </span>
        <div className="flex items-baseline justify-between mt-1">
          <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
            {value.toLocaleString()}
          </h3>
          <span className="text-xs text-gray-400 font-normal">items</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
        <Link
          href="/balance"
          className={`inline-flex items-center gap-1 font-semibold ${config.textColor} hover:underline`}
        >
          <span>Lihat di Balance</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
