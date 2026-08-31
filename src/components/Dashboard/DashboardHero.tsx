"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowDownLeft, Scale, FileSpreadsheet, Building2, RefreshCw, Calendar } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function DashboardHero() {
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || "PT Toho Technology Indonesia";
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>(
    new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
  );

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
      queryClient.invalidateQueries({ queryKey: ["recent-stock-ins"] }),
      queryClient.invalidateQueries({ queryKey: ["recent-stock-outs"] }),
      queryClient.invalidateQueries({ queryKey: ["understock-kanbans"] }),
      queryClient.invalidateQueries({ queryKey: ["dashboard-po-total"] }),
      queryClient.invalidateQueries({ queryKey: ["dashboard-pr-total"] }),
    ]);
    setLastUpdated(new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }));
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1B3D78] via-[#2957A5] to-[#1E4C9A] p-6 text-white shadow-md">
      {/* Background Decorative Shapes */}
      <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-medium text-blue-100 border border-white/10">
              <Building2 className="w-3.5 h-3.5" />
              <span>{companyName}</span>
            </div>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[11px] font-medium text-blue-100 border border-white/10 backdrop-blur-sm transition-all cursor-pointer"
              title="Perbarui Data Realtime"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>Live Sync ({lastUpdated})</span>
            </button>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Warehouse Management System
          </h1>
          <p className="text-sm text-blue-100/90 mt-1 max-w-xl">
            Monitoring inventaris real-time, pergerakan stock in/out, dan status kanban pergudangan.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-blue-200/80 mt-2 font-medium">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>{today}</span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/stock-ins"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold backdrop-blur-sm transition-all shadow-xs"
          >
            <ArrowDownLeft className="w-4 h-4 text-emerald-300" />
            <span>Stock In</span>
          </Link>
          <Link
            href="/stock-outs"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold backdrop-blur-sm transition-all shadow-xs"
          >
            <ArrowUpRight className="w-4 h-4 text-rose-300" />
            <span>Stock Out</span>
          </Link>
          <Link
            href="/balance"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold backdrop-blur-sm transition-all shadow-xs"
          >
            <Scale className="w-4 h-4 text-amber-300" />
            <span>Balance</span>
          </Link>
          <Link
            href="/purchase-orders"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>PO History</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
