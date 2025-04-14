/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/src/authentification/auth";
import { ButtonGithub } from "@/src/ui/connexion/ButtonGithub";

export const metadata: Metadata = {
  title: "Connexion",
  description:
    "Connectez-vous pour accéder aux fonctionnalités d'administration",
};

export default async function SignInPage() {
  // Check if user is already authenticated
  const session = await auth();

  // Redirect to home if already signed in
  if (session) redirect("/");

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-emerald-700 mb-8">Se connecter</h1>
      <p className="mb-6 text-slate-600">
        Connectez-vous avec votre compte GitHub pour accéder aux fonctionnalités
        d'administration.
      </p>
      <div className="flex justify-center">
        <ButtonGithub />
      </div>
    </div>
  );
}
