"use client";

import { useState } from "react";
import { Github, LoaderCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/src/lib/auth/supabase/client";
import { useTranslations } from "next-intl";

export function ButtonGithub() {
  const t = useTranslations("signin");

  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();

      // Build the callback URL safely
      let nextParam = "/";
      if (callbackUrl) {
        try {
          // If callbackUrl is absolute, use as is; if relative, use window.location.origin as base
          const url = new URL(callbackUrl, window.location.origin);
          nextParam = url.pathname + url.search;
        } catch {
          nextParam = "/";
        }
      }
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextParam)}`;

      // Sign in with GitHub
      await supabase.auth.signInWithOAuth({
        provider: "github",
        options: { redirectTo },
      });
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
      className="flex items-center justify-center gap-2 w-full max-w-100 px-4 py-3 text-base font-medium rounded-md transition-all duration-200 bg-emerald-50 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-800/60 hover:text-emerald-700 dark:hover:text-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
    >
      {isLoading ? (
        <>
          <LoaderCircle
            className="h-5 w-5 animate-spin"
            aria-hidden="true"
          />
          <span>{t("loading")}</span>
        </>
      ) : (
        <>
          <Github
            className="h-5 w-5"
            aria-hidden="true"
          />
          <span>{t("github")}</span>
        </>
      )}
    </button>
  );
}
