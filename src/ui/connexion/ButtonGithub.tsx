"use client";

import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export function ButtonGithub() {
  // Récupérer le paramètre callbackUrl depuis l'URL
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <button
      onClick={() => signIn("github", { callbackUrl, redirect: true })}
      className="flex items-center justify-center gap-2 w-full rounded-md bg-emerald-700 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-emerald-800 active:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200"
    >
      <span>Connexion avec Github</span>
    </button>
  );
}
