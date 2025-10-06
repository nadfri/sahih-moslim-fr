import { ScanEye } from "lucide-react";
import { useTranslations } from "next-intl";

export function Preview() {
  const t = useTranslations("hadith");

  return (
    <span className="text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-1 rounded inline-flex items-center gap-1">
      <ScanEye
        className="h-3.5 w-3.5"
        aria-hidden="true"
      />
      {t("preview")}
    </span>
  );
}
