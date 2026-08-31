import { ThemeProvider } from "@/context/ThemeContext";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <div className="min-h-screen w-full bg-white dark:bg-gray-950 font-outfit antialiased">
        {children}
      </div>
    </ThemeProvider>
  );
}
