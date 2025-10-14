"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "@/i18n/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { deleteHadith, editHadith } from "@/src/services/actions";
import { HadithType, ItemType, VariantType } from "@/src/types/types";
import { Hadith } from "@/src/ui/hadith/Hadith/Hadith";
import { Input } from "@/src/ui/forms/inputs/Input/Input";
import { MdTextArea } from "@/src/ui/forms/inputs/MdTextArea/MdTextArea";
import { MultiSelectDragNDrop } from "@/src/ui/forms/inputs/MultiSelectDragNDrop/MultiSelectDragNDrop";
import { Select } from "@/src/ui/forms/inputs/Select/Select";
import { cleanArabicText } from "@/src/utils/cleanArabicText";
import { wrapProphetNames } from "@/src/utils/wrapProphetNames";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal/ConfirmDeleteModal";
import { MultiSelect } from "./inputs/MultiSelect/MultiSelect";
import { BtnAddItem } from "../hadith/BtnAddItem/BtnAddItem";
import { AddItemFormDialog } from "./AddItemFormDialog/AddItemFormDialog";
import {
  createEditHadithSchema,
  type EditHadithFormValues,
} from "@/src/services/hadithSchemaServer";

type EditHadithFormProps = {
  hadith: HadithType;
  existingNumeros: number[];
  chaptersData: ItemType[];
  sahabasData: ItemType[];
  transmittersData: ItemType[];
};

export function EditHadithForm({
  hadith,
  existingNumeros,
  chaptersData,
  // narratorsData,
  sahabasData,
  transmittersData,
}: EditHadithFormProps) {
  type EditVariant = Exclude<VariantType, "chapters">;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [variant, setVariant] = useState<EditVariant | null>(null);
  const router = useRouter();

  const hadithSchema = createEditHadithSchema(existingNumeros, hadith.numero);

  const {
    register,
    control,
    handleSubmit: handleFormSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(hadithSchema),
    mode: "onChange",
    defaultValues: {
      numero: hadith.numero,
      chapter: hadith.chapter.name_fr,
      mentionedSahabas: hadith.mentionedSahabas.map((s) => s.name_fr),
      isnadTransmitters: hadith.isnadTransmitters.map((t) => t.name_fr),
      matn_fr: hadith.matn_fr,
      matn_ar: hadith.matn_ar,
      matn_en: hadith.matn_en ?? "",
    },
  });

  const formValues = watch();

  const chapterOptions = chaptersData.map((chapter) => chapter.name_fr);
  const sahabaOptions = sahabasData.map((s) => s.name_fr);
  const transmitterOptions = transmittersData.map((t) => t.name_fr);

  // Prepare items for AddItemFormDialog
  const items: Record<EditVariant, ItemType[]> = {
    sahabas: sahabasData,
    transmitters: transmittersData,
  };

  // Handlers to open/close add-item dialog
  const handleOpenDialog = (v: EditVariant) => {
    setVariant(v);
    setIsOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setIsOpenDialog(false);
    setVariant(null);
  };

  // Handle form submission for editing
  const onSubmit = async (data: EditHadithFormValues) => {
    setIsSubmitting(true);

    // Find IDs corresponding to selected names/titles using props
    const selectedChapter = chaptersData.find(
      (chapter) => chapter.name_fr === data.chapter
    );

    const selectedSahabas = sahabasData.filter((s) =>
      data.mentionedSahabas.includes(s.name_fr)
    );

    // Preserve order from form for transmitters (map to maintain form order)
    const selectedTransmitters = data.isnadTransmitters
      .map((name) =>
        transmittersData.find((transmitter) => transmitter.name_fr === name)
      )
      .filter(
        (transmitter): transmitter is NonNullable<typeof transmitter> =>
          transmitter !== undefined
      );

    if (!selectedChapter) {
      toast.error("Chapitre sélectionné invalide.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      numero: data.numero,
      matn_fr: data.matn_fr,
      matn_ar: data.matn_ar,
      matn_en: data.matn_en,
      chapter: selectedChapter.name_fr,
      mentionedSahabas: selectedSahabas.map((s) => s.name_fr),
      isnadTransmitters: selectedTransmitters.map((t) => t.name_fr),
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
    numero: (formValues.numero as number) || hadith.numero,
    chapter: {
      ...hadith.chapter,
      name_fr: formValues.chapter || hadith.chapter.name_fr,
      slug: hadith.chapter.slug || "preview-chapter-slug",
    },
    mentionedSahabas: (formValues.mentionedSahabas || []).map((name_fr, i) => ({
      id: `preview-sahaba-id-${i}`,
      name_fr,
      slug: `preview-sahaba-slug-${i}`,
    })),
    isnadTransmitters: (formValues.isnadTransmitters || []).map(
      (name_fr: string, i: number) => ({
        id: `preview-transmitter-id-${i}`,
        name_fr,
        slug: `preview-transmitter-slug-${i}`,
      })
    ),
    matn_fr: formValues.matn_fr || "...",
    matn_ar: formValues.matn_ar || "...",
    matn_en: formValues.matn_en || "...",
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
          {/* Narrator supprimé */}

          {/* IsnadTransmitters */}
          <div className="flex justify-between items-end gap-1">
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
            <BtnAddItem onOpen={() => handleOpenDialog("transmitters")} />
          </div>

          {/* Sahabas */}
          <div className="flex justify-between items-end gap-1">
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
            <BtnAddItem onOpen={() => handleOpenDialog("sahabas")} />
          </div>

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
            rows={3}
            dir="rtl"
            className="text-lg"
            error={!!errors.matn_ar}
            errorMessage={errors.matn_ar?.message}
            register={register("matn_ar")}
            onChange={(e) => {
              const cleanedText = cleanArabicText(e.target.value);
              setValue("matn_ar", cleanedText);
            }}
            helperText="Le texte sera automatiquement nettoyé"
          />

          {/* matn_en (English text) */}
          <MdTextArea
            id="matn_en"
            name="matn_en"
            label="Texte anglais*"
            control={control}
            error={!!errors.matn_en}
            errorMessage={errors.matn_en?.message}
            placeholder="Enter the English hadith text..."
            height={200}
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
            edit
          />
        </div>
      </div>
      {/* AddItemFormDialog Portal */}
      {isOpenDialog &&
        variant &&
        createPortal(
          <AddItemFormDialog
            open={isOpenDialog}
            onCancel={handleCloseDialog}
            items={items[variant]}
            variant={variant}
          />,
          document.body
        )}
    </div>
  );
}
