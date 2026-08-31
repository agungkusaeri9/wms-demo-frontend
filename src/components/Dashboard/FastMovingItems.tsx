"use client";
import React from "react";
import Link from "next/link";
import { Zap, ArrowRight, Package } from "lucide-react";
import { StockOut } from "@/types/stockOut";

interface Props {
  stockOuts?: StockOut[];
}

export default function FastMovingItems({ stockOuts = [] }: Props) {
  // Aggregate consumption by kanban part code
  const itemMap = new Map<string, {
    code: string;
    description: string;
    rack: string;
    totalQty: number;
    count: number;
  }>();

  stockOuts.forEach((out) => {
    const code = out.kanban_code || out.kanban?.code || "Unknown";
    const existing = itemMap.get(code);
    const qty = out.quantity || 1;
    if (existing) {
      existing.totalQty += qty;
      existing.count += 1;
    } else {
      itemMap.set(code, {
        code,
        description: out.kanban?.description || "-",
        rack: out.kanban?.rack?.code || "-",
        totalQty: qty,
        count: 1,
      });
    }
  });

  const sortedItems = Array.from(itemMap.values())
    .sort((a, b) => b.totalQty - a.totalQty)
    .slice(0, 5);

  const maxQty = sortedItems.length > 0 ? sortedItems[0].totalQty : 1;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 shadow-xs h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Top Fast-Moving Parts
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Item sparepart dengan konsumsi pengeluaran tertinggi
              </p>
            </div>
          </div>
        </div>

        {/* Top List */}
        <div className="divide-y divide-gray-100 dark:divide-gray-800 mt-2">
          {sortedItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-400">
              Belum ada data pengeluaran sparepart.
            </div>
          ) : (
            sortedItems.map((item, index) => {
              const percentage = Math.round((item.totalQty / maxQty) * 100);
              return (
                <div key={item.code} className="py-2.5 space-y-1.5 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 px-2 rounded-xl transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-extrabold shrink-0 ${
                        index === 0
                          ? "bg-amber-500 text-white"
                          : index === 1
                          ? "bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-white"
                          : index === 2
                          ? "bg-amber-700 text-white"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                      }`}>
                        {index + 1}
                      </span>
                      <span className="text-xs font-bold text-gray-900 dark:text-white truncate">
                        {item.code}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 font-mono">
                        {item.rack}
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400">
                        {item.totalQty.toLocaleString()} pcs
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
        <Link
          href="/stock-outs"
          className="text-xs text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
        >
          Riwayat Pengeluaran
        </Link>
        <Link
          href="/balance"
          className="inline-flex items-center gap-1 font-semibold text-[#2957A5] hover:underline dark:text-blue-400"
        >
          <span>Cek Stok di Balance</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
