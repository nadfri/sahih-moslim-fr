"use client";
import { Link } from "@/i18n/navigation";
import { PlusIcon } from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";

export function LinkAddHadith() {
  const { isAdmin } = useAuth();

  if (!isAdmin) return null;

  return (
    <Link
      href="/hadiths/add"
      className={`
        inline-flex items-center justify-center
        bg-emerald-50 dark:bg-emerald-900/50 
        text-emerald-600 dark:text-emerald-400 
        p-1 md:p-2 rounded-md 
        hover:bg-emerald-100 dark:hover:bg-emerald-800/60 
        hover:text-emerald-700 dark:hover:text-emerald-300
        transition-all duration-200
      `}
    >
      <PlusIcon className="size-5.5" />
    </Link>
  );
}
