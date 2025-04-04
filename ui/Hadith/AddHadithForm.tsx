"use client";

import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";

import { chapters } from "@/db/chapterTitles";
import { narrators } from "@/db/narrators";
import { sahabas } from "@/db/sahabas";
import { getIds } from "@/services/services";
import { ChapterTitleType, HadithType, NarratorType, SahabaType } from "@/types/types";
import { Hadith } from "@/ui/hadith/Hadith";
import { MultiSelect } from "@/ui/select/MultiSelect";
import { SearchSelect } from "@/ui/select/SearchSelect";
import { cleanArabicText } from "@/utils/cleanArabicText";
import { replaceSWS } from "@/utils/replaceSWS";

export function AddHadithForm() {
  // Initialisation avec un objet complet pour éviter les erreurs d'accès aux propriétés
  const [existingIds, setExistingIds] = useState<number[]>(getIds() || []);
  const [hadith, setHadith] = useState<HadithType>({
    id: existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1, // Dernier ID + 1,
    chapter: "La Foi",
    narrator: "Abou Huraira",
    sahabas: [],
    matn: "",
    isnad: "",
    arabic: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const chapterOptions = chapters.map((chapter) => chapter.title);

  // Gestion des changements dans le formulaire
  const handleChange = (field: keyof HadithType, value: string | number | string[]) => {
    if (field === "matn" && typeof value === "string") {
      // Remplacer "sws" par "ﷺ" dans le texte
      value = replaceSWS(value);
    }

    if (field === "narrator") {
      setHadith((prev) => ({ ...prev, narrator: value as NarratorType }));
    } else if (field === "chapter") {
      setHadith((prev) => ({ ...prev, chapter: value as ChapterTitleType }));
    } else if (field === "sahabas") {
      setHadith((prev) => ({ ...prev, sahabas: value as SahabaType[] }));
    } else {
      setHadith((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleArabicChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const cleanedText = cleanArabicText(e.target.value);
    setHadith((prev) => ({ ...prev, arabic: cleanedText }));
  };

  const handleNarratorChange = (value: string) => {
    if (narrators.includes(value as NarratorType)) {
      setHadith((prev) => ({ ...prev, narrator: value as NarratorType }));
    }
  };

  const handleSahabasChange = (selectedSahabas: string[]) => {
    const validSahabas = selectedSahabas.filter((s) => sahabas.includes(s as SahabaType)) as SahabaType[];
    setHadith((prev) => ({ ...prev, sahabas: validSahabas }));
  };

  const handleRemoveSahaba = (sahabaToRemove: string) => {
    setHadith((prev) => ({
      ...prev,
      sahabas: prev.sahabas.filter((sahaba) => sahaba !== sahabaToRemove),
    }));
  };

  // Vérifier si l'ID existe déjà
  const isIdExists = (id: number) => {
    return existingIds.includes(id);
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Vérifier si l'ID existe déjà
    if (isIdExists(hadith.id)) {
      setSubmitMessage({
        type: "error",
        text: `L'ID ${hadith.id} existe déjà. Veuillez choisir un autre ID.`,
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch("/api/hadith", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hadith),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitMessage({
          type: "success",
          text: result.message || "Hadith ajouté avec succès!",
        });

        // Ajouter l'ID à la liste des IDs existants
        setExistingIds((prev) => [...prev, hadith.id]);

        // Réinitialiser le formulaire pour un nouvel ajout
        setHadith({
          id: Math.max(...existingIds, hadith.id) + 1, // Dernier ID + 1
          chapter: "La Foi" as ChapterTitleType,
          narrator: "Abou Huraira" as NarratorType,
          sahabas: [],
          matn: "",
          isnad: "",
          arabic: "",
        });
      } else {
        setSubmitMessage({
          type: "error",
          text: result.message || "Une erreur est survenue",
        });
      }
    } catch (error) {
      setSubmitMessage({
        type: "error",
        text: "Erreur de connexion au serveur",
      });
      console.error("Erreur lors de l'envoi du hadith:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Partie formulaire */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        {submitMessage && (
          <div
            className={`mb-6 p-4 rounded-md ${submitMessage.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            {submitMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* ID du hadith */}
          <div className="mb-6">
            <label
              htmlFor="id"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ID
            </label>
            <input
              type="number"
              id="id"
              min="1"
              required
              className={`w-full p-2 border ${isIdExists(hadith.id) && hadith.id > 0 ? "border-red-500 bg-red-50" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`}
              value={hadith.id}
              onChange={(e) => handleChange("id", parseInt(e.target.value) || 0)}
            />
            {isIdExists(hadith.id) && hadith.id > 0 && (
              <p className="mt-1 text-sm text-red-600">Cet ID existe déjà. Veuillez en choisir un autre.</p>
            )}
          </div>

          {/* Chapitre */}
          <div className="mb-6">
            <label
              htmlFor="chapter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Chapitre
            </label>
            <select
              id="chapter"
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              value={hadith.chapter}
              onChange={(e) => handleChange("chapter", e.target.value)}
            >
              {chapterOptions.map((chapter) => (
                <option
                  key={chapter}
                  value={chapter}
                >
                  {chapter}
                </option>
              ))}
            </select>
          </div>

          {/* Narrateur avec recherche */}
          <div className="mb-6">
            <label
              htmlFor="narrator"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Narrateur
            </label>
            <SearchSelect
              id="narrator"
              options={narrators}
              value={hadith.narrator}
              onChange={handleNarratorChange}
              placeholder="Rechercher un narrateur..."
              required
            />
          </div>

          {/* Sahabas avec recherche et boutons de suppression */}
          <div className="mb-6">
            <label
              htmlFor="sahabas"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Sahabas mentionnés
            </label>
            <MultiSelect
              id="sahabas"
              options={sahabas}
              selected={hadith.sahabas}
              onChange={handleSahabasChange}
              onRemove={handleRemoveSahaba}
              placeholder="Rechercher des sahabas..."
            />
          </div>

          {/* Matn (Texte français) avec éditeur markdown */}
          <div className="mb-6">
            <label
              htmlFor="matn"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Matn (Texte français)
            </label>
            <div
              data-color-mode="light"
              className="mb-2"
            >
              <MDEditor
                value={hadith.matn}
                onChange={(value) => handleChange("matn", value || "")}
                preview="edit"
                height={200}
              />
            </div>
          </div>

          {/* Texte arabe */}
          <div className="mb-6">
            <label
              htmlFor="arabic"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Texte arabe
            </label>
            <textarea
              id="arabic"
              dir="rtl"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-arabic text-lg"
              rows={5}
              value={hadith.arabic}
              onChange={handleArabicChange}
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">Le texte sera automatiquement nettoyé</p>
          </div>

          {/* Bouton de soumission */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={isSubmitting || (isIdExists(hadith.id) && hadith.id > 0)}
              className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:bg-emerald-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Ajout en cours..." : "Ajouter le hadith"}
            </button>
          </div>
        </form>
      </div>

      {/* Partie aperçu */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Aperçu en temps réel</h3>
        <div className="bg-gray-100 rounded-lg p-4">
          <Hadith hadith={hadith} />
        </div>
      </div>
    </div>
  );
}
