"use client";

/*Libs*/
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

/*Services*/
import {
  getAllChapters,
  getAllNarrators,
  getAllSahabas,
} from "@/services/services";
/*Types*/
import { HadithType } from "@/types/types";
/*UI*/
import { Hadith } from "@/ui/hadith/Hadith";
import { Input } from "@/ui/inputs/Input";
import { MdTextArea } from "@/ui/inputs/MdTextArea";
import { MultiSelect } from "@/ui/inputs/MultiSelect";
import { SearchSelect } from "@/ui/inputs/SearchSelect";
import { Select } from "@/ui/inputs/Select";
/*Utils*/
import { cleanArabicText } from "@/utils/cleanArabicText";
import { replaceSWS } from "@/utils/replaceSWS";

const editHadithSchema = z.object({
  id: z.coerce
    .number({
      required_error: "L'ID est requis",
      invalid_type_error: "L'ID doit être un nombre",
    })
    .int({ message: "L'ID doit être un nombre entier" })
    .positive({ message: "L'ID doit être un nombre positif" }),
  chapter: z.string().min(1, "Le chapitre est requis"),
  narrator: z.string().min(1, "Le narrateur est requis"),
  sahabas: z.array(z.string()),
  matn: z.string().min(1, "Le texte du hadith est requis"),
  arabic: z.string().min(1, "Le texte arabe est requis"),
  isnad: z.string().optional(),
});

type HadithFormValues = z.infer<typeof editHadithSchema>;

export function EditHadithForm({ hadith }: { hadith: HadithType }) {
  const router = useRouter();

  const narrators = getAllNarrators();
  const sahabas = getAllSahabas();
  const chapters = getAllChapters();
  const chapterOptions = chapters.map((chapter) => chapter.title);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const {
    register,
    control,
    handleSubmit: handleFormSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<HadithFormValues>({
    resolver: zodResolver(editHadithSchema),
    mode: "onChange",
    defaultValues: {
      id: hadith.id,
      chapter: hadith.chapter,
      narrator: hadith.narrator,
      sahabas: hadith.sahabas || [],
      matn: hadith.matn,
      isnad: hadith.isnad || "",
      arabic: hadith.arabic || "",
    },
  });

  const formValues = watch();

  const onSubmit = async (data: HadithFormValues) => {
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch(`/api/hadiths/${data.id}/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitMessage({
          type: "success",
          text: result.message || `Hadith #${data.id} modifié avec succès!`,
        });

        setTimeout(() => {
          router.push(`/`);
        }, 500);
      } else {
        let errorMessage = "Une erreur est survenue lors de la modification.";

        if (result && result.message) {
          errorMessage = result.message;
        } else if (!response.ok) {
          errorMessage = `Erreur ${response.status}: ${response.statusText || "Problème serveur"}`;
        }
        setSubmitMessage({
          type: "error",
          text: errorMessage,
        });
        console.error("Erreur API ou HTTP:", result || response.statusText);
      }
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      setSubmitMessage({
        type: "error",
        text: "Erreur de connexion ou réponse invalide du serveur.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 md:p-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        {/* Server Message */}
        {submitMessage && (
          <div
            className={`mb-6 p-4 rounded-md text-sm ${
              submitMessage.type === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
            role="alert"
          >
            {submitMessage.text}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleFormSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          {/* ID (not editable) */}
          <Input
            id="id"
            label="ID du Hadith"
            type="number"
            readOnly
            error={!!errors.id}
            errorMessage={errors.id?.message}
            register={register("id")}
            className="bg-gray-100 cursor-not-allowed"
          />

          {/* Chapter */}
          <Controller
            name="chapter"
            control={control}
            render={({ field }) => (
              <Select
                id="chapter"
                label="Chapitre *"
                options={chapterOptions}
                error={!!errors.chapter}
                errorMessage={errors.chapter?.message}
                {...field}
              />
            )}
          />

          {/* Narrator */}
          <Controller
            name="narrator"
            control={control}
            render={({ field }) => (
              <SearchSelect
                id="narrator"
                label="Narrateur *"
                options={narrators}
                value={field.value}
                onChange={field.onChange}
                placeholder="Rechercher un narrateur..."
                name={field.name}
                error={!!errors.narrator}
                errorMessage={errors.narrator?.message}
              />
            )}
          />

          {/* Sahabas */}
          <Controller
            name="sahabas"
            control={control}
            render={({ field }) => (
              <MultiSelect
                id="sahabas"
                label="Sahabas mentionnés"
                options={sahabas}
                selected={field.value}
                onChange={field.onChange}
                placeholder="Rechercher des sahabas..."
                name={field.name}
                error={!!errors.sahabas}
                errorMessage={errors.sahabas?.message}
              />
            )}
          />

          {/* Matn FR */}
          <MdTextArea
            id="matn"
            name="matn"
            label="Matn (Texte français) *"
            control={control}
            error={!!errors.matn}
            errorMessage={errors.matn?.message}
            onValueChange={(value) => replaceSWS(value)}
            placeholder="Saisir le texte du hadith en français..."
            height={200}
          />

          {/* Matn AR */}
          <Input
            id="arabic"
            label="Matn (Texte arabe) *"
            type="textarea"
            rows={5}
            dir="rtl"
            className="font-arabic text-lg "
            error={!!errors.arabic}
            errorMessage={errors.arabic?.message}
            register={register("arabic")}
            onChange={(e) => {
              const cleanedText = cleanArabicText(e.target.value);
              setValue("arabic", cleanedText);
            }}
            helperText="Le texte sera automatiquement nettoyé"
          />

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto flex-1 bg-emerald-600 text-white py-2.5 px-6 rounded-md shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
            >
              {isSubmitting ? "Modification..." : "Mettre à jour le hadith"}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="w-full sm:w-auto flex-1 bg-gray-200 text-gray-800 py-2.5 px-6 rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50 transition duration-150 ease-in-out"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>

      {/* Preview Section */}
      <div className="rounded-xl">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Aperçu en temps réel
        </h3>
        <div className="bg-gray-100 rounded-lg">
          <Hadith
            hadith={formValues as HadithType}
            update
          />
        </div>
      </div>
    </div>
  );
}
