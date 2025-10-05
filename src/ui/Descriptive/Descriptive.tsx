import { useTranslations } from "next-intl";

export function Descriptive() {
  const t = useTranslations("home.descriptive");
  return (
    <div className="max-w-3xl mx-auto my-8 p-6 rounded-lg bg-white/90 dark:bg-gray-800/90 shadow-md">
      <p className="mb-3 text-gray-700 dark:text-gray-300">
        <span className="text-emerald-700 dark:text-emerald-400 font-bold">
          {t("bookName")}
        </span>{" "}
        {t("paragraph1.part1")}{" "}
        <span className="text-emerald-700 dark:text-emerald-400 font-bold">
          {t("hadithCount")}
        </span>{" "}
        {t("paragraph1.part2")}{" "}
        <span className="text-blue-600 dark:text-blue-500 font-medium">
          {t("prophetName")}
        </span>
        {t("paragraph1.part3")}
      </p>
      <p className="mb-3 text-gray-700 dark:text-gray-300">
        {t("paragraph2.part1")}
        <sup>{t("paragraph2.superscript")}</sup>
        {t("paragraph2.part2")} <em>{t("bukharName")}</em>
        {t("paragraph2.part3")}
      </p>
      <p className="text-gray-700 dark:text-gray-300">
        <span className="text-emerald-700 dark:text-emerald-400 font-bold">
          {t("imamName")}
        </span>{" "}
        {t("paragraph3.part1")}
      </p>
    </div>
  );
}
