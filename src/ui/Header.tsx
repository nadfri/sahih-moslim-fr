"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Menu, PlusIcon, X } from "lucide-react";
import { useSession } from "next-auth/react";

import { ButtonSignOut } from "./connexion/ButtonSignOut";

// Navigation links
const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/chapters", label: "Chapitres" },
  { href: "/narrators", label: "Narrateurs" },
  { href: "/sahabas", label: "Compagnons" },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  // Check if we're in development mode
  const isDev = process.env.NODE_ENV !== "production";

  // Get session status to show/hide sign out button
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="bg-white text-emerald-800 shadow-sm sticky top-0 z-50">
      {/* Added py-2 for consistent vertical padding */}
      <div className="flex justify-between items-center relative px-1 py-2">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center md:items-start space-x-2 hover:text-emerald-600 transition-colors flex-shrink-0"
          onClick={closeMobileMenu}
        >
          <BookOpen
            className="text-emerald-600 group-hover:text-emerald-700 transition-colors h-8 w-8 md:h-22 md:w-22 flex-shrink-0" // Added flex-shrink-0 to icon
            strokeWidth="1"
          />
          {/* Original title for mobile */}
          <span className="text-xl font-bold font-serif md:hidden">
            Sahih Muslim <span className="text-emerald-600">FR</span>
          </span>
          {/* New multi-line title structure for desktop */}
          <div className="hidden md:flex md:flex-col md:leading-tight">
            <span className="text-xl font-bold font-serif">Sahih</span>
            <span className="text-xl font-bold font-serif">Muslim</span>
            <span className="text-xl font-bold font-serif text-emerald-600">
              FR
            </span>
          </div>
        </Link>

        <nav className="hidden md:block ml-6">
          <ul className="flex space-x-6 items-center">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
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

            {/* Add button - only visible in development mode */}
            {isDev && (
              <li>
                <Link
                  href="/hadiths/add"
                  className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 px-3 py-1.5 rounded-md transition-colors"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>Ajouter</span>
                </Link>
              </li>
            )}

            {/* Sign out button - only visible when authenticated and in development mode */}
            {isAuthenticated && isDev && (
              <li>
                <ButtonSignOut />
              </li>
            )}
          </ul>
        </nav>
        {/* Hamburger button */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            aria-label="Ouvrir le menu principal"
            aria-expanded={isMobileMenuOpen}
            className="text-emerald-700 hover:text-emerald-900 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
          >
            {isMobileMenuOpen ? (
              <X className="h-8" />
            ) : (
              <Menu className="h-8" />
            )}
          </button>
        </div>
      </div>
      <div
        className={`
          overflow-hidden md:hidden transition-[max-height] duration-300 ease-in-out bg-white
          ${isMobileMenuOpen ? "max-h-96" : "max-h-0"}
        `}
      >
        <nav className="container mx-auto px-4 pt-2 pb-4 border-t border-gray-100">
          <ul className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
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

            {/* Add button - only visible in development mode */}
            {isDev && (
              <li>
                <Link
                  href="/hadiths/add"
                  className="flex items-center gap-2 py-2.5 px-3 rounded-md text-base font-medium bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 transition-colors"
                  onClick={closeMobileMenu}
                >
                  <PlusIcon className="h-5 w-5" />
                  <span>Ajouter un hadith</span>
                </Link>
              </li>
            )}

            {/* Sign out button in mobile menu - only visible when authenticated and in development mode */}
            {isAuthenticated && isDev && (
              <li className="mt-3">
                <ButtonSignOut />
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
