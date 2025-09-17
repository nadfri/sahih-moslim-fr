import { DesktopMenu } from "./DesktopMenu";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  return (
    <header className="bg-white dark:bg-gray-900 md:bg-white/70 md:dark:bg-gray-900/70 md:backdrop-blur-sm text-emerald-800 dark:text-emerald-400 shadow-sm dark:shadow-gray-800 sticky top-0 z-50">
      <MobileMenu />
      <DesktopMenu />
    </header>
  );
}
