import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">
        Accès non autorisé
      </h1>
      <p className="text-lg mb-6">
        Vous n'avez pas les autorisations nécessaires pour accéder à cette page.
      </p>
      <p className="mb-8">
        Seuls les administrateurs peuvent accéder à cette section.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
