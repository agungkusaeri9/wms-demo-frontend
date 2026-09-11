"use client";

import React, { useState } from "react";
import {
  Code2,
  Trash2,
  RotateCcw,
  CheckCircle2,
  ShoppingCart,
  FileText,
  Boxes,
  Database,
  PackagePlus,
  Send,
  Zap,
  Play,
  ArrowRight,
  ClipboardList,
  Sparkles,
  Info
} from "lucide-react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import DevModeService, {
  ResetSummary,
  FullFlowSimulationResponse,
  StockCountersResponse,
} from "@/services/DevModeService";

export default function DevelopmentModePage() {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [lastResetSummary, setLastResetSummary] = useState<ResetSummary | null>(
    null
  );
  const [lastSimulationResult, setLastSimulationResult] =
    useState<FullFlowSimulationResponse | null>(null);
  const [lastStockResult, setLastStockResult] =
    useState<StockCountersResponse | null>(null);

  // Form State for Manual Stock Counters
  const [kanbanCode, setKanbanCode] = useState("");
  const [stockInQty, setStockInQty] = useState<number>(5);
  const [incomingStock, setIncomingStock] = useState<number>(10);

  // 1. Reset Semua Data Handler
  const handleResetAll = async () => {
    const confirm = await Swal.fire({
      title: "Konfirmasi Reset Semua Data?",
      text: "Tindakan ini akan menghapus seluruh data Purchase Order, Purchase Request, Manual PO, Stock In, Stock Out, dan mengembalikan saldo stok master Kanban ke nilai awal!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Ya, Reset Semua Data!",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });

    if (!confirm.isConfirmed) return;

    setLoadingAction("reset_all");
    try {
      const res = await DevModeService.resetAll();
      setLastResetSummary(res.data);
      setLastSimulationResult(null);
      setLastStockResult(null);
      Swal.fire({
        title: "Berhasil!",
        text: "Semua data transaksi dan counter stok telah berhasil direset.",
        icon: "success",
        confirmButtonColor: "#2563EB",
      });
      toast.success("Semua data transaksi berhasil direset!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Gagal melakukan reset data");
    } finally {
      setLoadingAction(null);
    }
  };

  // 2. Full Flow Simulation Handler (PR -> PO -> RR -> Stock Counters for all 20 Kanbans)
  const handleSimulateFullFlow = async () => {
    const confirm = await Swal.fire({
      title: "Jalankan Simulasi Alur Penuh?",
      text: "Sistem akan secara otomatis membuat dokumen Purchase Request baru, Purchase Order (On Order), Receiving Report, dan mengisi incoming_order_stock & stock_in_quantity pada 20 barang Kanban dengan jumlah yang berbeda-beda per barang.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563EB",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Ya, Jalankan Simulasi",
      cancelButtonText: "Batal",
    });

    if (!confirm.isConfirmed) return;

    setLoadingAction("simulate_full");
    try {
      const res = await DevModeService.simulateFullFlow();
      setLastSimulationResult(res.data);
      setLastStockResult(null);

      Swal.fire({
        title: "Simulasi Berhasil!",
        html: `
          <div class="text-left text-sm space-y-2">
            <p><strong>No. PR:</strong> <code class="bg-gray-100 px-1 py-0.5 rounded text-blue-600">${res.data.pr_number}</code></p>
            <p><strong>No. PO:</strong> <code class="bg-gray-100 px-1 py-0.5 rounded text-indigo-600">${res.data.po_number}</code></p>
            <p><strong>Total Barang:</strong> ${res.data.total_items} Kanban Items</p>
            <p class="text-xs text-gray-500 mt-2">Data Purchase Request & Purchase Order telah dibuat secara nyata di database, dan 20 barang Kanban kini siap di-scan di mobile Stock In.</p>
          </div>
        `,
        icon: "success",
        confirmButtonColor: "#2563EB",
      });

      toast.success("Simulasi alur penuh PR ➔ PO ➔ RR berhasil dibuat!");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Gagal menjalankan simulasi alur penuh"
      );
    } finally {
      setLoadingAction(null);
    }
  };

  // 3. Set Stock Counters for Single Kanban Handler
  const handleSetSingleStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kanbanCode.trim()) {
      toast.error("Silakan masukkan Kode Kanban!");
      return;
    }

    setLoadingAction("set_single");
    try {
      const res = await DevModeService.updateStockCounters({
        kanban_code: kanbanCode.trim(),
        stock_in_quantity: Number(stockInQty),
        incoming_order_stock: Number(incomingStock),
      });

      setLastStockResult(res.data);
      toast.success(
        `Berhasil mengupdate Stock In Qty (${stockInQty}) & Incoming Stock (${incomingStock}) untuk ${kanbanCode.trim()}!`
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Gagal mengupdate counter stok kanban"
      );
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl border border-amber-200/60 dark:border-amber-900/40">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Development Mode
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 rounded-full">
                Developer Utility
              </span>
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Simulasi alur pengadaan (PR ➔ PO ➔ Receiving Report), pengisian counter Stock In, dan reset database.
            </p>
          </div>
        </div>
      </div>

      {/* ─── FITUR 1: RESET SEMUA DATA (Between Layout) ─── */}
      <div className="bg-gradient-to-r from-red-50/70 via-white to-red-50/30 dark:from-red-950/20 dark:via-gray-800 dark:to-red-950/10 p-6 rounded-2xl border border-red-200/80 dark:border-red-900/40 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Sisi Kiri: Informasi Reset Semua Data */}
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg">
                <Trash2 className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Reset Semua Data Transaksi
              </h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Menghapus seluruh riwayat transaksi mencakup <strong>Purchase Orders</strong>, <strong>Purchase Requests</strong>, <strong>Manual PO</strong>, <strong>Stock In</strong>, dan <strong>Stock Out</strong>, serta mengembalikan seluruh saldo stok Kanban ke data master awal (<code className="text-xs bg-red-100/80 dark:bg-red-900/40 text-red-700 dark:text-red-300 px-1.5 py-0.5 rounded">js_ending_quantity</code>).
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-gray-500 dark:text-gray-400">
              <span className="inline-flex items-center gap-1 bg-white/80 dark:bg-gray-700/60 px-2.5 py-1 rounded-md border border-gray-200 dark:border-gray-600">
                <ShoppingCart className="w-3.5 h-3.5 text-blue-500" /> PO & Staging
              </span>
              <span className="inline-flex items-center gap-1 bg-white/80 dark:bg-gray-700/60 px-2.5 py-1 rounded-md border border-gray-200 dark:border-gray-600">
                <FileText className="w-3.5 h-3.5 text-indigo-500" /> PR & Details
              </span>
              <span className="inline-flex items-center gap-1 bg-white/80 dark:bg-gray-700/60 px-2.5 py-1 rounded-md border border-gray-200 dark:border-gray-600">
                <Boxes className="w-3.5 h-3.5 text-emerald-500" /> Stock In/Out
              </span>
              <span className="inline-flex items-center gap-1 bg-white/80 dark:bg-gray-700/60 px-2.5 py-1 rounded-md border border-gray-200 dark:border-gray-600">
                <Database className="w-3.5 h-3.5 text-purple-500" /> Balance Sync
              </span>
            </div>
          </div>

          {/* Sisi Kanan: Tombol Eksekusi Reset */}
          <div className="flex items-center shrink-0">
            <button
              onClick={handleResetAll}
              disabled={loadingAction !== null}
              className="w-full md:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loadingAction === "reset_all" ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Memproses Reset...</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Semua Data</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Summary Result Banner (if Reset Executed) */}
      {lastResetSummary && (
        <div className="bg-emerald-50 dark:bg-emerald-950/30 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800/40">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
              Hasil Ringkasan Reset Terakhir
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.entries(lastResetSummary).map(([key, val]) => (
              <div
                key={key}
                className="bg-white/90 dark:bg-gray-800/90 p-3 rounded-xl border border-emerald-100 dark:border-gray-700"
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {key.replace(/_/g, " ")}
                </div>
                <div className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
                  {val} dihapus
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── FITUR 2: SIMULASI ALUR PENUH (PR ➔ PO ➔ RR ➔ STOCK IN) (Between Layout) ─── */}
      <div className="bg-gradient-to-r from-blue-50/80 via-white to-indigo-50/40 dark:from-blue-950/20 dark:via-gray-800 dark:to-indigo-950/10 p-6 rounded-2xl border border-blue-200/80 dark:border-blue-900/40 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-blue-100 dark:border-gray-700">
          {/* Sisi Kiri: Informasi Simulasi Alur Penuh */}
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg">
                <Play className="w-5 h-5 fill-current" />
              </span>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Simulasi Alur Penuh (PR ➔ PO ➔ Receiving Report)
              </h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Membuat data transaksi nyata di database: menerbitkan <strong>Purchase Request</strong>, <strong>Purchase Order (status On Order)</strong>, mencatat <strong>Receiving Report</strong>, dan mengisi kolom <code className="text-xs bg-blue-100/80 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-1 py-0.5 rounded font-mono">incoming_order_stock</code> dan <code className="text-xs bg-emerald-100/80 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-1 py-0.5 rounded font-mono">stock_in_quantity</code> pada <strong>20 barang Kanban</strong> dengan kuantitas yang bervariasi dan tidak sama per barang.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-gray-500 dark:text-gray-400">
              <span className="inline-flex items-center gap-1 bg-white/80 dark:bg-gray-700/60 px-2.5 py-1 rounded-md border border-blue-200 dark:border-gray-600 font-semibold text-blue-700 dark:text-blue-300">
                <FileText className="w-3.5 h-3.5" /> Auto Create PR
              </span>
              <span className="inline-flex items-center gap-1 bg-white/80 dark:bg-gray-700/60 px-2.5 py-1 rounded-md border border-blue-200 dark:border-gray-600 font-semibold text-indigo-700 dark:text-indigo-300">
                <ShoppingCart className="w-3.5 h-3.5" /> Auto Create PO (On Order)
              </span>
              <span className="inline-flex items-center gap-1 bg-white/80 dark:bg-gray-700/60 px-2.5 py-1 rounded-md border border-blue-200 dark:border-gray-600 font-semibold text-emerald-700 dark:text-emerald-300">
                <ClipboardList className="w-3.5 h-3.5" /> Receiving Report
              </span>
              <span className="inline-flex items-center gap-1 bg-white/80 dark:bg-gray-700/60 px-2.5 py-1 rounded-md border border-blue-200 dark:border-gray-600 font-semibold text-purple-700 dark:text-purple-300">
                <PackagePlus className="w-3.5 h-3.5" /> Ready for Mobile Scan
              </span>
            </div>
          </div>

          {/* Sisi Kanan: Tombol Jalankan Simulasi */}
          <div className="flex items-center shrink-0">
            <button
              onClick={handleSimulateFullFlow}
              disabled={loadingAction !== null}
              className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loadingAction === "simulate_full" ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Menjalankan Simulasi...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Jalankan Simulasi (20 Kanban)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Result Table for Full Simulation */}
        {lastSimulationResult && (
          <div className="p-4 bg-white/90 dark:bg-gray-900/90 rounded-xl border border-blue-200 dark:border-blue-900/40 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  Hasil Simulasi: {lastSimulationResult.total_items} Barang Kanban Siap Di-Scan
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 px-2.5 py-1 rounded-md font-mono font-semibold border border-blue-200 dark:border-blue-800">
                  PR: {lastSimulationResult.pr_number}
                </span>
                <span className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 px-2.5 py-1 rounded-md font-mono font-semibold border border-indigo-200 dark:border-indigo-800">
                  PO: {lastSimulationResult.po_number}
                </span>
              </div>
            </div>

            <div className="max-h-72 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <table className="w-full text-left text-xs text-gray-700 dark:text-gray-300">
                <thead className="bg-gray-50 dark:bg-gray-800 text-[11px] uppercase tracking-wider text-gray-500 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
                  <tr>
                    <th className="px-3.5 py-2.5 font-semibold">Kode Kanban</th>
                    <th className="px-3.5 py-2.5 font-semibold">Nama Barang</th>
                    <th className="px-3.5 py-2.5 font-semibold text-center text-blue-700 dark:text-blue-300">
                      PO Quantity (Incoming)
                    </th>
                    <th className="px-3.5 py-2.5 font-semibold text-center text-emerald-700 dark:text-emerald-300">
                      Stock In Qty (Received)
                    </th>
                    <th className="px-3.5 py-2.5 font-semibold text-center text-orange-700 dark:text-orange-300">
                      Sisa On Order
                    </th>
                    <th className="px-3.5 py-2.5 font-semibold text-center">Saldo Master</th>
                    <th className="px-3.5 py-2.5 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 font-mono">
                  {lastSimulationResult.items.map((item) => (
                    <tr key={item.code} className="hover:bg-blue-50/30 dark:hover:bg-gray-800/60">
                      <td className="px-3.5 py-2 font-bold text-gray-900 dark:text-white">
                        {item.code}
                      </td>
                      <td className="px-3.5 py-2 font-sans font-medium text-gray-800 dark:text-gray-200 truncate max-w-[180px]">
                        {item.description}
                      </td>
                      <td className="px-3.5 py-2 text-center text-blue-600 font-bold">
                        {item.po_quantity}
                      </td>
                      <td className="px-3.5 py-2 text-center text-emerald-600 font-bold bg-emerald-50/50 dark:bg-emerald-950/20">
                        +{item.stock_in_quantity}
                      </td>
                      <td className="px-3.5 py-2 text-center text-orange-600">
                        {item.po_quantity - item.stock_in_quantity}
                      </td>
                      <td className="px-3.5 py-2 text-center text-gray-600 dark:text-gray-400">
                        {item.balance}
                      </td>
                      <td className="px-3.5 py-2 text-right">
                        <span className="px-2 py-0.5 text-[10px] font-sans font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 rounded-full">
                          Siap Scan
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Sub-form: Custom Single Kanban Update */}
        <div className="pt-2">
          <h4 className="text-xs font-bold text-gray-600 dark:text-gray-300 mb-2 uppercase tracking-wider">
            Atau Update Manual Per Kode Kanban:
          </h4>
          <form onSubmit={handleSetSingleStock} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Kode Kanban
              </label>
              <input
                type="text"
                placeholder="Contoh: TOHO001"
                value={kanbanCode}
                onChange={(e) => setKanbanCode(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Stock In Qty (Received)
              </label>
              <input
                type="number"
                min="1"
                value={stockInQty}
                onChange={(e) => setStockInQty(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Incoming Order Stock (PO)
              </label>
              <input
                type="number"
                min={stockInQty}
                value={incomingStock}
                onChange={(e) => setIncomingStock(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white font-semibold"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loadingAction !== null}
                className="w-full py-2 px-3 bg-gray-800 hover:bg-gray-900 active:bg-black text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 text-xs shadow-sm cursor-pointer disabled:opacity-50"
              >
                {loadingAction === "set_single" ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Set Counter</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Single Update Live Result */}
          {lastStockResult && (
            <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {lastStockResult.items[0]?.code} berhasil diupdate: Stock In Qty = +{lastStockResult.items[0]?.stock_in_quantity}, Incoming Stock = {lastStockResult.items[0]?.incoming_order_stock}
              </span>
              <span className="text-[10px] bg-emerald-200/60 dark:bg-emerald-800/60 px-2 py-0.5 rounded font-semibold">
                Siap Di-scan
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
