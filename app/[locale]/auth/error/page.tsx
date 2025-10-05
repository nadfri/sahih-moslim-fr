import { Link } from "@/i18n/navigation";
import { ParamsLocale } from "@/src/types/types";
import { getTranslations, setRequestLocale } from "next-intl/server";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ErrorPage(props: {
  params: ParamsLocale;
  searchParams: SearchParams;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const searchParams = await props.searchParams;
  const error = searchParams?.error;

  const t = await getTranslations("auth.error");

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <div className="max-w-lg w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
          {t("title")}
        </h1>

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-4 mb-6">
          <p className="text-gray-800 dark:text-gray-200">
            {error === "Configuration"
              ? t("configurationError")
              : typeof error === "string"
                ? error
                : t("unknownError")}
          </p>
        </div>

        <div className="flex justify-between">
          <Link
            href="/"
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {t("goHome")}
          </Link>

          <Link
            href="/auth/signin"
            className="px-4 py-2 bg-emerald-600 dark:bg-emerald-500 text-white rounded hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors"
          >
            {t("tryAgain")}
          </Link>
        </div>
      </div>
    </div>
  );
}
