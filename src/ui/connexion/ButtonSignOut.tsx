"use client";

import { LoaderCircle, PowerOff } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export function ButtonSignOut() {
  const { status } = useSession();

  if (status === "unauthenticated") {
    return null;
  }

  const isLoading = status === "loading";

  return (
    <button
      type="button"
      onClick={() => signOut({ redirectTo: "/", redirect: true })}
      disabled={isLoading}
      className="
        w-full sm:w-auto inline-flex items-center justify-center sm:justify-start gap-2 text-base font-medium bg-orange-50 text-orange-600 px-3 py-2 rounded-md
        hover:bg-orange-200 hover:text-orange-700 transition-all duration-200"
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
