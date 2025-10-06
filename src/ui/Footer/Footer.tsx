import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            © {currentYear}{" "}
            <span className="font-semibold text-emerald-800 dark:text-emerald-500">
              {t("title")}
            </span>
          </p>

          <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
            {t("description")}
          </p>

          {/* <nav className="mt-4">
            <ul className="flex justify-center items-center space-x-4 text-xs">
              <li>
                <Link
                  href="/about"
                  className="text-gray-500 dark:text-gray-400 hover:text-emerald-700 dark:hover:text-emerald-500 transition-colors"
                >
                  À Propos
                </Link>
              </li>
              <li>
                <span className="text-gray-300 dark:text-gray-700">|</span>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-500 dark:text-gray-400 hover:text-emerald-700 dark:hover:text-emerald-500 transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <span className="text-gray-300 dark:text-gray-700">|</span>
              </li>
              <li>
                <Link
                  href="/confidentialite"
                  className="text-gray-500 dark:text-gray-400 hover:text-emerald-700 dark:hover:text-emerald-500 transition-colors"
                >
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </nav> */}
        </div>
      </div>
    </footer>
  );
}
