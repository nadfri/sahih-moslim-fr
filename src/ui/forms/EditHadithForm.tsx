"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import { deleteHadith, editHadith } from "@/src/services/hadith-actions";
import { HadithType, ItemType } from "@/src/types/types";
import { Hadith } from "@/src/ui/hadith/Hadith/Hadith";
import { Input } from "@/src/ui/inputs/Input/Input";
import { MdTextArea } from "@/src/ui/inputs/MdTextArea/MdTextArea";
import { MultiSelectDragNDrop } from "@/src/ui/inputs/MultiSelectDragNDrop/MultiSelectDragNDrop";
import { SearchSelect } from "@/src/ui/inputs/SearchSelect/SearchSelect";
import { Select } from "@/src/ui/inputs/Select/Select";
import { cleanArabicText } from "@/src/utils/cleanArabicText";
import { wrapProphetNames } from "@/src/utils/wrapProphetNames";
import { ConfirmDeleteModal } from "../ConfirmDeleteModal/ConfirmDeleteModal";
import { MultiSelect } from "../inputs/MultiSelect/MultiSelect";

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
    isnadTransmitters: z.array(z.string()),
    matn_fr: z.string().min(1, "Le texte du hadith est requis"),
    matn_ar: z.string().min(1, "Le texte arabe est requis"),
  });
};

type HadithFormValues = z.infer<ReturnType<typeof createEditHadithSchema>>;

type EditHadithFormProps = {
  hadith: HadithType;
  existingNumeros: number[];
  chaptersData: ItemType[];
  narratorsData: ItemType[];
  sahabasData: ItemType[];
  transmittersData: ItemType[];
};

export function EditHadithForm({
  hadith,
  existingNumeros,
  chaptersData,
  narratorsData,
  sahabasData,
  transmittersData,
}: EditHadithFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      chapter: hadith.chapter.name,
      narrator: hadith.narrator.name,
      mentionedSahabas: hadith.mentionedSahabas.map((s) => s.name),
      isnadTransmitters: hadith.isnadTransmitters.map((t) => t.name),
      matn_fr: hadith.matn_fr,
      matn_ar: hadith.matn_ar,
    },
  });

  const formValues = watch();

  const chapterOptions = chaptersData.map((chapter) => chapter.name);
  const narratorOptions = narratorsData.map((n) => n.name);
  const sahabaOptions = sahabasData.map((s) => s.name);
  const transmitterOptions = transmittersData.map((t) => t.name);

  // Handle form submission for editing
  const onSubmit = async (data: HadithFormValues) => {
    setIsSubmitting(true);

    // Find IDs corresponding to selected names/titles using props
    const selectedChapter = chaptersData.find(
      (chapter) => chapter.name === data.chapter
    );
    const selectedNarrator = narratorsData.find(
      (n) => n.name === data.narrator
    );
    const selectedSahabas = sahabasData.filter((s) =>
      data.mentionedSahabas.includes(s.name)
    );

    // Preserve order from form for transmitters (map to maintain form order)
    const selectedTransmitters = data.isnadTransmitters
      .map((name) =>
        transmittersData.find((transmitter) => transmitter.name === name)
      )
      .filter(
        (transmitter): transmitter is NonNullable<typeof transmitter> =>
          transmitter !== undefined
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
      chapterName: selectedChapter.name,
      narratorName: selectedNarrator.name,
      mentionedSahabasNames: selectedSahabas.map((s) => s.name),
      isnadTransmittersNames: selectedTransmitters.map((t) => t.name),
    };

    try {
      const result = await editHadith(hadith.id, payload);
      if (result.success) {
        toast.success("Hadith modifié avec succès!");
        router.push("/");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Erreur de connexion au serveur");
      console.error("Erreur lors de la modification du hadith:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle hadith deletion
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteHadith(hadith.id);
      if (result.success) {
        toast.success("Hadith supprimé avec succès!");
        router.push("/");
      } else {
        toast.error(result.message || "Erreur lors de la suppression");
      }
    } catch (error) {
      toast.error("Erreur de connexion au serveur");
      console.error("Erreur lors de la suppression:", error);
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
      name: formValues.chapter || hadith.chapter.name,
      slug: hadith.chapter.slug || "preview-chapter-slug",
    },
    narrator: {
      ...hadith.narrator,
      name: formValues.narrator || hadith.narrator.name,
      slug: hadith.narrator.slug || "preview-narrator-slug",
    },
    mentionedSahabas: (formValues.mentionedSahabas || []).map((name, i) => ({
      id: `preview-sahaba-id-${i}`,
      name: name,
      slug: `preview-sahaba-slug-${i}`,
      nameArabic: null,
    })),
    isnadTransmitters: (formValues.isnadTransmitters || []).map(
      (name: string, i: number) => ({
        id: `preview-transmitter-id-${i}`,
        name: name,
        slug: `preview-transmitter-slug-${i}`,
        nameArabic: null,
      })
    ),
    matn_fr: formValues.matn_fr || "...",
    matn_ar: formValues.matn_ar || "...",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Server Message & Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
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

          {/* IsnadTransmitters */}
          <Controller
            name="isnadTransmitters"
            control={control}
            render={({ field }) => (
              <MultiSelectDragNDrop
                id="isnadTransmitters"
                label="Transmetteurs de l'isnad"
                options={transmitterOptions}
                selected={field.value || []}
                onChange={field.onChange}
                placeholder="Rechercher des transmetteurs..."
                name={field.name}
                error={!!errors.isnadTransmitters}
                errorMessage={errors.isnadTransmitters?.message}
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
              const processedValue = wrapProphetNames(value);
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
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none disabled:bg-emerald-300 disabled:dark:bg-emerald-800/50 disabled:cursor-not-allowed mt-2"
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
          className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none disabled:bg-red-300 disabled:dark:bg-red-800/50 disabled:cursor-not-allowed mt-4"
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
