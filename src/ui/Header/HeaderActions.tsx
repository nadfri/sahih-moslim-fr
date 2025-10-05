import { Hamburger } from "./Hamburger";
import { SignButtons } from "../SignButtons/SignButtons";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle";
import { LinkAddHadith } from "./LinkAddHadith";

export function HeaderActions() {
  return (
    <div className="flex items-center gap-2 ms-3 me-1">
      <LinkAddHadith />
      <SignButtons />
      <ThemeToggle />
      <Hamburger />
    </div>
  );
}
