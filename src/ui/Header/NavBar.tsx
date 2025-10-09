"use client";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

// Navigation links
export const navLinks = [
  { href: "/", label: "home" },
  { href: "/chapters", label: "chapters" },
  { href: "/sahabas", label: "sahabas" },
  { href: "/transmitters", label: "transmitters" },
  { href: "/search", label: "search" },
] as const;

export function NavBar({ isMobile = false }: { isMobile?: boolean }) {
  const t = useTranslations("header");
  const pathname = usePathname();

  // Determine list classes based on device
  const deviceClass = isMobile
    ? "flex flex-col space-y-1"
    : "flex gap-5 items-center";

  // Compute dynamic classes for links
  const getLinkClasses = (isActive: boolean) => {
    if (isMobile) {
      const base =
        "block py-2.5 px-3 rounded-md text-base font-medium transition-colors";

      return isActive
        ? `${base} bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400 font-semibold`
        : `${base} text-gray-700 dark:text-gray-300 hover:text-emerald-800 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30`;
    }
    const base = "text-base font-medium transition-colors pb-1";

    return isActive
      ? `${base} text-emerald-700 dark:text-emerald-400 font-semibold border-b-2 border-emerald-500 dark:border-emerald-600`
      : `${base} text-gray-600 dark:text-gray-400 hover:text-emerald-700 dark:hover:text-emerald-400 border-b-2 border-transparent hover:border-emerald-500/30 dark:hover:border-emerald-600/30`;
  };

  return (
    <nav>
      <ul className={deviceClass}>
        {navLinks.map((link) => {
          const isActive =
            pathname === link.href ||
            (pathname.startsWith(link.href) && link.href !== "/");
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={getLinkClasses(isActive)}
              >
                {t(link.label)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
