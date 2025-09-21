"use client";

import { useState, useTransition } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { deleteItem } from "@/src/services/actions";
import { ItemType, VariantType } from "@/src/types/types";
import { ConfirmDeleteModal } from "@/src/ui/ConfirmDeleteModal/ConfirmDeleteModal";
import { EditItemFormDialog } from "@/src/ui/forms/EditItemFormDialog/EditItemFormDialog";
import { BadgeNumberOfHadith } from "@/src/ui/hadith/BadgeNumberOfHadith/BadgeNumberOfHadith";

type Props = {
  item: ItemType;
  items: ItemType[];
  variant: VariantType;
};

const variantOptions = {
  chapters: {
    title: "Supprimer ce chapitre ?",
    description: "Êtes-vous sûr de vouloir supprimer ce chapitre ",
  },
  sahabas: {
    title: "Supprimer ce compagnon ?",
    description: "Êtes-vous sûr de vouloir supprimer ce compagnon ",
  },
  transmitters: {
    title: "Supprimer ce transmetteur ?",
    description: "Êtes-vous sûr de vouloir supprimer ce transmetteur ",
  },
};

export function CardEdit({ item, items, variant }: Props) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleDelete() {
    try {
      const result = await deleteItem(variant, item.id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);

        if (result.error) {
          console.error("Suppression échouée:", result.error);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur inconnue lors de la suppression.");
    }
  }

  const deleteDescription = (
    <p>
      {variantOptions[variant].description}
      <span className="inline-block mx-1 px-2 py-0.5 rounded bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 font-semibold">
        {item.name_fr}
      </span>
      {" ?"}
    </p>
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-3 flex">
      {/* Main content on the left */}
      <div className="flex-grow flex flex-col gap-1">
        <div className="flex items-center gap-2">
          {/* Index */}
          {item.index !== undefined && (
            <span className="inline-flex items-center justify-center bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-sm font-medium h-6 min-w-6 px-1.5 rounded-md">
              {item.index}
            </span>
          )}

          {/* Name */}
          <h3 className="font-medium text-gray-900 dark:text-gray-100 space-x-2">
            <span>{item.name_fr}</span>{" "}
            <BadgeNumberOfHadith count={item.hadithCount} />
          </h3>
        </div>

        {item.name_ar && (
          <div className="mt-1">
            <span className="block text-emerald-600 dark:text-emerald-400 text-lg font-arabic">
              {item.name_ar}
            </span>
          </div>
        )}

        {item.name_en && (
          <div className="mt-1">
            <span className="block text-blue-600 dark:text-blue-400 text-base font-normal">
              {item.name_en}
            </span>
          </div>
        )}

        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Slug: {item.slug}
        </div>
      </div>

      <div className="flex items-center ml-3">
        <button
          type="button"
          onClick={() => setShowEditDialog(true)}
          className="p-1.5 rounded text-orange-500 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/70 flex items-center justify-center"
          aria-label="Éditer"
          title="Éditer"
        >
          <Pencil className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center"
          aria-label="Supprimer"
          title="Supprimer"
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      <ConfirmDeleteModal
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={() => startTransition(handleDelete)}
        loading={isPending}
        description={deleteDescription}
        title={variantOptions[variant].title}
        hadithCount={item.hadithCount}
      />

      <EditItemFormDialog
        open={showEditDialog}
        onCancel={() => setShowEditDialog(false)}
        item={item}
        items={items}
        variant={variant}
      />
    </div>
  );
}
