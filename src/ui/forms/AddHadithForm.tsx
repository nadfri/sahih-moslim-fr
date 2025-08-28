"use client";

/*Libs*/
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPortal } from "react-dom"; // Import createPortal

import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { addHadith } from "@/src/services/actions";
import { HadithType, ItemType, VariantType } from "@/src/types/types";
import {
  createHadithFormSchema,
  type HadithFormValues,
} from "@/src/schemas/hadithSchemas";
/*UI*/
import { Hadith } from "@/src/ui/hadith/Hadith/Hadith";
import { Input } from "@/src/ui/inputs/Input/Input";
import { MdTextArea } from "@/src/ui/inputs/MdTextArea/MdTextArea";
import { SearchSelect } from "@/src/ui/inputs/SearchSelect/SearchSelect";
import { Select } from "@/src/ui/inputs/Select/Select";
/*Utils*/
import { cleanArabicText } from "@/src/utils/cleanArabicText";
import { wrapProphetNames } from "@/src/utils/wrapProphetNames";
import { BtnAddItem } from "../hadith/BtnAddItem/BtnAddItem";
import { MultiSelect } from "../inputs/MultiSelect/MultiSelect";
import { MultiSelectDragNDrop } from "../inputs/MultiSelectDragNDrop/MultiSelectDragNDrop";
import { AddItemFormDialog } from "./AddItemFormDialog/AddItemFormDialog";

type Props = {
  initialNumeros: number[];
  chaptersData: ItemType[];
  narratorsData: ItemType[];
  sahabasData: ItemType[];
  transmittersData: ItemType[];
};

export function AddHadithForm({
  initialNumeros,
  chaptersData,
  narratorsData,
  sahabasData,
  transmittersData,
}: Props) {
  const [existingNumeros, setExistingNumeros] =
    useState<number[]>(initialNumeros);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [variant, setVariant] = useState<VariantType | null>(null);

  const hadithSchema = createHadithFormSchema(existingNumeros);

  const {
    register,
    control,
    handleSubmit: handleFormSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(hadithSchema),
    mode: "onChange",
    defaultValues: {
      numero: initialNumeros.length > 0 ? Math.max(...initialNumeros) + 1 : 1,
      chapter: "La Foi",
      narrator: "Abou Huraira",
      mentionedSahabas: [],
      isnadTransmitters: [],
      matn_fr: "",
      isnad: "",
      matn_ar: "",
    },
  });

  const formValues = watch();

  const chapterOptions = chaptersData.map((chapter) => chapter.name);
  const narratorOptions = narratorsData.map((n) => n.name);
  const sahabaOptions = sahabasData.map((s) => s.name);
  const transmitterOptions = transmittersData.map((t) => t.name);

  // Function to open the dialog with the correct variant
  const handleOpenDialog = (variant: VariantType) => {
    setVariant(variant);
    setIsOpenDialog(true);
  };

  // Function to close the dialog
  const handleCloseDialog = () => {
    setIsOpenDialog(false);
    setVariant(null);
  };
  const onSubmit = async (data: HadithFormValues) => {
    setIsSubmitting(true);

    // Find IDs corresponding to selected names using props
    const selectedChapter = chaptersData.find(
      (chapter) => chapter.name === data.chapter
    );
    const selectedNarrator = narratorsData.find(
      (narrator) => narrator.name === data.narrator
    ); // Keep alphabetical order for sahabas (filter from original data)
    const selectedSahabas = sahabasData.filter((sahaba) =>
      data.mentionedSahabas.includes(sahaba.name)
    );

    // Preserve order from form for transmitters (map to maintain form order)
    const selectedTransmitters = data.isnadTransmitters
      .map((name) => transmittersData.find((t) => t.name === name))
      .filter((t): t is NonNullable<typeof t> => t !== undefined);

    if (!selectedChapter || !selectedNarrator) {
      toast.error("Chapitre ou narrateur sélectionné invalide.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      numero: data.numero,
      matn_fr: data.matn_fr,
      matn_ar: data.matn_ar,
      chapter: selectedChapter.name,
      narrator: selectedNarrator.name,
      mentionedSahabas: selectedSahabas.map((s) => s.name),
      isnadTransmitters: selectedTransmitters.map((t) => t.name),
    };

    try {
      const result = await addHadith(payload);

      if (result.success) {
        toast.success("Hadith ajouté avec succès!");

        // Update local state and reset form
        const newNumero = data.numero;
        // Important: Update the state used for schema validation *before* resetting
        const updatedNumeros = [...existingNumeros, newNumero];
        setExistingNumeros(updatedNumeros); // Update the list of existing numbers

        reset({
          numero: Math.max(...updatedNumeros) + 1,
          chapter: "La Foi",
          narrator: "Abou Huraira",
          mentionedSahabas: [],
          isnadTransmitters: [],
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

  const items = {
    chapters: chaptersData,
    narrators: narratorsData,
    sahabas: sahabasData,
    transmitters: transmittersData,
  };

  // Construct preview object matching HadithType exactly
  const previewHadith: HadithType = {
    id: "preview-id",
    numero: (formValues.numero as number) || 0,
    chapter: {
      id: "preview-chapter-id",
      name: formValues.chapter || "Sélectionnez un chapitre...",
      slug: "preview-chapter-slug",
    },
    narrator: {
      id: "preview-narrator-id",
      name: formValues.narrator || "Sélectionnez un narrateur...",
      slug: "preview-narrator-slug",
    },
    mentionedSahabas: (formValues.mentionedSahabas || []).map((name, i) => ({
      id: `preview-sahaba-id-${i}`,
      name: name,
      slug: `preview-sahaba-slug-${i}`,
    })),
    isnadTransmitters: (formValues.isnadTransmitters || []).map(
      (name: string, i: number) => ({
        id: `preview-transmitter-id-${i}`,
        name: name,
        slug: `preview-transmitter-slug-${i}`,
      })
    ),
    matn_fr: formValues.matn_fr || "...",
    matn_ar: formValues.matn_ar || "...",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <form
          onSubmit={handleFormSubmit(onSubmit)}
          className="flex flex-col gap-7"
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
          <div className="flex justify-between items-end gap-1">
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
            <BtnAddItem onOpen={() => handleOpenDialog("chapters")} />
          </div>
          {/* Narrator */}
          <div className="flex justify-between items-end gap-1">
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
            <BtnAddItem onOpen={() => handleOpenDialog("narrators")} />
          </div>

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

          {/* MentionedSahabas */}
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
              const processedValue = wrapProphetNames(value);
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
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none disabled:bg-emerald-300 disabled:dark:bg-emerald-800/50 disabled:cursor-not-allowed mt-2"
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
