"use client";
import React from "react";
import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight, Scale, FileSpreadsheet, Database, Bell, Layers, Sparkles } from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      title: "Stock Inbound",
      desc: "Catat penerimaan barang masuk",
      href: "/stock-ins",
      icon: ArrowDownLeft,
      color: "from-emerald-500 to-teal-600",
      iconColor: "text-emerald-500",
      bgLight: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      title: "Stock Outbound",
      desc: "Pengeluaran sparepart & material",
      href: "/stock-outs",
      icon: ArrowUpRight,
      color: "from-rose-500 to-red-600",
      iconColor: "text-rose-500",
      bgLight: "bg-rose-50 dark:bg-rose-950/30",
    },
    {
      title: "Balance & Stok",
      desc: "Cek saldo kanban & posisi rak",
      href: "/balance",
      icon: Scale,
      color: "from-blue-500 to-indigo-600",
      iconColor: "text-[#2957A5]",
      bgLight: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      title: "Purchase Order",
      desc: "Import PO & monitoring pesanan",
      href: "/purchase-orders",
      icon: FileSpreadsheet,
      color: "from-emerald-600 to-green-700",
      iconColor: "text-[#107C41]",
      bgLight: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      title: "Kanban Staging",
      desc: "Assign & verifikasi kanban baru",
      href: "/kanban-stagings",
      icon: Layers,
      color: "from-purple-500 to-violet-600",
      iconColor: "text-purple-500",
      bgLight: "bg-purple-50 dark:bg-purple-950/30",
    },
    {
      title: "Master Data",
      desc: "Kelola operator, rak, mesin, area",
      href: "/operators",
      icon: Database,
      color: "from-slate-600 to-gray-700",
      iconColor: "text-slate-600",
      bgLight: "bg-slate-50 dark:bg-slate-900/40",
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-[#2957A5] dark:text-blue-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Pusat Operasional Cepat
            </h3>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Akses instan modul pergudangan WMS
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Link
              key={act.title}
              href={act.href}
              className="group p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-900/50 bg-gray-50/50 hover:bg-white dark:bg-gray-800/30 dark:hover:bg-gray-800 transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between"
            >
              <div className={`w-9 h-9 rounded-lg ${act.bgLight} ${act.iconColor} flex items-center justify-center mb-2.5 transition-transform group-hover:scale-105`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-[#2957A5] dark:group-hover:text-blue-400 transition-colors">
                  {act.title}
                </h4>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">
                  {act.desc}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
