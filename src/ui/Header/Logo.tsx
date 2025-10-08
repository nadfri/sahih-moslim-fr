import { Link } from "@/i18n/navigation";
import { BookOpen } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

export function Logo() {
  const t = useTranslations("header");
  const locale = useLocale();
  const isArabic = locale === "ar";

  // Common styles for Arabic locale
  const arabicStyle = isArabic ? { lineHeight: "80%" } : undefined;

  const mobileTextSize = isArabic ? "text-2xl" : "text-xl";

  const desktopTextSize = isArabic
    ? "md:text-3xl"
    : "md:text-2xl md:leading-tight";

  return (
    <Link
      href="/"
      className="flex items-center md:items-center space-x-2 text-emerald-500 hover:text-emerald-400 transition-colors"
    >
      <BookOpen
        className="size-8 md:size-22 flex-shrink-0"
        strokeWidth="1"
      />
      {/* Original title for mobile */}
      <span className={`font-bold md:hidden ${mobileTextSize}`}>
        {t("logo-title")}
      </span>

      <div
        className={`hidden md:flex md:flex-col ${desktopTextSize}`}
        style={arabicStyle}
      >
        <span className="font-bold">{t("sahih")}</span>
        <span className="font-bold">{t("moslim")}</span>
      </div>
    </Link>
  );
}
