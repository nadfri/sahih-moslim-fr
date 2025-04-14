"use client";

import { signOut } from "next-auth/react";

export function ButtonSignOut() {
  return (
    <button
      onClick={() => signOut({ redirectTo: "/", redirect: true })}
      type="button"
      className="
        inline-flex items-center gap-1.5 text-md font-medium bg-orange-50 text-orange-600 px-3 py-1.5 rounded-md hover:bg-orange-100 hover:text-orange-700 transition-all duration-200
      "
    >
      <span>Déconnexion</span>
    </button>
  );
}
