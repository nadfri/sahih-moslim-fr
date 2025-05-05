"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { ChapterType, HadithType, PersonType } from "@/src/types/types";
import { Hadith } from "@/src/ui/hadith/Hadith/Hadith";
import { Input } from "@/src/ui/inputs/Input/Input";
import { MdTextArea } from "@/src/ui/inputs/MdTextArea/MdTextArea";
import { MultiSelect } from "@/src/ui/inputs/MultiSelect/MultiSelect";
import { SearchSelect } from "@/src/ui/inputs/SearchSelect/SearchSelect";
import { Select } from "@/src/ui/inputs/Select/Select";
import { cleanArabicText } from "@/src/utils/cleanArabicText";
import { replaceSWS } from "@/src/utils/replaceSWS";
import { ConfirmDeleteModal } from "../ConfirmDeleteModal/ConfirmDeleteModal";

const createEditHadithSchema = (
  existingNumeros: number[],
  initialNumero: number
) => {
  return z.object({
    numero: z.coerce
      .number({
        required_error: "Le numéro est requis",
        invalid_type_error: "Le numéro doit être un nombre",
      })
      .int({ message: "Le numéro doit être un nombre entier" })
      .positive({ message: "Le numéro doit être un nombre positif" })
      .refine(
        (numero) =>
          numero === initialNumero || !existingNumeros.includes(numero),
        {
          message: "Ce numéro existe déjà. Veuillez en choisir un autre.",
        }
      ),
    chapter: z.string().min(1, "Le chapitre est requis"),
    narrator: z.string().min(1, "Le narrateur est requis"),
    mentionedSahabas: z.array(z.string()),
    matn_fr: z.string().min(1, "Le texte du hadith est requis"),
    matn_ar: z.string().min(1, "Le texte arabe est requis"),
    isnad: z.string().optional(),
  });
};

type HadithFormValues = z.infer<ReturnType<typeof createEditHadithSchema>>;

type EditHadithFormProps = {
  hadith: HadithType;
  existingNumeros: number[];
  chaptersData: ChapterType[];
  narratorsData: PersonType[];
  sahabasData: PersonType[];
};

export function EditHadithForm({
  hadith,
  existingNumeros,
  chaptersData,
  narratorsData,
  sahabasData,
}: EditHadithFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const hadithSchema = createEditHadithSchema(existingNumeros, hadith.numero);

  const {
    register,
    control,
    handleSubmit: handleFormSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<HadithFormValues>({
    resolver: zodResolver(hadithSchema),
    mode: "onChange",
    defaultValues: {
      numero: hadith.numero,
      chapter: hadith.chapter.title,
      narrator: hadith.narrator.name,
      mentionedSahabas: hadith.mentionedSahabas.map((s) => s.name),
      matn_fr: hadith.matn_fr,
      isnad: hadith.isnad || "",
      matn_ar: hadith.matn_ar,
    },
  });

  const formValues = watch();

  const chapterOptions = chaptersData.map((c) => c.title);
  const narratorOptions = narratorsData.map((n) => n.name);
  const sahabaOptions = sahabasData.map((s) => s.name);

  // Handle form submission for editing
  const onSubmit = async (data: HadithFormValues) => {
    setIsSubmitting(true);
    setSubmitMessage(null);

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
      mentionedSahabasNames: selectedSahabas.map((s) => s.name),
    };

    try {
      const response = await fetch(`/api/hadiths/edit/${hadith.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (response.ok) {
        setSubmitMessage({
          type: "success",
          text: result.message || "Hadith modifié avec succès!",
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
      console.error("Erreur lors de la modification du hadith:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle hadith deletion
  const handleDelete = async () => {
    setIsDeleting(true);
    setSubmitMessage(null);
    try {
      const response = await fetch(`/api/hadiths/delete/${hadith.id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (response.ok) {
        setSubmitMessage({
          type: "success",
          text: result.message || "Hadith supprimé avec succès!",
        });
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        setSubmitMessage({
          type: "error",
          text: result.message || "Erreur lors de la suppréssion",
        });
      }
    } catch (error) {
      setSubmitMessage({
        type: "error",
        text: "Server connection error",
      });
      console.error("Erreur lors de la suppréssion:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // Construct preview object for live preview
  const previewHadith: HadithType = {
    ...hadith,
    numero: formValues.numero || 0,
    chapter: {
      ...hadith.chapter,
      title: formValues.chapter || hadith.chapter.title,
      slug: hadith.chapter.slug || "preview-chapter-slug", // Ensure slug exists
    },
    narrator: {
      ...hadith.narrator,
      name: formValues.narrator || hadith.narrator.name,
      slug: hadith.narrator.slug || "preview-narrator-slug", // Ensure slug exists
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
      {/* Server Message & Form */}
      <div className="bg-white rounded-xl shadow-lg p-6">
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
          {/* Numero (ID) */}
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
          {/* Sahabas */}
          <Controller
            name="mentionedSahabas"
            control={control}
            render={({ field }) => (
              <MultiSelect
                id="mentionedSahabas"
                label="Sahabas mentionnés"
                options={sahabaOptions}
                selected={field.value}
                onChange={field.onChange}
                placeholder="Rechercher des sahabas..."
                name={field.name}
                error={!!errors.mentionedSahabas}
                errorMessage={errors.mentionedSahabas?.message}
              />
            )}
          />
          {/* matn_fr (French text) */}
          <MdTextArea
            id="matn_fr"
            name="matn_fr"
            label="Texte français*"
            control={control}
            error={!!errors.matn_fr}
            errorMessage={errors.matn_fr?.message}
            onValueChange={(value) => {
              const processedValue = replaceSWS(value);
              setValue("matn_fr", processedValue);
              return processedValue;
            }}
            placeholder="Saisir le texte du hadith..."
            height={200}
          />
          {/* matn_ar (Arabic text) */}
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
          {/* Isnad (optional) */}
          {/* <Input
            id="isnad"
            label="Isnad (Chaîne de transmission)"
            type="textarea"
            rows={3}
            dir="rtl"
            className="font-matn_ar"
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
            {isSubmitting
              ? "Modification en cours..."
              : "Enregistrer les modifications"}
          </button>
        </form>

        {/* Delete Button */}
        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          disabled={isDeleting}
          className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-red-300 disabled:cursor-not-allowed mt-4"
        >
          {isDeleting ? "Suppression..." : "Supprimer le hadith"}
        </button>

        <ConfirmDeleteModal
          open={showDeleteModal}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          loading={isDeleting}
          title="Supprimer ce hadith ?"
          description="Êtes-vous sûr de vouloir supprimer ce hadith? Cette action est irréversible."
        />
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
