import Link from "next/link";
import { PlusIcon } from "lucide-react";

type LinkAddHadithProps = {
  closeMobileMenu?: () => void;
};

export function LinkAddHadith({ closeMobileMenu }: LinkAddHadithProps) {
  const isDev = process.env.NODE_ENV !== "production";

  if (!isDev) {
    return null;
  }

  return (
    <Link
      href="/hadiths/add"
      className="flex items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-800/60 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors py-1.5 px-3 rounded-md"
      onClick={closeMobileMenu}
    >
      <PlusIcon className="size-5" />
      <span>Ajouter</span>
    </Link>
  );
}
