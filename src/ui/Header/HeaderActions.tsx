import { Hamburger } from "./Hamburger";
import { SignButtons } from "./SignButtons/SignButtons";
import { ThemeToggle } from "./ThemeToggle/ThemeToggle";
import { LinkAddHadith } from "./LinkAddHadith";
import { LocaleToggleSuspense } from "./LocaleToggle/LocaleToggle";

export function HeaderActions() {
  return (
    <div className="flex items-center gap-2 ms-3 me-1">
      <LinkAddHadith />
      <SignButtons />
      <LocaleToggleSuspense />
      <ThemeToggle />
      <Hamburger />
    </div>
  );
}
