"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import { addItem } from "@/src/services/actions";
import { AddItemFormValues, ItemType, VariantType } from "@/src/types/types";

type Props = {
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

export function AddItemForm({ items: serverItems, variant }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [items, setItems] = useState<ItemType[]>(serverItems);

  const existingNames = () => items.map((item) => item.name.toLowerCase());
  const existingIndexes = () => items.map((chapter) => chapter.index);

  const ItemSchema = z.object({
    name: z
      .string()
      .min(3, "Au moins 3 lettres")
      .trim()
      .refine(
        (name) => !existingNames().includes(name.toLowerCase()),
        "Ce nom est déjà utilisé. Veuillez en choisir un autre."
      ),

    nameArabic: z
      .string()
      .trim()
      .transform((val) => (val === "" ? null : val))
      .nullable()
      .optional(),

    index:
      variant === "chapters"
        ? z.coerce
            .number({
              message: "L'index est requis",
            })
            .int({ message: "L'index doit être un nombre entier" })
            .positive({ message: "L'index doit être un nombre positif" })
            .refine(
              (index) => !existingIndexes().includes(index),
              "Cet index est déjà utilisé. Veuillez en choisir un autre."
            )
        : z.union([z.undefined(), z.null()]), // for no chapters
  });

  // Get the next available index for chapters (returns 1 if empty, else max+1)
  function nextAvailableIndex(items: ItemType[]): number | undefined {
    if (variant !== "chapters") return undefined;

    if (items.length === 0) return 1;
    return Math.max(...items.map((chapter) => chapter.index ?? 0)) + 1;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddItemFormValues>({
    mode: "onChange",
    resolver: zodResolver(ItemSchema),
    defaultValues: {
      name: "",
      nameArabic: "",
      index: nextAvailableIndex(items),
    },
  });

  async function addItemSubmit(formData: AddItemFormValues) {
    setIsSubmitting(true);

    try {
      const response = await addItem(variant, formData);

      if (response.success && response.data) {
        toast.success(response.message);

        const newItem = response.data as ItemType;

        const newList = [...items, newItem];
        setItems(newList);

        const newSuggestedIndex = nextAvailableIndex(newList);

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
    } finally {
      setIsSubmitting(false);
    }
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
              <div className="flex justify-between items-baseline mb-1">
                <label
                  htmlFor="index"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Numero du chapitre*
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Suggéré: {nextAvailableIndex(items)}
                </p>
              </div>

              <input
                id="index"
                type="number"
                placeholder="Index"
                {...register("index")}
                className={`block w-full rounded-lg border ${
                  errors.index
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-700"
                } bg-gray-50 dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 ${
                  errors.index ? "focus:ring-red-500" : "focus:ring-emerald-500"
                }`}
              />
              <p className="mt-1 text-xs text-red-600 dark:text-red-400 h-4">
                {errors.index?.message || <>&nbsp;</>}
              </p>
            </div>
          )}

          {/* Name Field */}
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {placeholderText.title[variant]}*
              </label>
            </div>
            <input
              id="name"
              type="text"
              placeholder={placeholderText.name[variant]}
              {...register("name")}
              className={`block w-full rounded-lg border ${
                errors.name
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-700"
              } bg-gray-50 dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 ${
                errors.name ? "focus:ring-red-500" : "focus:ring-emerald-500"
              }`}
            />
            <p className="mt-1 text-xs text-red-600 dark:text-red-400 h-4">
              {errors.name?.message || <>&nbsp;</>}
            </p>
          </div>

          {/* Arabic Name Field */}
          <div>
            <label
              htmlFor="nameArabic"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Nom en arabe (optionnel)
            </label>
            <input
              id="nameArabic"
              type="text"
              placeholder="الاسم بالعربية"
              {...register("nameArabic")}
              className={`block w-full rounded-lg border ${
                errors.nameArabic
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-700"
              } bg-gray-50 dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 ${
                errors.nameArabic
                  ? "focus:ring-red-500"
                  : "focus:ring-emerald-500"
              }`}
              dir="rtl"
            />
            <p className="mt-1 text-xs text-red-600 dark:text-red-400 h-4">
              {errors.nameArabic?.message || <>&nbsp;</>}
            </p>
          </div>

          <button
            type="submit"
            className="mt-2 flex items-center justify-center gap-2 w-full py-2 px-4 rounded-lg font-semibold transition focus:outline-none focus-visible:ring-1 bg-emerald-600 dark:bg-emerald-500 text-white dark:text-gray-900 hover:bg-emerald-700 dark:hover:bg-emerald-600 focus-visible:ring-emerald-500 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            <Plus className="w-5 h-5" />

            {isSubmitting ? "En cours..." : placeholderText.title[variant]}
          </button>
        </form>
      </div>
    </div>
  );
}
