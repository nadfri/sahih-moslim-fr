import { Logo } from "./Logo";
import { NavBar } from "./NavBar";
import { HeaderActions } from "./HeaderActions";

export function Header() {
  return (
    <header className="bg-white dark:bg-gray-900 md:bg-white/70 md:dark:bg-gray-900/70 md:backdrop-blur-md text-emerald-800 dark:text-emerald-400 shadow-sm dark:shadow-gray-800 sticky top-0 z-50">
      <div className="flex justify-between items-center relative px-1 py-2">
        <Logo />

        {/* Desktop Nav */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-4">
          <NavBar />
        </div>

        {/* Actions and Hamburger Menu */}
        <HeaderActions />
      </div>
    </header>
  );
}
