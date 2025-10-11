"use client";

import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "react-toastify";

import { editItem } from "@/src/services/actions";
import { ItemType, VariantType } from "@/src/types/types";
import { getItemFormSchema } from "@/src/ui/forms/schemas/getItemFormSchema";
import { Input } from "@/src/ui/forms/inputs/Input/Input";
import { Dialog } from "../Dialog/Dialog";

type Props = {
  open: boolean;
  onCancel: () => void;
  item: ItemType;
  items: ItemType[];
  variant: VariantType;
};

const placeholderText = {
  title: {
    chapters: "Éditer le chapitre",
    sahabas: "Éditer le compagnon",
    transmitters: "Éditer le transmetteur",
  },

  name: {
    chapters: "Nom du chapitre",
    sahabas: "Nom du compagnon",
    transmitters: "Nom du transmetteur",
  },
};

export function EditItemFormDialog({
  open,
  onCancel,
  item,
  items,
  variant,
}: Props) {
  const [isPending, startTransition] = useTransition();

  const ItemEditSchema = getItemFormSchema(items, variant, item.id);

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ItemEditSchema),
    mode: "onChange",
    defaultValues: item,
  });

  function editItemSubmit(formData: z.infer<typeof ItemEditSchema>) {
    startTransition(async () => {
      try {
        const response = await editItem(variant, { ...formData, id: item.id });

        if (response.success) {
          toast.success(response.message);
          onCancel(); // Only call onCancel on success
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error("Erreur inconnue lors de la modification.");

        if (error instanceof Error) {
          console.error(
            "[EditItemFormDialog] Erreur lors de la modification:",
            error.message,
            error.stack
          );
        } else {
          console.error("[EditItemFormDialog] Erreur inconnue:", error);
        }

        if (
          typeof error === "object" &&
          error !== null &&
          "response" in error
        ) {
          console.error(
            "[EditItemFormDialog] Réponse serveur:",
            error.response
          );
        }
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
        onSubmit={handleFormSubmit(editItemSubmit)}
        className="flex flex-col gap-6"
      >
        {/* Index Field */}
        {variant === "chapters" && (
          <Input
            id="edit-index"
            label="Index*"
            type="number"
            placeholder="Index"
            min={0}
            error={!!errors.index}
            errorMessage={errors.index?.message}
            register={register("index", { valueAsNumber: true })}
          />
        )}

        {/* Name Field */}
        <Input
          id="edit-name_fr"
          label={placeholderText.name[variant] + "*"}
          type="text"
          placeholder={placeholderText.name[variant]}
          error={!!errors.name_fr}
          errorMessage={errors.name_fr?.message}
          register={register("name_fr")}
        />
        <Input
          id="edit-name_ar"
          label="Nom en arabe (optionnel)"
          type="text"
          placeholder="Nom en arabe"
          error={!!errors.name_ar}
          errorMessage={errors.name_ar?.message}
          register={register("name_ar")}
          dir="rtl"
        />

        <Input
          id="edit-name_en"
          label="Nom en anglais (optionnel)"
          type="text"
          placeholder="Nom en anglais"
          error={!!errors.name_en}
          errorMessage={errors.name_en?.message}
          register={register("name_en")}
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
            {isPending ? "En cours..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
