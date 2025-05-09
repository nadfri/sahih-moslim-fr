"use client";

import { useState } from "react";

import { ButtonSignOut } from "../connexion/ButtonSignOut";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { Hamburger } from "./Hamburger";
import { LinkAddHadith } from "./LinkAddHadith";
import { Logo } from "./Logo";
import { NavBar } from "./NavBar";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="bg-white text-emerald-800 shadow-sm sticky top-0 z-50">
      <div className="flex justify-between items-center relative px-1 py-2">
        {/* Logo */}
        <Logo closeMobileMenu={closeMobileMenu} />

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-end gap-4 flex-1 px-1">
          <NavBar />
        </div>

        <div className="flex items-center gap-2 ml-2">
          <div className="hidden md:flex items-center gap-2">
            <LinkAddHadith />
            <ButtonSignOut />
          </div>

          <ThemeToggle />

          <Hamburger
            isMobileMenuOpen={isMobileMenuOpen}
            toggleMobileMenu={toggleMobileMenu}
          />
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`
          overflow-hidden md:hidden transition-[max-height] duration-300 ease-in-out bg-white
          ${isMobileMenuOpen ? "max-h-96" : "max-h-0"}
        `}
      >
        <div className="container mx-auto px-4 pt-2 pb-4 border-t border-gray-100">
          <NavBar
            isMobile={true}
            closeMobileMenu={closeMobileMenu}
          />

          <div className="flex flex-col gap-2 mt-2">
            <LinkAddHadith closeMobileMenu={closeMobileMenu} />
            <ButtonSignOut />
          </div>
        </div>
      </div>
    </header>
  );
}
