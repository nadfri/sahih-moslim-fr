"use client";

/*Libs*/
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import { HadithType, ItemType } from "@/src/types/types";
/*UI*/
import { Hadith } from "@/src/ui/hadith/Hadith/Hadith";
import { Input } from "@/src/ui/inputs/Input/Input";
import { MdTextArea } from "@/src/ui/inputs/MdTextArea/MdTextArea";
import { MultiSelect } from "@/src/ui/inputs/MultiSelect/MultiSelect";
import { SearchSelect } from "@/src/ui/inputs/SearchSelect/SearchSelect";
import { Select } from "@/src/ui/inputs/Select/Select";
/*Utils*/
import { cleanArabicText } from "@/src/utils/cleanArabicText";
import { replaceSWS } from "@/src/utils/replaceSWS";

const createHadithSchema = (existingNumeros: number[]) => {
  return z.object({
    numero: z.coerce
      .number({
        required_error: "Le numéro est requis",
        invalid_type_error: "Le numéro doit être un nombre",
      })
      .int({ message: "Le numéro doit être un nombre entier" })
      .positive({ message: "Le numéro doit être un nombre positif" })
      .refine((numero) => !existingNumeros.includes(numero), {
        message: "Ce numéro existe déjà. Veuillez en choisir un autre.",
      }),
    chapter: z.string().min(1, "Le chapitre est requis"),
    narrator: z.string().min(1, "Le narrateur est requis"),
    mentionedSahabas: z.array(z.string()),
    matn_fr: z.string().min(1, "Le texte du hadith est requis"),
    matn_ar: z.string().min(1, "Le texte arabe est requis"),
    isnad: z.string().nullable().optional(),
  });
};

type HadithFormValues = z.infer<ReturnType<typeof createHadithSchema>>;

// Define props for the component
type AddHadithFormProps = {
  initialNumeros: number[];
  chaptersData: ItemType[];
  narratorsData: ItemType[];
  sahabasData: ItemType[];
};

