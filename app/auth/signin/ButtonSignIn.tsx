"use client";

import Link from "next/link";
import { LogIn, LoaderCircle } from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";

export function ButtonSignIn() {
  const { loading } = useAuth();

  return (
    <Link
      href="/auth/signin"
      title="Se connecter"
      className={`
        w-full sm:w-auto inline-flex items-center justify-center
        bg-emerald-50 dark:bg-emerald-900/50 
        text-emerald-600 dark:text-emerald-400 
        p-2 rounded-md 
        hover:bg-emerald-100 dark:hover:bg-emerald-800/60 
        hover:text-emerald-700 dark:hover:text-emerald-300
        transition-all duration-200
      `}
    >
      {loading ? (
        <LoaderCircle
          className="size-5 animate-spin"
          aria-hidden="true"
        />
      ) : (
        <LogIn
          className="size-5"
          aria-hidden="true"
        />
      )}
    </Link>
  );
}
