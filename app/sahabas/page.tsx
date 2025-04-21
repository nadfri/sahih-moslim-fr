/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/
import Link from "next/link";

import {
  getAllSahabas,
  getCountHadithsBySahabaSlug,
} from "@/src/services/services";
import { slugify } from "@/src/utils/slugify";

export default function SahabasPage() {
  const sahabas = getAllSahabas();

  return (
    <div className="container mx-auto max-w-5xl">
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-center text-emerald-800 mb-12 md:mb-16 tracking-tight">
        Hadiths mentionnant des Compagnons
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 auto-rows-fr">
        {sahabas.map((sahaba) => (
          <Link
            href={`/sahabas/${slugify(sahaba)}`}
            key={sahaba}
            className="group flex flex-col min-h-[5rem]"
          >
            <div className="bg-white rounded-lg shadow-md p-5 transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:border-emerald-200 border border-transparent group-hover:-translate-y-0.5 flex items-center space-x-3 h-full w-full">
              {/* Badge Hadith Count */}
              <span className="flex-shrink-0 bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {getCountHadithsBySahabaSlug(slugify(sahaba))}
              </span>

              {/* Nom du Compagnon */}
              <p className="text-lg font-medium font-serif text-gray-800 group-hover:text-emerald-700 transition-colors flex-grow break-words">
                {sahaba}
              </p>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400 group-hover:text-emerald-600 transition-colors opacity-0 group-hover:opacity-100"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
