import React from 'react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-slate-900 text-white py-4 px-3 shadow-md">
      <div className="container flex justify-between items-center">
        <Link href="/" className="text-xl font-bold hover:text-slate-200 transition-colors">
          Sahih Moslim en français
        </Link>
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li>
              <Link href="/" className="hover:text-slate-300 transition-colors">
                Accueil
              </Link>
            </li>
            <li>
              <Link href="/hadiths" className="hover:text-slate-300 transition-colors">
                Hadiths
              </Link>
            </li>
            <li>
              <Link href="/a-propos" className="hover:text-slate-300 transition-colors">
                À propos
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}