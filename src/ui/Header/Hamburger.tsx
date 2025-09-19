"use client";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { MobileMenu } from "./MobileMenu";
import { createPortal } from "react-dom";

export function Hamburger() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [headerElement, setHeaderElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setHeaderElement(document.querySelector("header"));
  }, []);

  return (
    <>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Ouvrir le menu"
        aria-expanded={isMobileMenuOpen}
        className="block md:hidden text-emerald-700 dark:text-emerald-500"
      >
        {isMobileMenuOpen ? (
          <X className="size-8" />
        ) : (
          <Menu className="size-8" />
        )}
      </button>

      {headerElement &&
        createPortal(
          <MobileMenu
            isMobileMenuOpen={isMobileMenuOpen}
            closeMobileMenu={() => setIsMobileMenuOpen(false)}
          />,
          headerElement
        )}
    </>
  );
}
