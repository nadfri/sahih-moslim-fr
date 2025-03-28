import ReactMarkdown from "react-markdown";

import { HadithType } from "@/types/types";

type HadithProps = {
  hadith: HadithType;
};

export function Hadith({ hadith }: HadithProps) {
  return (
    <div
      key={hadith.id}
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl border-l-8 border-emerald-600"
    >
      <div className="p-6 md:p-8">
        {/* Section Métadonnées (Chapitre, ID, Narrateur) */}
        <div className="mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
            {/* Chapitre */}
            <p className="text-sm font-medium text-amber-700 tracking-wide uppercase mb-1 sm:mb-0">{hadith.chapter}</p>
            {/* ID Hadith */}
            <span className="bg-emerald-600 text-white text-sm font-semibold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
              {hadith.id}
            </span>
          </div>
          {/* Narrateur */}
          <p className="text-sm text-gray-600 ">
            Rapporté par <span className="font-medium text-emerald-700">{hadith.narrator}</span>
            {/* Vous pourriez ajouter l'isnad ici si vous le souhaitez et s'il est disponible */}
            {/* {hadith.isnad && <span className="text-xs text-gray-400 ml-2">({hadith.isnad})</span>} */}
          </p>
        </div>

        <div className="space-y-3 text-gray-700 leading-relaxed font-serif italic">
          <ReactMarkdown>{hadith.matn}</ReactMarkdown>
        </div>

        {/* Section Référence */}

        {/* Section Sahabas Mentionnés (si applicable) */}
        {hadith.sahabas && hadith.sahabas.length > 0 && (
          <div className="mt-5 pt-4 border-t border-emerald-100">
            {" "}
            {/* Bordure plus légère */}
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-emerald-700">Sahaba(s) mentionné(s) :</span>{" "}
              {hadith.sahabas.join(", ")}
            </p>
          </div>
        )}

        {/* Optionnel: Afficher le texte Arabe */}
        {/* {hadith.arabic && (
                  <div className="mt-5 pt-4 border-t border-emerald-100 text-right font-arabic text-xl leading-loose" dir="rtl">
                     {hadith.arabic}
                  </div>
                )} */}
      </div>
    </div>
  );
}
