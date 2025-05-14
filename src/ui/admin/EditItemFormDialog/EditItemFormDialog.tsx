"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { editItem } from "@/src/services/actions";
import { ItemFormValues, ItemType, VariantType } from "@/src/types/types";
import { getItemSchema } from "@/src/ui/forms/ItemFormSchema";
import { Input } from "@/src/ui/inputs/Input/Input";
import { Dialog } from "../../Dialog/Dialog";

type Props = {
  open: boolean;
  onCancel: () => void;
  item: ItemType;
  items: ItemType[];
  variant: VariantType;
};

export function EditItemFormDialog({
  open,
  onCancel,
  item,
  items,
  variant,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ItemEditSchema = getItemSchema(items, variant, item.id);

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
  } = useForm<ItemFormValues>({
    resolver: zodResolver(ItemEditSchema),
    mode: "onChange",
    defaultValues: item,
  });

  async function editItemSubmit(formData: ItemFormValues) {
    setIsSubmitting(true);
    try {
      const response = await editItem(variant, { ...formData, id: item.id });
      if (response && response.success) {
        toast.success(response.message);
        onCancel();
      } else if (response) {
        toast.error(response.message);
      } else {
        toast.error("Erreur inconnue lors de la modification.");
      }
    } catch (error) {
      toast.error("Erreur inconnue lors de la modification.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      title="Éditer le chapitre"
    >
      <form
        onSubmit={handleFormSubmit(editItemSubmit)}
        className="space-y-4"
      >
        {/* Hidden input for ID if needed, or ensure it's part of 'data' */}
        <input
          type="hidden"
          defaultValue={item.id}
        />

        {/* Index Field */}
        <Input
          id="edit-index"
          label="Index*"
          type="number"
          placeholder="Index"
          min={1}
          error={!!errors.index}
          errorMessage={errors.index?.message}
          register={register("index")}
        />

        {/* Name Field */}
        <Input
          id="edit-name"
          label="Nom du chapitre*"
          type="text"
          placeholder="Nom du chapitre"
          error={!!errors.name}
          errorMessage={errors.name?.message}
          register={register("name")}
        />

        {/* Arabic Name Field */}
        <Input
          id="edit-nameArabic"
          label="Nom arabe (optionnel)"
          type="text"
          placeholder="Nom arabe"
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
            disabled={isSubmitting}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-600 dark:bg-blue-500 text-white dark:text-gray-900 hover:bg-blue-700 dark:hover:bg-blue-600 font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? "En cours..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
