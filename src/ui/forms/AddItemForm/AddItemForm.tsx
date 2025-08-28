"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "react-toastify";

import { addItem } from "@/src/services/actions";
import { ItemType, VariantType } from "@/src/types/types";
import { Input } from "@/src/ui/inputs/Input/Input";
import { nextAvailableIndex } from "@/src/utils/nextAvailableIndex";
import { getItemFormSchema } from "../schemas/getItemFormSchema";

type Props = {
  items: ItemType[];
  variant: VariantType;
};

const placeholderText = {
  title: {
    chapters: "Ajouter un chapitre",
    narrators: "Ajouter un narrateur",
    sahabas: "Ajouter un compagnon",
    transmitters: "Ajouter un transmetteur",
  },

  name: {
    chapters: "Nom du chapitre",
    narrators: "Nom du narrateur",
    sahabas: "Nom du compagnon",
    transmitters: "Nom du transmetteur",
  },
};

export function AddItemForm({ items: serverItems, variant }: Props) {
  const [items, setItems] = useState<ItemType[]>(serverItems);
  const [isPending, startTransition] = useTransition();

  const ItemAddSchema = getItemFormSchema(items, variant);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(ItemAddSchema),
    defaultValues: {
      name: "",
      nameArabic: "",
      index: nextAvailableIndex(items, variant),
    },
  });

  function addItemSubmit(formData: z.infer<typeof ItemAddSchema>) {
    startTransition(async () => {
      try {
        const response = await addItem(variant, formData);

        if (response.success && response.data) {
          toast.success(response.message);

          const newItem = response.data as ItemType;

          const newList = [...items, newItem];
          setItems(newList);

          const newSuggestedIndex = nextAvailableIndex(newList, variant);

          reset({
            name: "",
            nameArabic: "",
            index: newSuggestedIndex,
          });
        } else {
          toast.error(response.message || "Une erreur est survenue.");
        }
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur inattendue lors de l'ajout.";
        toast.error(errorMessage);
      }
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-emerald-700 dark:text-emerald-300">
          {placeholderText.title[variant]}
        </h2>
        <form
          onSubmit={handleSubmit(addItemSubmit)}
          className="flex flex-col gap-4"
        >
          {/* Index Field (visible only for chapters but always included in form data) */}
          {variant === "chapters" && (
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 m-0 text-right relative top-4">
                Suggéré: {nextAvailableIndex(items, variant)}
              </p>

              <Input
                id="index"
                label="Numero du chapitre*"
                type="number"
                min={1}
                error={!!errors.index}
                errorMessage={errors.index?.message}
                register={register("index")}
              />
            </div>
          )}

          {/* Name Field */}
          <Input
            id="name"
            label={placeholderText.title[variant] + "*"}
            type="text"
            placeholder={placeholderText.name[variant]}
            error={!!errors.name}
            errorMessage={errors.name?.message}
            register={register("name")}
          />

          {/* Arabic Name Field */}
          <Input
            id="nameArabic"
            label="Nom en arabe (optionnel)"
            type="text"
            placeholder="الاسم بالعربية"
            error={!!errors.nameArabic}
            errorMessage={errors.nameArabic?.message}
            register={register("nameArabic")}
            dir="rtl"
          />

          <button
            type="submit"
            className="mt-2 flex items-center justify-center gap-2 w-full py-2 px-4 rounded-lg font-semibold transition focus:outline-none bg-emerald-600 dark:bg-emerald-500 text-white dark:text-gray-900 hover:bg-emerald-700 dark:hover:bg-emerald-600disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isPending}
          >
            <Plus className="w-5 h-5" />

            {isPending ? "En cours..." : placeholderText.title[variant]}
          </button>
        </form>
      </div>
    </div>
  );
}
