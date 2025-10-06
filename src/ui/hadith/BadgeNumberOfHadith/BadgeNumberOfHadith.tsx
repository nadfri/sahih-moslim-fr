import { BookOpenText } from "lucide-react";
import { useTranslations } from "next-intl";

type BadgeNumberOfHadithProps = {
  count: number | undefined;
  size?: "small" | "large";
};

export function BadgeNumberOfHadith({
  count = 0,
  size = "small",
}: BadgeNumberOfHadithProps) {
  const baseClasses = "inline-flex items-center font-medium rounded-md";
  const sizeClasses = {
    small:
      "text-xs inline-flex items-center font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md px-2 py-0.5",
    large:
      "text-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-400 px-3 py-1 mb-4",
  };
  const iconSizeClasses = {
    small: "h-3 w-3 me-1",
    large: "h-4 w-4 me-1.5",
  };

  const t = useTranslations("hadith");

  return (
    <span className={`${baseClasses} ${sizeClasses[size]}`}>
      <BookOpenText className={`${iconSizeClasses[size]}`} />
      {t("hadith-count", { count })}
    </span>
  );
}
