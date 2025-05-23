"use client";

import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { addItem } from "@/src/services/actions";
import { ItemFormValues, ItemType, VariantType } from "@/src/types/types";
import { getItemFormSchema } from "@/src/ui/forms/schemas/getItemFormSchema";
import { Input } from "@/src/ui/inputs/Input/Input";
import { nextAvailableIndex } from "@/src/utils/nextAvailableIndex";
import { Dialog } from "../../Dialog/Dialog";

type Props = {
  open: boolean;
  onCancel: () => void;
  items: ItemType[];
  variant: VariantType;
};

const placeholderText = {
  title: {
    chapters: "Ajouter un chapitre",
    narrators: "Ajouter un narrateur",
    sahabas: "Ajouter un compagnon",
  },

  name: {
    chapters: "Nom du chapitre",
    narrators: "Nom du narrateur",
    sahabas: "Nom du compagnon",
  },
};

export function AddItemFormDialog({ open, onCancel, items, variant }: Props) {
  const [isPending, startTransition] = useTransition();

  const ItemAddSchema = getItemFormSchema(items, variant);

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    reset,
  } = useForm<ItemFormValues>({
    resolver: zodResolver(ItemAddSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      nameArabic: "",
      index: nextAvailableIndex(items, variant),
    },
  });

  function addItemSubmit(formData: ItemFormValues) {
    startTransition(async () => {
      try {
        const response = await addItem(variant, formData);

        if (response.success) {
          toast.success(response.message);
          reset();
          onCancel();
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error("Erreur inconnue lors de l'ajout.");
        console.error("[AddItemFormDialog] Erreur lors de l'ajout:", error);
      }
    });
  }

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      title={placeholderText.title[variant]}
    >
      <form
        onSubmit={handleFormSubmit(addItemSubmit)}
        className="flex flex-col gap-6"
      >
        {/* Index Field */}
        {variant === "chapters" && (
          <Input
            id="add-index"
            label="Index*"
            type="number"
            placeholder="Index"
            min={1}
            error={!!errors.index}
            errorMessage={errors.index?.message}
            register={register("index")}
          />
        )}

        {/* Name Field */}
        <Input
          id="add-name"
          label={placeholderText.name[variant] + "*"}
          type="text"
          placeholder={placeholderText.name[variant]}
          error={!!errors.name}
          errorMessage={errors.name?.message}
          register={register("name")}
        />

        {/* Arabic Name Field */}
        <Input
          id="add-nameArabic"
          label="Nom en arabe (optionnel)"
          type="text"
          placeholder="Nom en arabe"
          error={!!errors.nameArabic}
          errorMessage={errors.nameArabic?.message}
          register={register("nameArabic")}
          dir="rtl"
        />

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
            onClick={onCancel}
            disabled={isPending}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white dark:text-gray-900 hover:bg-emerald-700 dark:hover:bg-emerald-600 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isPending}
          >
            {isPending ? "En cours..." : "Ajouter"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
