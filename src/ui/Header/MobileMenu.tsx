"use client";
import { useState } from "react";
import { Logo } from "./Logo";
import { NavBar } from "./NavBar";
import { Hamburger } from "./Hamburger";
import { LinkAddHadith } from "./LinkAddHadith";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle";
import { SignButtons } from "../SignButtons/SignButtons";

export function MobileMenu() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="md:hidden">
      <div className="flex justify-between items-center relative px-1 p-2">
        <Logo />

        <div className="inline-flex gap-2">
          <ThemeToggle />

          <Hamburger
            isMobileMenuOpen={isMobileMenuOpen}
            toggleMobileMenu={toggleMobileMenu}
          />
        </div>
      </div>

      <div
        className={`
          bg-white dark:bg-gray-900
          overflow-hidden transition-[max-height] duration-200 ease-in-out
          ${isMobileMenuOpen ? "max-h-96" : "max-h-0"}
        `}
        onClick={closeMobileMenu}
      >
        <div className="container mx-auto px-4 pt-2 pb-4 border-t border-gray-100 dark:border-gray-800">
          <NavBar isMobile />

          <div className="flex flex-col gap-2 mt-2">
            {/* Admin buttons */}
            <LinkAddHadith />
            {/* Auth buttons */}
            <SignButtons />
          </div>
        </div>
      </div>
    </div>
  );
}
