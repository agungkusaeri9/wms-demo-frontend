"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { setCookie } from "cookies-next/client";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AxiosError } from "axios";
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ChevronRight,
  Warehouse,
  CheckCircle2,
} from "lucide-react";

import { loginValidation } from "@/validators/auth/login";
import AuthService from "@/services/AuthService";
import handleError from "@/utils/handleErrors";
import Checkbox from "@/components/form/input/Checkbox";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";

type LoginFormData = z.infer<typeof loginValidation>;

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isChecked, setIsChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const {
    mutate: loginMutation,
    isPending: loading,
  } = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await AuthService.login(data);
      const role = response.data.data.role;

      if (role !== "admin") {
        throw new Error("Selain admin tidak memiliki hak akses untuk login");
      }

      return response;
    },
    onSuccess: (response) => {
      setCookie("user", response.data.data, {
        path: "/",
        secure: false,
        sameSite: "lax",
      });
      setCookie("token", response.data.data.token, {
        path: "/",
        secure: false,
        sameSite: "lax",
      });
      setIsRedirecting(true);
      setTimeout(() => {
        router.push(callbackUrl);
      }, 1200);
    },
    onError: (error: AxiosError) => {
      handleError(error);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginValidation),
    mode: "onChange",
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation(data);
  };

  const handleWithoutLogin = () => {
    localStorage.setItem("role", "guest");
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-[#F8F9FA] dark:bg-gray-950">
      {/* ================= LEFT SECTION (BRAND BLUE #2957A5) ================= */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-[#2957A5] to-[#1B3D78] p-12 xl:p-16 text-white">
        {/* Subtle grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.6) 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />

        {/* Top Logo Container */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-3 bg-white rounded-xl px-4 py-2.5 shadow-md">
            <Image
              src="/images/logo/toho-logo.png"
              alt="TOHO Logo"
              width={120}
              height={36}
              className="h-8 w-auto object-contain"
              priority
            />
          </div>
        </div>

        {/* Center WMS Header */}
        <div className="relative z-10 my-auto max-w-lg">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-blue-100/90 mb-3 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full w-fit">
            <Warehouse className="h-4 w-4 text-white" />
            <span>Warehouse Management System</span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-bold tracking-tight text-white leading-snug">
            Stock Control &amp; Warehouse System
          </h1>

          <p className="mt-4 text-sm text-blue-50/90 leading-relaxed">
            Sistem terintegrasi untuk pengelolaan stok, monitoring material, dan alur operasional pergudangan secara real-time.
          </p>
        </div>

        {/* Bottom Footer */}
        <div className="relative z-10 text-xs text-blue-200/80">
          {process.env.NEXT_PUBLIC_COMPANY_NAME || "PT Toho Technology Indonesia"}
        </div>
      </div>

      {/* ================= RIGHT SECTION (LOGIN FORM WITH LIGHT CARD) ================= */}
      <div className="flex flex-1 flex-col justify-between p-6 sm:p-10 lg:w-1/2 relative">
        {/* Top Navigation */}
        <div className="flex items-center justify-between w-full">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-2">
            <div className="bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-xs">
              <Image
                src="/images/logo/toho-logo.png"
                alt="Logo"
                width={90}
                height={28}
                className="h-6 w-auto object-contain"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={handleWithoutLogin}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3.5 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-[#2957A5] shadow-xs transition-colors"
            >
              <span>Without Login</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

            <ThemeToggleButton />
          </div>
        </div>

        {/* Center Form Card */}
        <div className="my-auto w-full max-w-md mx-auto py-6">
          <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-7 sm:p-9 shadow-lg shadow-gray-200/40 dark:shadow-none">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Sign In
              </h2>
              <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                Masukkan username dan password Anda untuk masuk ke sistem.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                >
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    placeholder="Masukkan username"
                    {...register("username")}
                    disabled={loading}
                    className={`w-full rounded-xl border pl-10 pr-3 py-2.5 text-sm bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:ring-2 ${
                      errors.username
                        ? "border-red-500 focus:ring-red-500/20"
                        : "border-gray-200 dark:border-gray-700 focus:border-[#2957A5] focus:ring-[#2957A5]/20"
                    } disabled:opacity-50`}
                  />
                </div>
                {errors.username && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    {...register("password")}
                    disabled={loading}
                    className={`w-full rounded-xl border pl-10 pr-10 py-2.5 text-sm bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:ring-2 ${
                      errors.password
                        ? "border-red-500 focus:ring-red-500/20"
                        : "border-gray-200 dark:border-gray-700 focus:border-[#2957A5] focus:ring-[#2957A5]/20"
                    } disabled:opacity-50`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="keep-logged-in"
                    checked={isChecked}
                    onChange={setIsChecked}
                  />
                  <label
                    htmlFor="keep-logged-in"
                    className="text-xs text-gray-600 dark:text-gray-400 cursor-pointer select-none"
                  >
                    Keep me logged in
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2957A5] hover:bg-[#1B3D78] text-white text-sm font-semibold shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span>Loading...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full text-center text-xs text-gray-400 dark:text-gray-500">
          Warehouse Management System
        </div>
      </div>

      {/* ================= REDIRECTING TO DASHBOARD OVERLAY ================= */}
      {isRedirecting && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 dark:bg-gray-950/95 backdrop-blur-md transition-all duration-300">
          <div className="flex flex-col items-center max-w-sm w-full mx-4 p-8 text-center bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800">
            {/* Animated Icon */}
            <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 mb-5 shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
              <span className="absolute -inset-1 rounded-2xl border-2 border-emerald-500/40 animate-ping pointer-events-none" />
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Login Berhasil!
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
              Menyiapkan sesi &amp; mengalihkan ke Dashboard WMS...
            </p>

            {/* Animated Bouncing Dots */}
            <div className="flex items-center justify-center gap-2 mt-6">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2957A5] animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#2957A5] animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
