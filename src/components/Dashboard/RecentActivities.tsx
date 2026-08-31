"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight, Clock, ArrowRight } from "lucide-react";
import { dateFormat } from "@/utils/dateFormat";
import { StockIn } from "@/types/stockIn";
import { StockOut } from "@/types/stockOut";

interface Props {
  stockIns?: StockIn[];
  stockOuts?: StockOut[];
}

export default function RecentActivities({ stockIns = [], stockOuts = [] }: Props) {
  const [tab, setTab] = useState<"all" | "in" | "out">("all");

  const normalizedIns = stockIns.map((item) => ({
    id: item.id,
    type: "IN" as const,
    code: item.kanban_code || item.kanban?.code || "-",
    description: item.kanban?.description || "-",
    rack: item.kanban?.rack?.code || "-",
    quantity: item.quantity,
    created_at: item.created_at,
    actor: item.operator?.name || "Operator",
    link: `/stock-ins/${item.id}`,
  }));

  const normalizedOuts = stockOuts.map((item) => ({
    id: item.id,
    type: "OUT" as const,
    code: item.kanban_code || item.kanban?.code || "-",
    description: item.kanban?.description || "-",
    rack: item.kanban?.rack?.code || "-",
    quantity: item.quantity,
    created_at: item.created_at,
    actor: item.requester?.name || item.operator?.name || "Requester",
    link: `/stock-outs/${item.id}`,
  }));

  const allItems = [...normalizedIns, ...normalizedOuts]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 6);

  const displayedItems =
    tab === "all"
      ? allItems
      : tab === "in"
      ? normalizedIns.slice(0, 6)
      : normalizedOuts.slice(0, 6);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 shadow-xs h-full flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-[#2957A5] dark:text-blue-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Aktivitas Transaksi Terbaru
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Log pergerakan Stock In &amp; Stock Out
              </p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-medium">
            <button
              onClick={() => setTab("all")}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                tab === "all"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs font-semibold"
                  : "text-gray-500 hover:text-gray-800 dark:text-gray-400"
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setTab("in")}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                tab === "in"
                  ? "bg-emerald-500 text-white shadow-xs font-semibold"
                  : "text-gray-500 hover:text-gray-800 dark:text-gray-400"
              }`}
            >
              Stock In
            </button>
            <button
              onClick={() => setTab("out")}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                tab === "out"
                  ? "bg-rose-500 text-white shadow-xs font-semibold"
                  : "text-gray-500 hover:text-gray-800 dark:text-gray-400"
              }`}
            >
              Stock Out
            </button>
          </div>
        </div>

        {/* Transaction List */}
        <div className="divide-y divide-gray-100 dark:divide-gray-800 mt-2">
          {displayedItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-400">
              Belum ada riwayat aktivitas transaksi.
            </div>
          ) : (
            displayedItems.map((item, idx) => (
              <div
                key={`${item.type}-${item.id}-${idx}`}
                className="py-2.5 flex items-center justify-between gap-3 hover:bg-gray-50/75 dark:hover:bg-gray-800/40 rounded-xl px-2 transition-colors"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ${
                      item.type === "IN"
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                        : "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
                    }`}
                  >
                    {item.type === "IN" ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>

                  <div className="overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900 dark:text-white whitespace-nowrap">
                        {item.code}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-mono">
                        Rack: {item.rack}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5 max-w-[200px] sm:max-w-xs">
                      {item.description} • <span className="italic">{item.actor}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-xs font-extrabold ${
                      item.type === "IN"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {item.type === "IN" ? `+${item.quantity}` : `-${item.quantity}`}
                  </span>
                  <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                    {dateFormat(item.created_at, "DD MMM, HH:mm")}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
        <Link
          href="/stock-ins"
          className="text-xs text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
        >
          Lihat Stock In
        </Link>
        <Link
          href="/stock-outs"
          className="inline-flex items-center gap-1 font-semibold text-[#2957A5] hover:underline dark:text-blue-400"
        >
          <span>Lihat Riwayat Lengkap</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
