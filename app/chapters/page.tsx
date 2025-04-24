/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/
import Link from "next/link";
import { BookOpenText, MoveRight } from "lucide-react";

import { getAllChapters } from "@/src/services/services";
import { slugify } from "@/src/utils/slugify";

export default async function ChaptersPage() {
  const chapters = await getAllChapters();
  return (
    <div className="container mx-auto max-w-5xl">
      <h1 className="text-3xl md:text-5xl font-serif font-bold text-center text-emerald-800 mb-8 md:mb-12 tracking-tight">
        Chapitres de Sahih Muslim
      </h1>
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {chapters.map((chapter, index) => (
          <Link
            href={`/chapters/${slugify(chapter.title)}`}
            key={chapter.title}
            className="group block h-full"
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

                <p className="text-xs inline-flex items-center font-medium bg-gray-100 text-gray-600 rounded-md px-2 py-0.5">
                  <BookOpenText className="h-3 w-3 mr-1" />
                  {chapter.hadithCount} Hadiths
                </p>
              </div>

              {/* Indicateur de navigation (apparaît plus clairement au survol) */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-sm font-medium text-emerald-600 flex items-center group-hover:text-emerald-700 transition-colors">
                  Explorer
                  {/* Replace SVG with Lucide icon component */}
                  <MoveRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
