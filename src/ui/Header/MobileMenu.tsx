import { NavBar } from "./NavBar";

type Props = {
  isMobileMenuOpen: boolean;
  closeMobileMenu: () => void;
};

export function MobileMenu({ isMobileMenuOpen, closeMobileMenu }: Props) {
  return (
    <div
      className={`md:hidden bg-white dark:bg-gray-900 overflow-hidden transition-[max-height] duration-200 ease-in-out ${isMobileMenuOpen ? "max-h-96" : "max-h-0"}`}
      onClick={closeMobileMenu}
    >
      <div className="container mx-auto px-4 pt-2 pb-4 border-t border-gray-100 dark:border-gray-800">
        <NavBar isMobile />
      </div>
    </div>
  );
}