export function AddHadithForm({
  initialNumeros,
  chaptersData,
  narratorsData,
  sahabasData,
}: AddHadithFormProps) {
  const [existingNumeros, setExistingNumeros] =
    useState<number[]>(initialNumeros);

  const [isSubmitting, setIsSubmitting] = useState(false);

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
      numero: initialNumeros.length > 0 ? Math.max(...initialNumeros) + 1 : 1,
      chapter: "Introduction",
      narrator: "Abou Huraira",
      mentionedSahabas: [],
      matn_fr: "",
      isnad: "",
      matn_ar: "",
    },
  });

  const formValues = watch();

  const chapterOptions = chaptersData.map((chapter) => chapter.name);
  const narratorOptions = narratorsData.map((n) => n.name);
  const sahabaOptions = sahabasData.map((s) => s.name);

  const onSubmit = async (data: HadithFormValues) => {
    setIsSubmitting(true);

    // Find IDs corresponding to selected names using props
    const selectedChapter = chaptersData.find(
      (chapter) => chapter.name === data.chapter
    );
    const selectedNarrator = narratorsData.find(
      (n) => n.name === data.narrator
    );
    const selectedSahabas = sahabasData.filter((s) =>
      data.mentionedSahabas.includes(s.name)
    );

    if (!selectedChapter || !selectedNarrator) {
      toast.error("Chapitre ou narrateur sélectionné invalide.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      numero: data.numero,
      matn_fr: data.matn_fr,
      matn_ar: data.matn_ar,
      isnad: data.isnad,
      chapterName: selectedChapter.name,
      narratorName: selectedNarrator.name,
      mentionedSahabasNames: selectedSahabas.map((s) => s.name), // Send names to API
    };

    try {
      const response = await fetch("/api/hadiths/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Hadith ajouté avec succès!");

        // Update local state and reset form
        const newNumero = data.numero;
        // Important: Update the state used for schema validation *before* resetting
        const updatedNumeros = [...existingNumeros, newNumero];
        setExistingNumeros(updatedNumeros); // Update the list of existing numbers

        reset({
          numero: Math.max(...updatedNumeros) + 1,
          chapter: "Introduction",
          narrator: "Abou Huraira",
          mentionedSahabas: [],
          matn_fr: "",
          isnad: "",
          matn_ar: "",
        });
      } else {
        toast.error(result.message || "Une erreur est survenue");
      }
    } catch (error) {
      toast.error("Erreur de connexion au serveur");
      console.error("Erreur lors de l'envoi du hadith:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Construct preview object matching HadithType exactly
  const previewHadith: HadithType = {
    id: "preview-id", // Placeholder
    numero: formValues.numero || 0,
    chapter: {
      // Provide all fields expected by Chapter type in Prisma schema
      id: "preview-chapter-id",
      name: formValues.chapter || "Sélectionnez un chapitre...",
      slug: "preview-chapter-slug", // Add slug for preview
    },
    narrator: {
      id: "preview-narrator-id",
      name: formValues.narrator || "Sélectionnez un narrateur...",
      slug: "preview-narrator-slug", // Add slug for preview
      nameArabic: null, // Placeholder or fetch if needed
    },
    mentionedSahabas: (formValues.mentionedSahabas || []).map((name, i) => ({
      id: `preview-sahaba-id-${i}`,
      name: name,
      slug: `preview-sahaba-slug-${i}`, // Add slug for preview
      nameArabic: null,
    })),
    matn_fr: formValues.matn_fr || "...",
    matn_ar: formValues.matn_ar || "...",
    isnad: formValues.isnad || null,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <form
          onSubmit={handleFormSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          {/* Numero */}
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
                label="Chapitre*"
                options={chapterOptions}
                error={!!errors.chapter}
                errorMessage={errors.chapter?.message}
                {...field} // Pass field props (value, onChange, etc.)
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
                label="Narrateur*"
                options={narratorOptions}
                value={field.value}
                onChange={field.onChange}
                placeholder="Rechercher un narrateur..."
                name={field.name}
                error={!!errors.narrator}
                errorMessage={errors.narrator?.message}
              />
            )}
          />

          {/* MentionedSahabas */}
          <Controller
            name="mentionedSahabas"
            control={control}
            render={({ field }) => (
              <MultiSelect
                id="mentionedSahabas"
                label="Sahabas mentionnés"
                options={sahabaOptions}
                selected={field.value} // Expects string[]
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
            label="Texte français*"
            control={control}
            error={!!errors.matn_fr}
            errorMessage={errors.matn_fr?.message}
            // Adjust to return the processed value to match expected type
            onValueChange={(value) => {
              const processedValue = replaceSWS(value);
              setValue("matn_fr", processedValue);
              return processedValue;
            }}
            placeholder="Saisir le texte du hadith..."
            height={200}
          />

          {/* matn_fr AR */}
          <Input
            id="matn_ar"
            label="Texte arabe*"
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

          {/* Isnad (Optional) */}
          {/* <Input
            id="isnad"
            label="Isnad (Chaîne de transmission)"
            type="textarea"
            rows={3}
            dir="rtl" // Assuming Isnad is often in Arabic
            className="font-matn_ar" // Optional: style like Arabic text
            error={!!errors.isnad}
            errorMessage={errors.isnad?.message}
            register={register("isnad")}
            placeholder="Saisir l'isnad (optionnel)..."
          /> */}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:bg-emerald-300 disabled:dark:bg-emerald-800/50 disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? "Ajout en cours..." : "Ajouter le hadith"}
          </button>
        </form>
      </div>

      {/* Preview Section */}
      <div className="rounded-xl">
        <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-1">
          <Hadith
            hadith={previewHadith}
            update
          />
        </div>
      </div>
    </div>
  );
}
