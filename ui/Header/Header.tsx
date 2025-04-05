"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3BottomRightIcon, BookOpenIcon, XMarkIcon } from "@heroicons/react/24/outline";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/chapters", label: "Chapitres" },
  { href: "/narrators", label: "Narrateurs" },
  { href: "/sahabas", label: "Compagnons" },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="bg-white text-emerald-800 shadow-sm sticky top-0 z-50">
      <div className=" flex justify-between items-center relative px-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2 text-xl md:text-2xl font-bold font-serif hover:text-emerald-600 transition-colors"
          onClick={closeMobileMenu}
        >
          <BookOpenIcon className="text-emerald-600 group-hover:text-emerald-700 transition-colors" />

          <span>
            Sahih Muslim <span className="text-emerald-600">FR</span>
          </span>
        </Link>

        <nav className="hidden md:block">
          <ul className="flex space-x-6 items-center">
            {navLinks.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`
                      text-base font-medium transition-colors pb-1
                      ${
                        isActive
                          ? "text-emerald-700 font-semibold border-b-2 border-emerald-500"
                          : "text-gray-600 hover:text-emerald-700 border-b-2 border-transparent hover:border-emerald-500/30"
                      }
                    `}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        {/* Bouton Hamburger */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            aria-label="Ouvrir le menu principal"
            aria-expanded={isMobileMenuOpen}
            className="text-emerald-700 hover:text-emerald-900 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
          >
            {isMobileMenuOpen ? <XMarkIcon className="h-8" /> : <Bars3BottomRightIcon className="h-8" />}
          </button>
        </div>
      </div>
      <div
        className={`
          overflow-hidden md:hidden transition-[max-height] duration-300 ease-in-out bg-white
          ${isMobileMenuOpen ? "max-h-96" : "max-h-0"} {/* Contrôle la hauteur */}
        `}
      >
        <nav className="container mx-auto px-4 pt-2 pb-4 border-t border-gray-100">
          <ul className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <li key={`mobile-${link.href}`}>
                  <Link
                    href={link.href}
                    className={`
                      block py-2.5 px-3 rounded-md text-base font-medium transition-colors
                      ${
                        isActive
                          ? "bg-emerald-100 text-emerald-800 font-semibold"
                          : "text-gray-700 hover:text-emerald-800 hover:bg-emerald-50"
                      }
                    `}
                    onClick={closeMobileMenu}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
