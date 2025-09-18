import { Logo } from "./Logo";
import { NavBar } from "./NavBar";
import { LinkAddHadith } from "./LinkAddHadith";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle";
import { SignButtons } from "../SignButtons/SignButtons";

export function DesktopMenu() {
  return (
    <div className="hidden md:flex justify-between items-center relative px-1 p-2">
      <Logo />

      <div className="flex items-center justify-end gap-4 flex-1 px-2">
        <NavBar />
      </div>

      <div className="flex items-center gap-2 ml-3">
        {/* Admin buttons */}
        <LinkAddHadith />
        {/* Auth buttons */}
        <SignButtons />

        <ThemeToggle />
      </div>
    </div>
  );
}
