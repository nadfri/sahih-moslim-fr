/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { type Metadata } from "next";
import { redirect } from "next/navigation";

import { getServerUser } from "@/src/lib/auth/auth";
import { ButtonGithub } from "@/src/ui/connexion/ButtonGithub";

export const metadata: Metadata = {
  title: "Se connecter",
  description:
    "Connectez-vous avec votre compte GitHub pour accéder aux fonctionnalités d'administration",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  // Check if user is already authenticated
  const user = await getServerUser();

  if (user) {
    // User is already authenticated, redirect to callbackUrl or home
    const params = await searchParams;
    const callbackUrl = params.callbackUrl || "/";
    redirect(callbackUrl);
  }

  return (
    <div className="container mx-auto py-8 flex flex-col items-center">
      <h1 className="title">Se connecter</h1>
      <p className="mb-10 text-slate-600 dark:text-slate-400">
        Connectez-vous avec votre compte GitHub pour accéder aux fonctionnalités
        d'administration
      </p>

      <ButtonGithub />
    </div>
  );
}
