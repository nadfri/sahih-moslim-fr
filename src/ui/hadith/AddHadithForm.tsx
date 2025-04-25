"use client";

/*Libs*/
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

/*Services*/
import {
  getAllChapters,
  getAllNarrators,
  getAllSahabas,
} from "@/src/services/services";
/*Types*/
import { HadithType } from "@/src/types/types";
/*UI*/
import { Hadith } from "@/src/ui/hadith/Hadith";
import { Input } from "@/src/ui/inputs/Input";
import { MdTextArea } from "@/src/ui/inputs/MdTextArea";
import { MultiSelect } from "@/src/ui/inputs/MultiSelect";
import { SearchSelect } from "@/src/ui/inputs/SearchSelect";
import { Select } from "@/src/ui/inputs/Select";
/*Utils*/
import { cleanArabicText } from "@/src/utils/cleanArabicText";
import { replaceSWS } from "@/src/utils/replaceSWS";

const createHadithSchema = (existingIds: number[]) => {
  return z.object({
    numero: z.coerce
      .number({
        required_error: "Le numéro est requis",
        invalid_type_error: "Le numéro doit être un nombre",
      })
      .int({ message: "Le numéro doit être un nombre entier" })
      .positive({ message: "Le numéro doit être un nombre positif" })
      .refine((numero) => !existingIds.includes(numero), {
        message: "Cet numéro existe déjà. Veuillez en choisir un autre.",
      }),
    chapter: z.string().min(1, "Le chapitre est requis"),
    narrator: z.string().min(1, "Le narrateur est requis"),
    mentionedSahabas: z.array(z.string()),
    matn_fr: z.string().min(1, "Le texte du hadith est requis"),
    matn_ar: z.string().min(1, "Le texte arabe est requis"),
    isnad: z.string().optional(),
  });
};

type HadithFormValues = z.infer<ReturnType<typeof createHadithSchema>>;

export function AddHadithForm() {
  const numeros = getNumeros();
  const narrators = getAllNarrators();
  const sahabas = getAllSahabas();
  const chapters = getAllChapters();

  const [existingNumeros, setExistingNumeros] = useState<number[]>(
    numeros || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const hadithSchema = createHadithSchema(existingNumeros);

  const {
    register,
    control,
    handleSubmit: handleFormSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<HadithFormValues>({
    resolver: zodResolver(hadithSchema),
    mode: "onChange",
    defaultValues: {
      numero: existingNumeros.length > 0 ? Math.max(...existingNumeros) + 1 : 1,
      chapter: "La Foi",
      narrator: "Abou Huraira",
      mentionedSahabas: [],
      matn_fr: "",
      isnad: "",
      matn_ar: "",
    },
  });

  const formValues = watch();

  // Gestion de la soumission du formulaire
  const onSubmit = async (data: HadithFormValues) => {
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch("/api/hadiths/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitMessage({
          type: "success",
          text: result.message || "Hadith ajouté avec succès!",
        });

        setExistingNumeros((prev) => [...prev, data.id]);

        reset({
          numero: Math.max(...existingNumeros, data.id) + 1,
          chapter: "La Foi",
          narrator: "Abou Huraira",
          mentionedSahabas: [],
          matn_fr: "",
          isnad: "",
          matn_ar: "",
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
      {/* Server Message */}
      <div className="bg-white rounded-xl shadow-lg p-3">
        {submitMessage && (
          <div
            className={`mb-6 p-4 rounded-md ${
              submitMessage.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {submitMessage.text}
          </div>
        )}

        <form
          onSubmit={handleFormSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          {/* ID */}
          <Input
            id="numero"
            label="Numero*"
            type="number"
            min={1}
            error={!!errors.numero}
            errorMessage={errors.numero?.message}
            register={register("numero")}
          />

          {/* Chapter */}
          <Controller
            name="chapter"
            control={control}
            render={({ field }) => (
              <Select
                id="chapter"
                label="Chapitre"
                options={chapters}
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
                label="Narrateur"
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
                id="mentionedSahabas"
                label="Sahabas mentionnés"
                options={sahabas}
                selected={field.value}
                onChange={field.onChange}
                placeholder="Rechercher des sahabas..."
                name={field.name}
                error={!!errors.mentionedSahabas}
                errorMessage={errors.mentionedSahabas?.message}
              />
            )}
          />

          {/* matn_fr FR */}
          <MdTextArea
            id="matn_fr"
            name="matn_fr"
            label="matn_fr (Texte français)*"
            control={control}
            error={!!errors.matn_fr}
            errorMessage={errors.matn_fr?.message}
            onValueChange={(value) => replaceSWS(value)}
            placeholder="Saisir le texte du hadith..."
            height={200}
          />

          {/* matn_fr AR */}
          <Input
            id="matn_ar"
            label="matn_fr (Texte arabe)*"
            type="textarea"
            rows={5}
            dir="rtl"
            className="font-matn_ar text-lg"
            error={!!errors.matn_ar}
            errorMessage={errors.matn_ar?.message}
            register={register("matn_ar")}
            onChange={(e) => {
              const cleanedText = cleanArabicText(e.target.value);
              setValue("matn_ar", cleanedText);
            }}
            helperText="Le texte sera automatiquement nettoyé"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:bg-emerald-300 disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? "Ajout en cours..." : "Ajouter le hadith"}
          </button>
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
