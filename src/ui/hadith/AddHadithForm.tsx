"use client";

/*Libs*/
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { ChapterType, HadithType, PersonType } from "@/src/types/types";
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
    isnad: z.string().optional(),
  });
};

type HadithFormValues = z.infer<ReturnType<typeof createHadithSchema>>;

// Define props for the component
type AddHadithFormProps = {
  initialNumeros: number[];
  chaptersData: ChapterType[];
  narratorsData: PersonType[];
  sahabasData: PersonType[];
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
    // Set default values based on props
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

  const chapterOptions = chaptersData.map((c) => c.title);
  const narratorOptions = narratorsData.map((n) => n.name);
  const sahabaOptions = sahabasData.map((s) => s.name);

  const onSubmit = async (data: HadithFormValues) => {
    setIsSubmitting(true);
    setSubmitMessage(null);

    // Find IDs corresponding to selected names/titles using props
    const selectedChapter = chaptersData.find((c) => c.title === data.chapter);
    const selectedNarrator = narratorsData.find(
      (n) => n.name === data.narrator
    );
    const selectedSahabas = sahabasData.filter((s) =>
      data.mentionedSahabas.includes(s.name)
    );

    if (!selectedChapter || !selectedNarrator) {
      setSubmitMessage({
        type: "error",
        text: "Chapitre ou narrateur sélectionné invalide.",
      });
      setIsSubmitting(false);
      return;
    }

    const payload = {
      numero: data.numero,
      matn_fr: data.matn_fr,
      matn_ar: data.matn_ar,
      isnad: data.isnad,
      chapterTitle: selectedChapter.title,
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
        setSubmitMessage({
          type: "success",
          text: result.message || "Hadith ajouté avec succès!",
        });

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

  // Construct preview object matching HadithType exactly
  const previewHadith: HadithType = {
    id: "preview-id", // Placeholder
    numero: formValues.numero || 0,
    chapter: {
      // Provide all fields expected by Chapter type in Prisma schema
      id: "preview-chapter-id",
      title: formValues.chapter || "Sélectionnez un chapitre...",
      createdAt: new Date(), // Placeholder
      updatedAt: new Date(), // Placeholder
    },
    narrator: {
      id: "preview-narrator-id",
      name: formValues.narrator || "Sélectionnez un narrateur...",
      nameArabic: null, // Placeholder or fetch if needed
      createdAt: new Date(), // Placeholder
      updatedAt: new Date(), // Placeholder
    },
    mentionedSahabas: (formValues.mentionedSahabas || []).map((name, i) => ({
      // Provide all fields expected by Sahaba type in Prisma schema
      id: `preview-sahaba-id-${i}`,
      name: name,
      nameArabic: null, // Placeholder or fetch if needed
      createdAt: new Date(), // Placeholder
      updatedAt: new Date(), // Placeholder
    })),
    matn_fr: formValues.matn_fr || "...",
    matn_ar: formValues.matn_ar || "...",
    // Ensure isnad is string | null
    isnad: formValues.isnad || null,
    chapterId: "preview-chapter-id", // Match placeholder
    narratorId: "preview-narrator-id", // Match placeholder
    createdAt: new Date(), // Placeholder
    updatedAt: new Date(), // Placeholder
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Server Message & Form */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* ... (submitMessage rendering) ... */}
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
          {/* ID -> Numero */}
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

          {/* Sahabas -> mentionedSahabas */}
          <Controller
            name="mentionedSahabas" // Updated name to match schema
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
            className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:bg-emerald-300 disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? "Ajout en cours..." : "Ajouter le hadith"}
          </button>
        </form>
      </div>

      {/* Preview Section */}
      <div className="rounded-xl">
        <div className="bg-gray-100 rounded-lg p-1">
          <Hadith
            hadith={previewHadith}
            update
          />
        </div>
      </div>
    </div>
  );
}
