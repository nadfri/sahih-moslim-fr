import Link from "next/link";
import { PlusIcon } from "lucide-react";

type LinkAddHadithProps = {
  closeMobileMenu?: () => void;
};

export function LinkAddHadith({ closeMobileMenu }: LinkAddHadithProps) {
  return (
    <Link
      href="/hadiths/add"
      className={`
        w-full sm:w-auto inline-flex items-center justify-center
        bg-emerald-50 dark:bg-emerald-900/50 
        text-emerald-600 dark:text-emerald-400 
        p-2 rounded-md 
        hover:bg-emerald-100 dark:hover:bg-emerald-800/60 
        hover:text-emerald-700 dark:hover:text-emerald-300
        transition-all duration-200
      `}
      onClick={closeMobileMenu}
    >
      <PlusIcon className="size-5.5" />
    </Link>
  );
}
