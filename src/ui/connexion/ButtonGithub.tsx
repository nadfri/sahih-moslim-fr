"use client";

import { useState } from "react";
import { Github, LoaderCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { useAuth } from "@/src/hooks/useAuth";

export function ButtonGithub() {
  const { signInWithGitHub } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGitHub(callbackUrl || undefined);
    } catch (error) {
      console.error("Error during sign in:", error);
      setIsLoading(false);
    }
    // Note: setIsLoading(false) will happen on page redirect or in useEffect cleanup
  };

  return (
    <button
      onClick={handleSignIn}
      disabled={isLoading}
      className="flex items-center justify-center gap-2 w-full max-w-[400px] px-4 py-3 text-base font-medium rounded-md transition-all duration-200 bg-emerald-50 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-800/60 hover:text-emerald-700 dark:hover:text-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
    >
      {isLoading ? (
        <>
          <LoaderCircle
            className="h-5 w-5 animate-spin"
            aria-hidden="true"
          />
          <span>Connexion en cours...</span>
        </>
      ) : (
        <>
          <Github
            className="h-5 w-5"
            aria-hidden="true"
          />
          <span>Connexion avec Github</span>
        </>
      )}
    </button>
  );
}
