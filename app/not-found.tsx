import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-16">
      <div className="bg-gray-50 dark:bg-gray-800 p-8 sm:p-12 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-w-md w-full">
        <h1 className="text-6xl sm:text-8xl font-bold text-emerald-600 dark:text-emerald-500 mb-6">
          404
        </h1>
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Page Introuvable
        </h2>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-8">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors duration-200 ease-in-out text-base sm:text-lg font-medium"
          >
            Retour à l'accueil
          </Link>
          {/* You can add another link here, for example, to a sitemap or contact page */}
          {/*
          <Link
            href="/contact"
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 ease-in-out text-base sm:text-lg font-medium"
          >
            Nous Contacter
          </Link>
          */}
        </div>
      </div>
      <p className="mt-12 text-sm text-gray-500 dark:text-gray-400">
        Si vous pensez qu'il s'agit d'une erreur, n'hésitez pas à nous le
        signaler.
      </p>
    </div>
  );
}
