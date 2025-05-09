import { Menu, X } from "lucide-react";

type Props = {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
};

export function Hamburger({ isMobileMenuOpen, toggleMobileMenu }: Props) {
  return (
    <div className="block md:hidden">
      <button
        onClick={toggleMobileMenu}
        aria-label="Ouvrir le menu"
        aria-expanded={isMobileMenuOpen}
        className="text-emerald-700 hover:text-emerald-900 p-2 rounded-md"
      >
        {isMobileMenuOpen ? (
          <X className="size-8" />
        ) : (
          <Menu className="size-8" />
        )}
      </button>
    </div>
  );
}
