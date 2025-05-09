import { Menu, X } from "lucide-react";

type Props = {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
};

export function Hamburger({ isMobileMenuOpen, toggleMobileMenu }: Props) {
  return (
    <button
      onClick={toggleMobileMenu}
      aria-label="Ouvrir le menu"
      aria-expanded={isMobileMenuOpen}
      className="block md:hidden text-emerald-700 dark:text-emerald-500"
    >
      {isMobileMenuOpen ? (
        <X className="size-8" />
      ) : (
        <Menu className="size-8" />
      )}
    </button>
  );
}
