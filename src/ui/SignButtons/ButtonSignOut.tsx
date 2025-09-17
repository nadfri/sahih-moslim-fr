"use client";

import { PowerOff } from "lucide-react";

export function ButtonSignOut({ signOut }: { signOut: () => void }) {
  return (
    <button
      type="button"
      onClick={signOut}
      className="w-full sm:w-auto inline-flex items-center justify-center bg-orange-50 dark:bg-orange-700 text-orange-600 dark:text-orange-300 p-2 rounded-md hover:bg-orange-200 dark:hover:bg-orange-900/70 hover:text-orange-700 dark:hover:text-orange-400"
    >
      <PowerOff
        className="size-5"
        aria-hidden="true"
      />
    </button>
  );
}
