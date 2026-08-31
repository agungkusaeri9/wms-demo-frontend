"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useRouter } from "next/navigation";
import { deleteCookie, getCookie } from "cookies-next/client";
import Loading from "../common/Loading";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({
    name: ""
  });

  const router = useRouter();

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  useEffect(() => {
    const userCookie = getCookie('user');
    if (userCookie) {
      try {
        setUser(JSON.parse(userCookie));
      } catch (error) {
        console.error("Failed to parse user cookie:", error);
      }
    }
  }, []);

  const handleLogout = async () => {
    deleteCookie('token', { path: '/' });
    deleteCookie('user', { path: '/' });
    <Loading/>
    router.push("/");
  }
  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dark:text-gray-400 dropdown-toggle"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <Image
            width={44}
            height={44}
            src="/images/avatar.png"
            alt="User"
          />
        </span>

        <span className="block mr-1 font-medium text-theme-sm"> {user.name || "Guest"}</span>

        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
            }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-900 z-50"
      >
        {user?.name ? (
          <>
            <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 mb-1">
              <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                {user.name}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 capitalize">
                User WMS
              </p>
            </div>

            <Link
              href="/profile"
              onClick={closeDropdown}
              className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-gray-700 rounded-lg group hover:bg-gray-100 hover:text-[#2957A5] dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-blue-400 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-gray-500 group-hover:text-[#2957A5] dark:group-hover:text-blue-400"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Edit Profile</span>
            </Link>

            <Link
              href="/profile/change-password"
              onClick={closeDropdown}
              className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-gray-700 rounded-lg group hover:bg-gray-100 hover:text-purple-600 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-purple-400 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-gray-500 group-hover:text-purple-600 dark:group-hover:text-purple-400"
              >
                <circle cx="7.5" cy="15.5" r="5.5" />
                <path d="m21 2-9.6 9.6" />
                <path d="m15.5 7.5 3 3L22 7l-3-3" />
              </svg>
              <span>Ganti Password</span>
            </Link>

            <div className="my-1 border-t border-gray-100 dark:border-gray-800" />

            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                closeDropdown();
                handleLogout();
              }}
              className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-red-600 rounded-lg group hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-red-500"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Sign out</span>
            </Link>
          </>
        ) : (
          <Link
            href="/"
            onClick={closeDropdown}
            className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-gray-700 rounded-lg group hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18.75 12h-9m0 0l3-3m-3 3l3 3"
              />
            </svg>
            <span>Sign in</span>
          </Link>
        )}
      </Dropdown>
    </div>
  );
}
