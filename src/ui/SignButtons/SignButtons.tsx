"use client";
import { ButtonSignIn } from "@/src/ui/SignButtons/ButtonSignIn";
import { ButtonSignOut } from "./ButtonSignOut";
import { useAuth } from "@/src/hooks/useAuth";
import { LoaderCircle } from "lucide-react";

export function SignButtons() {
  const { user, loading } = useAuth();

  return (
    <>
      {loading ? (
        <div className="w-full sm:w-auto inline-flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400 p-2 rounded-md">
          <LoaderCircle
            className="size-5 animate-spin"
            aria-hidden="true"
          />
        </div>
      ) : user ? (
        <ButtonSignOut />
      ) : (
        <ButtonSignIn />
      )}
    </>
  );
}
