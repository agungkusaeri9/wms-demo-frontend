"use client";
import React from "react";
import Link from "next/link";
import { ShoppingCart, FileText, ArrowRight, PlusCircle, CheckCircle2 } from "lucide-react";

interface Props {
  poTotal?: number;
  prTotal?: number;
}

export default function ProcurementSummary({ poTotal = 0, prTotal = 0 }: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 shadow-xs h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-[#107C41] dark:text-emerald-400">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Status Pengadaan &amp; Order
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Monitoring Purchase Order &amp; Purchase Request
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          {/* PO Card */}
          <div className="p-3.5 rounded-xl border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                  Purchase Orders
                </span>
                <span className="p-1 rounded-md bg-[#107C41] text-white">
                  <ShoppingCart className="w-3 h-3" />
                </span>
              </div>
              <div className="text-2xl font-black text-emerald-900 dark:text-white mt-2">
                {poTotal.toLocaleString()}
              </div>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                Total PO terdaftar
              </p>
            </div>

            <Link
              href="/purchase-orders"
              className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-[#107C41] dark:text-emerald-400 hover:underline"
            >
              <span>Buka PO</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* PR Card */}
          <div className="p-3.5 rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-800 dark:text-blue-300">
                  Purchase Requests
                </span>
                <span className="p-1 rounded-md bg-[#2957A5] text-white">
                  <FileText className="w-3 h-3" />
                </span>
              </div>
              <div className="text-2xl font-black text-blue-900 dark:text-white mt-2">
                {prTotal.toLocaleString()}
              </div>
              <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-0.5">
                Total PR terdaftar
              </p>
            </div>

            <Link
              href="/purchase-requests"
              className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-[#2957A5] dark:text-blue-400 hover:underline"
            >
              <span>Buka PR</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
        <Link
          href="/manual-purchase-orders/create"
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Manual PO Baru</span>
        </Link>
        <Link
          href="/purchase-requests"
          className="inline-flex items-center gap-1 font-semibold text-[#2957A5] hover:underline dark:text-blue-400"
        >
          <span>Import PR</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
