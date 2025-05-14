"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import { deleteItem } from "@/src/services/actions";
import { ItemType, VariantType } from "@/src/types/types";
import { ConfirmDeleteModal } from "../../ConfirmDeleteModal/ConfirmDeleteModal";
import { EditItemFormDialog } from "../EditItemFormDialog/EditItemFormDialog";

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
  narrators: {
    title: "Supprimer ce narrateur ?",
    description: "Êtes-vous sûr de vouloir supprimer ce narrateur ",
  },
  sahabas: {
    title: "Supprimer ce compagnon ?",
    description: "Êtes-vous sûr de vouloir supprimer ce compagnon ",
  },
};

export function CardEdit({ item, items, variant }: Props) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteItem(variant, item.id);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Erreur inconnue lors de la suppression.");
    } finally {
      setIsDeleting(false);
    }
  };

  const deleteDescription = (
    <p>
      {variantOptions[variant].description}
      <span className="inline-block mx-1 px-2 py-0.5 rounded bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 font-semibold">
        {item.name}
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

          <h3 className="font-medium text-gray-900 dark:text-gray-100">
            {item.name}
          </h3>
        </div>

        {item.nameArabic && (
          <div className="mt-1">
            <span className="block text-emerald-600 dark:text-emerald-400 text-lg font-arabic">
              {item.nameArabic}
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
        onConfirm={handleDelete}
        loading={isDeleting}
        title={variantOptions[variant].title}
        description={deleteDescription}
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
