"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/common/Breadcrumb";
import UserService from "@/services/UserService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User, Lock, Save, BadgeCheck, Shield, KeyRound, ArrowRight } from "lucide-react";
import Swal from "sweetalert2";
import { setCookie } from "cookies-next/client";
import Image from "next/image";
import Link from "next/link";

export default function EditProfilePage() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");

  const { data: userProfile, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await UserService.getCurrentUser();
      return res.data;
    },
  });

  useEffect(() => {
    if (userProfile?.name) {
      setName(userProfile.name);
    }
  }, [userProfile]);

  const updateProfileMutation = useMutation({
    mutationFn: UserService.updateProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      if (data?.data) {
        setCookie("user", JSON.stringify(data.data), { path: "/" });
      }
      Swal.fire({
        icon: "success",
        title: "Profil Diperbarui",
        text: "Informasi profil Anda telah berhasil disimpan.",
        timer: 2000,
        showConfirmButton: false,
      });
    },
    onError: (error: any) => {
      Swal.fire({
        icon: "error",
        title: "Gagal Memperbarui Profil",
        text: error?.response?.data?.errors || "Terjadi kesalahan saat menyimpan profil.",
      });
    },
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Nama Lengkap Wajib Diisi",
        text: "Silakan masukkan nama lengkap Anda.",
      });
      return;
    }
    updateProfileMutation.mutate({ name });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2957A5]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Edit Profile" },
        ]}
      />

      {/* User Header Summary */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#2957A5]/20 shadow-md">
              <Image
                width={80}
                height={80}
                src="/images/avatar.png"
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full text-white border-2 border-white dark:border-gray-900">
              <BadgeCheck className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="text-center sm:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {userProfile?.name || "Nama Pengguna"}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-[#2957A5] dark:bg-blue-950/50 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/40">
                {userProfile?.role || "Operator"}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
              @{userProfile?.username}
            </p>
            {userProfile?.operator && (
              <p className="text-xs text-gray-600 dark:text-gray-300 flex items-center justify-center sm:justify-start gap-1 mt-1">
                <span>NIK Operator:</span>
                <span className="font-semibold">{userProfile.operator.nik}</span>
                <span>• {userProfile.operator.name}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#2957A5] dark:text-blue-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Edit Informasi Profil
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Perbarui nama dan identitas akun pengguna
              </p>
            </div>
          </div>

          <Link
            href="/profile/change-password"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-200 dark:border-purple-900/50 bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 text-xs font-semibold hover:bg-purple-100 transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Ganti Password</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 mt-5">
          {/* Username (Read Only) */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                disabled
                value={userProfile?.username || ""}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs text-gray-500 cursor-not-allowed dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400"
              />
              <Lock className="w-3.5 h-3.5 text-gray-400 absolute right-3.5 top-3" />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              Username unik akun tidak dapat diubah.
            </p>
          </div>

          {/* Role (Read Only) */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Role Hak Akses
            </label>
            <input
              type="text"
              disabled
              value={userProfile?.role?.toUpperCase() || "OPERATOR"}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs text-gray-500 font-semibold cursor-not-allowed dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400"
            />
          </div>

          {/* Full Name (Editable) */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Nama Lengkap <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap"
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:border-[#2957A5] focus:outline-hidden focus:ring-2 focus:ring-[#2957A5]/20 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#2957A5] hover:bg-[#1B3D78] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{updateProfileMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
