"use client";

import { LoaderCircle, PowerOff } from "lucide-react";

import { useAuth } from "@/src/hooks/useAuth";

export function ButtonSignOut() {
  const { user, loading, signOut } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={loading}
      className="w-full sm:w-auto inline-flex items-center justify-center bg-orange-50 dark:bg-orange-700 text-orange-600 dark:text-orange-300 p-2 rounded-md hover:bg-orange-200 dark:hover:bg-orange-900/70 hover:text-orange-700 dark:hover:text-orange-400"
    >
      {loading ? (
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
