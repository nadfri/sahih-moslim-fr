"use client";

import { useSearchParams } from "next/navigation";
import { Github } from "lucide-react";
import { signIn } from "next-auth/react";

export function ButtonGithub() {
  // Récupérer le paramètre callbackUrl depuis l'URL
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <button
      onClick={() => signIn("github", { callbackUrl, redirect: true })}
      className="flex items-center justify-center gap-2 w-full max-w-[400px] rounded-md bg-emerald-700 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-emerald-800 active:bg-emerald-900 transition-all duration-200"
    >
      {/* Add the Github icon */}
      <Github
        className="h-5 w-5"
        aria-hidden="true"
      />
      <span>Connexion avec Github</span>
    </button>
  );
}
