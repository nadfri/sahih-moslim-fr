"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { FieldErrors, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import { addItem } from "@/src/services/actions";
import { AddItemFormValues, ItemType, VariantType } from "@/src/types/types";
import { slugify } from "@/src/utils/slugify";

type AddItemFormProps = {
  initialItems: ItemType[];
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

export function AddItemForm({ initialItems, variant }: AddItemFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [items, setItems] = useState<ItemType[]>(initialItems);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const existingNames = useMemo(
    () => items.map((c) => c.name.toLowerCase()),
    [items]
  );
  const existingIndexes = useMemo(
    () => (variant === "chapters" ? items.map((c) => c.index!) : []),
    [items, variant]
  );

  // Dynamic Zod schema defined locally
  const itemSchema = useMemo(() => {
    const nameValidation = z
      .string()
      .min(3, "Au moins 3 lettres")
      .trim()
      .refine(
        (name) => !existingNames.includes(name.toLowerCase()),
        "Ce nom est déjà utilisé. Veuillez en choisir un autre."
      );

    const nameArabicValidation = z
      .string()
      .trim()
      .transform((val) => (val === "" ? null : val))
      .nullable()
      .optional();

    if (variant === "chapters") {
      const indexValidation = z.coerce
        .number({
          required_error: "L'index est requis",
          invalid_type_error: "L'index doit être un nombre",
        })
        .int({ message: "L'index doit être un nombre entier" })
        .positive({ message: "L'index doit être un nombre positif" })
        .refine(
          (index) => !existingIndexes.includes(index),
          "Cet index est déjà utilisé. Veuillez en choisir un autre."
        );
      return z.object({
        name: nameValidation,
        index: indexValidation,
        nameArabic: nameArabicValidation,
      });
    }
    // For narrators/sahabas: no index
    return z.object({
      name: nameValidation,
      nameArabic: nameArabicValidation,
    });
  }, [variant, existingNames, existingIndexes]);

  const nextAvailableIndex = useMemo(() => {
    if (variant !== "chapters") return undefined;
    if (items.length === 0) return 1;
    const validIndexes = items.map((c) => c.index!);

    if (validIndexes.length === 0) return 1;
    const maxIndex = Math.max(...validIndexes);
    return maxIndex + 1;
  }, [items, variant]);

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<AddItemFormValues>({
    mode: "onChange",
    resolver: zodResolver(itemSchema),
    // defaultValues will handle initial load and variant changes
    defaultValues: useMemo(
      () => ({
        name: "",
        nameArabic: "",
        index: variant === "chapters" ? nextAvailableIndex : undefined,
      }),
      [variant, nextAvailableIndex]
    ),
  });

  const watchedName = watch("name");
  const liveSlug = useMemo(() => slugify(watchedName || ""), [watchedName]);

  const onAddItemSubmit = async (formData: AddItemFormValues) => {
    setIsSubmitting(true);

    try {
      const response = await addItem(variant, formData);

      if (response.success && response.data) {
        toast.success(response.message);

        // Update items state
        const newItem = response.data as ItemType;
        setItems((prevItems) => [...prevItems, newItem]);

        let newSuggestedIndex: number | undefined = undefined;

        if (variant === "chapters") {
          const currentItemsPlusNew = [...items, newItem]; // Use the current 'items' state and add the new one for calculation
          const validIndexes = currentItemsPlusNew.map((c) => c.index!);

          if (validIndexes.length === 0) {
            newSuggestedIndex = 1;
          } else {
            newSuggestedIndex = Math.max(...validIndexes) + 1;
          }
        }

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
  };

  const formErrors = errors as FieldErrors<AddItemFormValues>;

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-emerald-700 dark:text-emerald-300">
          {placeholderText.title[variant]}
        </h2>
        <form
          onSubmit={handleFormSubmit(onAddItemSubmit)}
          className="flex flex-col gap-4"
        >
          {/* Index Field (only for chapters) */}
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
                  Suggéré: {nextAvailableIndex}
                </p>
              </div>
              <input
                id="index"
                type="number"
                placeholder="Index"
                {...register("index", { valueAsNumber: true })}
                min={1}
                className={`block w-full rounded-lg border ${
                  formErrors.index
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-700"
                } bg-gray-50 dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 ${
                  formErrors.index
                    ? "focus:ring-red-500"
                    : "focus:ring-emerald-500"
                }`}
              />
              <p className="mt-1 text-xs text-red-600 dark:text-red-400 h-4">
                {formErrors.index?.message || <>&nbsp;</>}
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
              {watchedName && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Slug: <span className="font-mono">{liveSlug}</span>
                </p>
              )}
            </div>
            <input
              id="name"
              type="text"
              placeholder={placeholderText.name[variant]}
              {...register("name")}
              className={`block w-full rounded-lg border ${
                formErrors.name
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-700"
              } bg-gray-50 dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 ${
                formErrors.name
                  ? "focus:ring-red-500"
                  : "focus:ring-emerald-500"
              }`}
            />
            <p className="mt-1 text-xs text-red-600 dark:text-red-400 h-4">
              {formErrors.name?.message || <>&nbsp;</>}
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
                formErrors.nameArabic
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-700"
              } bg-gray-50 dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 ${
                formErrors.nameArabic
                  ? "focus:ring-red-500"
                  : "focus:ring-emerald-500"
              }`}
              dir="rtl"
            />
            <p className="mt-1 text-xs text-red-600 dark:text-red-400 h-4">
              {formErrors.nameArabic?.message || <>&nbsp;</>}
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
