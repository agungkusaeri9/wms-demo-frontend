"use client";
import React, { useState } from "react";
import Breadcrumb from "@/components/common/Breadcrumb";
import UserService from "@/services/UserService";
import { useMutation } from "@tanstack/react-query";
import { KeyRound, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft, ShieldCheck } from "lucide-react";
import Swal from "sweetalert2";
import Link from "next/link";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const updatePasswordMutation = useMutation({
    mutationFn: UserService.updateProfile,
    onSuccess: () => {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      Swal.fire({
        icon: "success",
        title: "Password Berhasil Diubah",
        text: "Kata sandi akun Anda telah berhasil diperbarui.",
        timer: 2500,
        showConfirmButton: false,
      });
    },
    onError: (error: any) => {
      Swal.fire({
        icon: "error",
        title: "Gagal Mengubah Password",
        text: error?.response?.data?.errors || "Password saat ini salah atau tidak valid.",
      });
    },
  });

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      Swal.fire({
        icon: "warning",
        title: "Password Saat Ini Wajib Diisi",
        text: "Masukkan password saat ini untuk verifikasi keamanan.",
      });
      return;
    }
    if (newPassword.length < 5) {
      Swal.fire({
        icon: "warning",
        title: "Password Terlalu Pendek",
        text: "Password baru minimal terdiri dari 5 karakter.",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Konfirmasi Password Tidak Cocok",
        text: "Password baru dan konfirmasi password harus sama persis.",
      });
      return;
    }

    updatePasswordMutation.mutate({
      current_password: currentPassword,
      new_password: newPassword,
    });
  };

  return (
    <div className="space-y-6 w-full">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Profile", href: "/profile" },
          { label: "Ganti Password" },
        ]}
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Ganti Kata Sandi (Password)
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Ubah password akun secara aman dengan verifikasi password lama
              </p>
            </div>
          </div>

          <Link
            href="/profile"
            className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Profil</span>
          </Link>
        </div>

        <form onSubmit={handleSavePassword} className="space-y-4 mt-5">
          {/* Current Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Password Saat Ini <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Masukkan password saat ini"
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:border-purple-600 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 dark:border-gray-800 dark:bg-gray-900 dark:text-white pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Password Baru <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                required
                minLength={5}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 5 karakter"
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:border-purple-600 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 dark:border-gray-800 dark:bg-gray-900 dark:text-white pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Konfirmasi Password Baru <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                minLength={5}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ketik ulang password baru"
                className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-hidden focus:ring-2 dark:bg-gray-900 dark:text-white pr-10 ${
                  confirmPassword && confirmPassword !== newPassword
                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/20 dark:border-rose-900"
                    : "border-gray-200 focus:border-purple-600 focus:ring-purple-500/20 dark:border-gray-800"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {confirmPassword && confirmPassword !== newPassword && (
              <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>Konfirmasi password belum cocok.</span>
              </p>
            )}
            {confirmPassword && confirmPassword === newPassword && (
              <p className="text-[11px] text-emerald-500 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Password cocok.</span>
              </p>
            )}
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={updatePasswordMutation.isPending}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{updatePasswordMutation.isPending ? "Memproses..." : "Perbarui Kata Sandi"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
