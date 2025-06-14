import Link from "next/link";
import { usePathname } from "next/navigation";

// Navigation links
export const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/chapters", label: "Chapitres" },
  { href: "/narrators", label: "Narrateurs" },
  { href: "/sahabas", label: "Compagnons" },
  { href: "/transmitters", label: "Transmetteurs" },
  { href: "/search", label: "Recherche" },
];

type NavBarProps = {
  isMobile?: boolean;
  closeMobileMenu?: () => void;
};

export function NavBar({ isMobile = false, closeMobileMenu }: NavBarProps) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Determine list and nav wrapper classes based on device
  const listClass = isMobile
    ? "flex flex-col space-y-1"
    : "flex gap-5 items-center";

  // Compute dynamic classes for links
  const getLinkClasses = (active: boolean) =>
    isMobile
      ? [
          "block py-2.5 px-3 rounded-md text-base font-medium transition-colors",
          active
            ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400 font-semibold"
            : "text-gray-700 dark:text-gray-300 hover:text-emerald-800 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30",
        ].join(" ")
      : [
          "text-base font-medium transition-colors pb-1",
          active
            ? "text-emerald-700 dark:text-emerald-400 font-semibold border-b-2 border-emerald-500 dark:border-emerald-600"
            : "text-gray-600 dark:text-gray-400 hover:text-emerald-700 dark:hover:text-emerald-400 border-b-2 border-transparent hover:border-emerald-500/30 dark:hover:border-emerald-600/30",
        ].join(" ");

  return (
    <nav>
      <ul className={listClass}>
        {navLinks.map((link) => {
          const active = isActive(link.href);
          return (
            <li key={`${isMobile ? "mobile" : "desktop"}-${link.href}`}>
              <Link
                href={link.href}
                className={getLinkClasses(active)}
                {...(isMobile && { onClick: closeMobileMenu })}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
