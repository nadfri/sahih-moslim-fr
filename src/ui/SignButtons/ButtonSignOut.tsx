"use client";
import { createClient } from "@/src/lib/auth/supabase/client";
import { PowerOff } from "lucide-react";
import { useRouter } from "@/i18n/navigation";

export function ButtonSignOut() {
  const router = useRouter();

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();

    router.refresh();
    router.push("/");
  };

  return (
    <button
      type="button"
      onClick={signOut}
      className="w-full sm:w-auto inline-flex items-center justify-center bg-orange-100 dark:bg-orange-700/20 text-orange-600 dark:text-orange-300 p-1.5 rounded-md hover:bg-orange-200 dark:hover:bg-orange-700/30 hover:text-orange-700 dark:hover:text-orange-400"
    >
      <PowerOff
        className="size-4"
        aria-hidden="true"
      />
    </button>
  );
}
