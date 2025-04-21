import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-sm text-gray-600">
          <p>
            © {currentYear}{" "}
            <span className="font-semibold text-emerald-800">
              Sahih Muslim FR
            </span>
            . Tous droits réservés.
          </p>

          <p className="mt-2 text-xs text-gray-500">
            Faciliter l'accès aux enseignements authentiques rapportés par
            l'Imam Muslim.
          </p>

          <nav className="mt-4">
            <ul className="flex justify-center items-center space-x-4 text-xs">
              <li>
                <Link
                  href="/about"
                  className="text-gray-500 hover:text-emerald-700 transition-colors"
                >
                  À Propos
                </Link>
              </li>
              <li>
                <span className="text-gray-300">|</span>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-500 hover:text-emerald-700 transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <span className="text-gray-300">|</span>
              </li>
              <li>
                <Link
                  href="/confidentialite"
                  className="text-gray-500 hover:text-emerald-700 transition-colors"
                >
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
