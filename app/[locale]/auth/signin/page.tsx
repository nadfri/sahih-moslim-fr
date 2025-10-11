/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { Route, type Metadata } from "next";
import { ParamsLocale } from "@/src/types/types";
import { redirect } from "next/navigation";
import { getServerUser } from "@/src/lib/auth/supabase/helpers";
import { ButtonGithub } from "@/src/ui/SignButtons/ButtonGithub";
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function SignInPage(props: {
  params: ParamsLocale;
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const user = await getServerUser();
  const { locale } = await props.params;
  setRequestLocale(locale);

  const { callbackUrl } = await props.searchParams;

  if (user) {
    redirect((callbackUrl || "/") as Route);
  }

  const t = await getTranslations("signin");

  return (
    <div className="container mx-auto py-8 flex flex-col items-center">
      <h1 className="title">{t("title")}</h1>
      <p className="mb-10 text-slate-600 dark:text-slate-400">
        {t("description")}
      </p>
      <ButtonGithub />
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("signin");

  return {
    title: `${t("title")} | Moslim`,
    description: t("description"),
  };
}
