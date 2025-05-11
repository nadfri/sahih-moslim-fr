"use client";

import { LoaderCircle, PowerOff } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export function ButtonSignOut() {
  const { status } = useSession();

  if (status === "unauthenticated" || process.env.NODE_ENV === "production") {
    return null;
  }

  const isLoading = status === "loading";

  return (
    <button
      type="button"
      onClick={() => signOut({ redirectTo: "/", redirect: true })}
      disabled={isLoading}
      className="
        w-full sm:w-auto inline-flex items-center justify-center sm:justify-start gap-2 text-base font-medium bg-orange-50 dark:bg-orange-700 text-orange-600 dark:text-orange-300 px-3 py-2 rounded-md
        hover:bg-orange-200 dark:hover:bg-orange-900/70 hover:text-orange-700 dark:hover:text-orange-400 transition-all duration-200"
    >
      {isLoading ? (
        <LoaderCircle
          className="size-5 animate-spin"
          aria-hidden="true"
        />
      ) : (
        <PowerOff
          className="size-5"
          aria-hidden="true"
        />
      )}
    </button>
  );
}
