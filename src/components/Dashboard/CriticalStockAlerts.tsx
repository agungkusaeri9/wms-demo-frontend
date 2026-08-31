"use client";
import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowRight, PlusCircle, AlertCircle } from "lucide-react";
import { Kanban } from "@/types/kanban";

interface Props {
  criticalItems?: Kanban[];
  isLoading?: boolean;
}

export default function CriticalStockAlerts({ criticalItems = [], isLoading = false }: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 shadow-xs h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>Alert Understock</span>
                {criticalItems.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                    {criticalItems.length}
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Item stok di bawah batas minimum (Perlu Re-Order)
              </p>
            </div>
          </div>
        </div>

        {/* List of Critical Items */}
        <div className="divide-y divide-gray-100 dark:divide-gray-800 mt-2">
          {isLoading ? (
            <div className="py-8 text-center text-xs text-gray-400">
              Memuat data understock...
            </div>
          ) : criticalItems.length === 0 ? (
            <div className="py-8 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 flex items-center justify-center mb-2">
                <AlertCircle className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                Semua Stok Aman
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Tidak ada item yang mencapai batas understock.
              </p>
            </div>
          ) : (
            criticalItems.slice(0, 5).map((item) => {
              const currentBalance = item.balance ?? 0;
              const minQty = item.min_quantity ?? 0;
              const deficit = minQty - currentBalance;

              return (
                <div
                  key={item.id}
                  className="py-2.5 flex items-center justify-between gap-3 hover:bg-gray-50/75 dark:hover:bg-gray-800/40 rounded-xl px-2 transition-colors"
                >
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900 dark:text-white">
                        {item.code}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                        Rack: {item.rack?.code || "-"}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5 max-w-[180px]">
                      {item.description || item.specification || "-"}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1.5 justify-end">
                      <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                        Sisa: {currentBalance}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        / Min: {minQty}
                      </span>
                    </div>
                    <span className="inline-block mt-0.5 text-[10px] font-semibold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/50 px-1.5 py-0.5 rounded">
                      Kurang {deficit > 0 ? deficit : 0} {item.uom || "pcs"}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
        <Link
          href="/manual-purchase-orders/create"
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Buat PO Baru</span>
        </Link>
        <Link
          href="/balance"
          className="inline-flex items-center gap-1 font-semibold text-[#2957A5] hover:underline dark:text-blue-400"
        >
          <span>Buka Balance</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
