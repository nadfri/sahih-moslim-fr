import { Link } from "@/i18n/navigation";
import { ParamsLocale } from "@/src/types/types";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";

export default function UnauthorizedPage({ params }: { params: ParamsLocale }) {
  const { locale } = use(params);
  setRequestLocale(locale);

  const t = useTranslations("unauthorized");

  return (
    <div className="flex flex-col items-center justify-center text-center p-4 h-full border border-red-600 dark:border-red-500 bg-red-50 dark:bg-gray-800 rounded-lg">
      <h1 className="text-4xl font-bold text-red-600 dark:text-red-400 mb-4">
        {t("title")}
      </h1>
      <p className="text-lg mb-6 dark:text-gray-300">{t("noPermission")}</p>
      <p className="mb-8 dark:text-gray-300">{t("adminOnly")}</p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors"
        >
          {t("backHome")}
        </Link>
      </div>
    </div>
  );
}
