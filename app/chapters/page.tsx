/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/
import Link from "next/link";

import { getAllChapters } from "@/src/services/services";
import { slugify } from "@/src/utils/slugify";

export default function ChaptersPage() {
  const chapters = getAllChapters();
  return (
    <div className="container mx-auto max-w-6xl">
      {/* Un peu plus large */}
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-center text-emerald-800 mb-12 md:mb-16 tracking-tight">
        Chapitres de Sahih Muslim
      </h1>
      {/* Grille pour les cartes de chapitre */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {chapters.map((chapter, index) => (
          <Link
            // Créez une URL dynamique pour chaque chapitre, ex: /chapitres/La-Foi
            href={`/chapters/${slugify(chapter.title)}`}
            key={chapter.title}
            className="group block h-full" // `group` permet de styliser les enfants au survol du lien
          >
            <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col p-6 transition-all duration-300 ease-in-out border border-transparent group-hover:shadow-xl group-hover:border-emerald-300 group-hover:-translate-y-1">
              {/* Contenu principal de la carte */}
              <div className="flex-grow">
                {/* Numéro de chapitre stylisé */}
                <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                  Chapitre {index + 1}
                </span>

                {/* Titre du Chapitre */}
                <h2 className="text-xl font-semibold font-serif text-emerald-800 mb-2 group-hover:text-emerald-600 transition-colors">
                  {chapter.title}
                </h2>

                {/* Plage de Hadiths */}
                <p className="text-sm text-gray-500">
                  Hadiths {chapter.range[0]} – {chapter.range[1]}
                </p>
              </div>

              {/* Indicateur de navigation (apparaît plus clairement au survol) */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-sm font-medium text-emerald-600 flex items-center group-hover:text-emerald-700 transition-colors">
                  Explorer
                  {/* Petite flèche SVG */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
