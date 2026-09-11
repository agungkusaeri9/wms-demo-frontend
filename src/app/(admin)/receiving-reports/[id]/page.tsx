"use client";
import React from "react";
import { useParams } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import Breadcrumb from "@/components/common/Breadcrumb";
import ButtonLink from "@/components/ui/button/ButtonLink";
import { dateFormat } from "@/utils/dateFormat";
import { useFetchById } from "@/hooks/useFetchDetailData";
import ReceivingReportService from "@/services/ReceivingReportService";
import { ReceivingReport } from "@/types/receivingReport";
import {
  ArrowLeft,
  Package,
  Calendar,
  Layers,
  MapPin,
  Building2,
  Factory,
  Boxes,
  TrendingUp,
  Tag,
} from "lucide-react";

export default function ReceivingReportDetailPage() {
  const params = useParams();
  const id = Number(params?.id);
  const { data: report, isLoading } = useFetchById<ReceivingReport>(
    ReceivingReportService.getById,
    id,
    "receivingReport"
  );

  if (isLoading || !report) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const kanban = report.Kanban;

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Receiving Reports", href: "/receiving-reports" },
            { label: `Detail #${report.id}` },
          ]}
        />
        <ButtonLink
          href="/receiving-reports"
          variant="secondary"
          size="sm"
          className="inline-flex items-center gap-1.5 w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar</span>
        </ButtonLink>
      </div>

      {/* Header Metric Banner */}
      <div className="rounded-2xl border border-emerald-100 dark:border-emerald-950/60 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent p-6 dark:from-emerald-950/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#107C41] text-white shadow-xs">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Receiving Report #{report.id}
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300">
                  Diterima
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Dicatat pada {dateFormat(report.created_at, "DD MMMM YYYY, HH:mm")} WIB
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white dark:bg-gray-900 px-4 py-2.5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-2xs">
            <div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                Kuantitas Diterima
              </p>
              <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                +{report.received_quantity.toLocaleString()}{" "}
                <span className="text-xs font-normal text-gray-500">
                  {kanban?.uom || "Pcs"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Information Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Product & Kanban Info */}
        <div className="lg:col-span-2 space-y-6">
          <ComponentCard title="Informasi Barang / Kanban" className="w-full">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" /> Product / Kanban Code
                </span>
                <p className="text-sm font-semibold font-mono text-gray-900 dark:text-white">
                  {report.kanban_code || "-"}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" /> Satuan (UOM)
                </span>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {kanban?.uom || "Pcs"}
                </p>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Deskripsi Barang (Description)
                </span>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {kanban?.description || "-"}
                </p>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Spesifikasi (Specification)
                </span>
                <p className="text-sm font-normal text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/40 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                  {kanban?.specification || "Tidak ada spesifikasi tambahan"}
                </p>
              </div>
            </div>
          </ComponentCard>

          <ComponentCard title="Lokasi & Produsen" className="w-full">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Lokasi Rak (Rack)
                </span>
                <p className="text-sm font-semibold font-mono text-gray-900 dark:text-white">
                  {kanban?.rack?.code || "-"}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  <Factory className="w-3.5 h-3.5" /> Area Mesin (Machine Area)
                </span>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {kanban?.machine_area?.name || "-"}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" /> Maker (Produsen)
                </span>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {kanban?.maker?.name || "-"}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" /> Supplier Terdaftar
                </span>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {kanban?.supplier
                    ? Array.isArray(kanban.supplier)
                      ? (kanban.supplier as any[]).map((s: any) => s.name).join(", ")
                      : (kanban.supplier as any).name || "-"
                    : "-"}
                </p>
              </div>
            </div>
          </ComponentCard>
        </div>

        {/* Right Column: Stock Status & Counters */}
        <div className="space-y-6">
          <ComponentCard title="Status Stok Terkait" className="w-full">
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <Boxes className="w-3.5 h-3.5" /> Stock In Qty (Siap Scan)
                  </span>
                  <span className="text-sm font-bold font-mono text-emerald-700 dark:text-emerald-400">
                    {kanban?.stock_in_quantity ?? 0} {kanban?.uom || "Pcs"}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                  Kuantitas barang yang telah diterima dan siap dimasukkan ke rak melalui scan mobile Stock In.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" /> Saldo Stok (Balance)
                  </span>
                  <span className="text-sm font-bold font-mono text-blue-700 dark:text-blue-400">
                    {kanban?.balance ?? 0} {kanban?.uom || "Pcs"}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                  Jumlah stok fisik aktif yang saat ini tersedia di rak penyimpanan gudang.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-purple-800 dark:text-purple-300 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5" /> Incoming Order Stock
                  </span>
                  <span className="text-sm font-bold font-mono text-purple-700 dark:text-purple-400">
                    {kanban?.incoming_order_stock ?? 0} {kanban?.uom || "Pcs"}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                  Total kuantitas barang dalam status pesanan PO yang masih berjalan.
                </p>
              </div>
            </div>
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
