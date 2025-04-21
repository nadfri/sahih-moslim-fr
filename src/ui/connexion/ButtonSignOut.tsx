"use client";

import { PowerOff } from "lucide-react";
import { signOut } from "next-auth/react";

export function ButtonSignOut() {
  return (
    <button
      onClick={() => signOut({ redirectTo: "/", redirect: true })}
      type="button"
      className="
        w-full sm:w-auto inline-flex items-center justify-center sm:justify-start gap-2 text-base font-medium bg-orange-50 text-orange-600 px-3 py-1.5 rounded-md hover:bg-orange-100 hover:text-orange-700 transition-all duration-200
      "
    >
      <PowerOff
        className="w-5 h-5"
        aria-hidden="true"
      />

      <span>Déconnexion</span>
    </button>
  );
}
