"use client";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Locale, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useRef } from "react";
import { useClickOutside } from "@/src/hooks/useClickOutside";
import Image from "next/image";

// Locale configurations with flags
const localeConfig = {
  fr: { flag: "/flag_fr.svg", label: "Français" },
  en: { flag: "/flag_en.svg", label: "English" },
  ar: { flag: "/flag_ar.svg", label: "العربية" },
} as const;

function LocaleToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locales = routing.locales;
  const currentLocale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside (custom hook)
  useClickOutside(dropdownRef, () => setIsOpen(false));

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleLocaleChange = (selectedLocale: Locale) => {
    const queryString = searchParams.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.replace({ pathname: newUrl }, { locale: selectedLocale });
    setIsOpen(false);
  };

  return (
    <div
      className="relative min-w-6"
      ref={dropdownRef}
    >
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className="flex items-center w-6"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Change language - Current: ${localeConfig[currentLocale].label}`}
      >
        <Image
          src={localeConfig[currentLocale].flag}
          alt={localeConfig[currentLocale].label}
          width={24}
          height={24}
          style={{ height: "100%" }}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className="fadeIn absolute -top-[9px] -left-[9px] bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded-md shadow-lg z-50"
          role="listbox"
        >
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => handleLocaleChange(locale)}
              className="flex items-center justify-center p-2 w-full hover:bg-gray-50 dark:hover:bg-neutral-800"
              role="option"
              aria-selected={locale === currentLocale}
            >
              <div className="relative w-6 h-4.5">
                <Image
                  src={localeConfig[locale].flag}
                  alt={localeConfig[locale].label}
                  fill
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* Wrapper component to use Suspense cause useSearchParams */
export function LocaleToggleSuspense() {
  return (
    <Suspense fallback={null}>
      <LocaleToggle />
    </Suspense>
  );
}
