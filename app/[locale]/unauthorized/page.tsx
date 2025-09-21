import { Link } from "@/i18n/navigation";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center p-4 h-full border border-red-600 dark:border-red-500 bg-red-50 dark:bg-gray-800 rounded-lg">
      <h1 className="text-4xl font-bold text-red-600 dark:text-red-400 mb-4">
        Accès non autorisé
      </h1>
      <p className="text-lg mb-6 dark:text-gray-300">
        Vous n'avez pas les autorisations nécessaires pour accéder à cette page.
      </p>
      <p className="mb-8 dark:text-gray-300">
        Seuls les administrateurs peuvent accéder à cette section.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
