"use client";

import Link from "next/link";
import { LogIn } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { Route } from "next";

export function ButtonSignIn() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Build current URL with search params if any
  const currentUrl = searchParams.toString()
    ? `${pathname}?${searchParams.toString()}`
    : pathname;

  const href =
    `/auth/signin?callbackUrl=${encodeURIComponent(currentUrl)} ` as Route;

  return (
    <Link
      href={href}
      title="Se connecter"
      className={`
        w-full sm:w-auto inline-flex items-center justify-center
        bg-emerald-50 dark:bg-emerald-900/50 
        text-emerald-600 dark:text-emerald-400 
        p-1 md:p-2 rounded-md 
        hover:bg-emerald-100 dark:hover:bg-emerald-800/60 
        hover:text-emerald-700 dark:hover:text-emerald-300
        transition-all duration-200
      `}
    >
      <LogIn
        className="size-5"
        aria-hidden="true"
      />
    </Link>
  );
}
