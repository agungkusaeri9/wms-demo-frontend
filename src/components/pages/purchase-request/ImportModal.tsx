"use client";
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { UploadCloud, FileSpreadsheet, X, FileCheck, AlertCircle, ArrowUpCircle, Download } from "lucide-react";
import PurchaseRequestService from "@/services/PurchaseRequestService";
import handleError from "@/utils/handleErrors";
import Button from "@/components/ui/button/Button";

export default function ImportPurchaseRequestModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const queryClient = useQueryClient();

  const handleDownloadTemplate = async () => {
    try {
      setIsDownloading(true);
      await PurchaseRequestService.downloadTemplate();
      toast.success("Template Purchase Request berhasil didownload!");
    } catch (error: any) {
      toast.error("Gagal mendownload template file.");
    } finally {
      setIsDownloading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.ms-excel.sheet.binary.macroEnabled.12": [".xlsb"],
      "text/csv": [".csv"],
    },
    maxFiles: 1,
    multiple: false,
  });

  const { mutate: importMutation, isPending: isLoading } = useMutation({
    mutationFn: async (file: File) => {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });

      return PurchaseRequestService.importExcel({
        file: base64,
        filename: file.name,
      });
    },
    onSuccess: () => {
      toast.success("File Purchase Request berhasil diimport!");
      queryClient.invalidateQueries({ queryKey: ["purchaseRequests"] });
      handleClose();
    },
    onError: (error: any) => {
      handleError(error);
    },
  });

  const handleClose = () => {
    if (isLoading) return;
    setSelectedFile(null);
    setIsOpen(false);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast.error("Silakan pilih file excel terlebih dahulu.");
      return;
    }
    importMutation(selectedFile);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <>
      {/* Trigger Button */}
      <Button
        type="button"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="bg-[#107C41] hover:bg-[#0E6C38] text-white flex items-center gap-2 cursor-pointer shadow-theme-xs"
      >
        <FileSpreadsheet className="w-4 h-4" />
        <span>Import Excel</span>
      </Button>

      {/* Modal Backdrop & Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden transform transition-all">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-[#107C41] dark:text-emerald-400">
                  <UploadCloud className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900 dark:text-white">
                    Import Purchase Request
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Upload file excel (.xlsb / .xlsx / .xls / .csv)
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={isLoading}
                type="button"
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {/* Template Download Card */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-blue-600 text-white shrink-0 shadow-xs">
                    <FileSpreadsheet className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-900 dark:text-white">
                      Template Purchase Request
                    </h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      Gunakan format template standar (.xlsb)
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  disabled={isDownloading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-300 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800 rounded-lg shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {isDownloading ? (
                    <span className="inline-block animate-spin h-3.5 w-3.5 border-2 border-blue-600 border-t-transparent rounded-full" />
                  ) : (
                    <Download className="h-3.5 w-3.5" />
                  )}
                  <span>Download</span>
                </button>
              </div>

              {/* Format Penamaan File Guide */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 text-xs space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-amber-900 dark:text-amber-300">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Format Penamaan File Disarankan</span>
                </div>
                <p className="text-[11px] text-amber-800 dark:text-amber-300/80 leading-relaxed">
                  Gunakan format penamaan standar: <code className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/50 font-mono font-semibold text-amber-900 dark:text-amber-200">PR_DDMMYYYY_Urutan</code>
                </p>
                <p className="text-[11px] text-amber-700 dark:text-amber-400">
                  Contoh: <span className="font-mono font-medium">PR_11092026_1.xlsb</span> (file ke-1), <span className="font-mono font-medium">PR_11092026_2.xlsb</span> (file ke-2 di hari yang sama).
                </p>
              </div>

              {/* Dropzone Area */}
              <div
                {...getRootProps()}
                className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                  isDragActive
                    ? "border-[#107C41] bg-emerald-50/50 dark:bg-emerald-950/20 scale-[0.99]"
                    : isDragReject
                    ? "border-red-500 bg-red-50/50 dark:bg-red-950/20"
                    : "border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/10 hover:border-[#107C41]"
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-[#107C41] dark:text-emerald-400 mb-3 shadow-xs">
                    <FileSpreadsheet className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {isDragActive
                      ? "Lepaskan file excel di sini..."
                      : "Drag & drop file Excel di sini, atau klik"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Mendukung format .xlsb, .xlsx, .xls, atau .csv (Maks. 50 MB)
                  </p>
                </div>
              </div>

              {/* Selected File Card */}
              {selectedFile && (
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-[#107C41] text-white shrink-0 shadow-xs">
                      <FileCheck className="h-5 w-5" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                    disabled={isLoading}
                    className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
                    title="Hapus file"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Info Notice */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 text-[11px] text-gray-500 dark:text-gray-400">
                <AlertCircle className="h-4 w-4 text-[#107C41] shrink-0 mt-0.5" />
                <span>
                  Pastikan format kolom di file Excel sesuai dengan template Purchase Request (terdapat kolom Date, PR No, Department, Budget No, Requested, Gen. Manager).
                </span>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
              <button
                onClick={handleClose}
                disabled={isLoading}
                type="button"
                className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleUpload}
                disabled={isLoading || !selectedFile}
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#107C41] hover:bg-[#0E6C38] rounded-lg shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-3.5 w-3.5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    <span>Mengupload...</span>
                  </>
                ) : (
                  <>
                    <ArrowUpCircle className="h-4 w-4" />
                    <span>Upload &amp; Import</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
