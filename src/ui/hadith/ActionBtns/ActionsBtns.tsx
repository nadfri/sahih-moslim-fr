"use client";

import { Link } from "@/i18n/navigation";
import { Pencil, TriangleAlert, Trash2, ExternalLink } from "lucide-react";
import { useState } from "react";
import { ConfirmDeleteModal } from "@/src/ui/forms/ConfirmDeleteModal/ConfirmDeleteModal";

import { HadithType } from "@/src/types/types";
import { CopyBoard } from "../CopyBoard/CopyBoard";
import { deleteHadith } from "@/src/services/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

export function ActionsBtns({
  hadith,
  isAdmin,
}: {
  hadith: HadithType;
  isAdmin: boolean;
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const t = useTranslations("hadith.ActionsBtns");

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteHadith(hadith.id);
      if (result.success) {
        toast.success("Hadith supprimé avec succès!");
        router.refresh();
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

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
      <div className="flex flex-wrap items-center gap-3 ms-auto">
        <Link
          href={`/hadith/${hadith.numero}`}
          className="inline-flex items-center justify-center aspect-square size-8 
          rounded-md 
          bg-emerald-200 
        text-emerald-700 
        hover:bg-emerald-300 
          dark:bg-emerald-400 
          dark:text-emerald-900 
        dark:hover:bg-emerald-300
          transition duration-200
          "
          title={t("link-to", { numero: hadith.numero })}
          aria-label={t("link-to", { numero: hadith.numero })}
        >
          <ExternalLink className="size-4" />
        </Link>

        <CopyBoard hadith={hadith} />

        <button
          className="inline-flex items-center gap-1.5 text-sm font-medium bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-500 px-3 py-1.5 rounded-md hover:bg-amber-100 dark:hover:bg-amber-900/70 hover:text-amber-700 dark:hover:text-amber-400"
          title={t("report")}
          aria-label={t("reportErrorAria")}
        >
          <TriangleAlert
            className="size-4"
            aria-hidden="true"
          />
          <span>{t("report")}</span>
        </button>

        {isAdmin && (
          <>
            <Link
              href={`/hadith/${hadith.numero}/edit`}
              className="inline-flex items-center gap-1.5 text-sm font-medium bg-orange-50 dark:bg-orange-700 text-orange-600 dark:text-orange-300 px-3 py-1.5 rounded-md hover:bg-orange-100 dark:hover:bg-orange-900/70 hover:text-orange-700 dark:hover:text-orange-400"
              title="Modifier ce hadith"
              aria-label="Éditer le hadith"
            >
              <Pencil
                className="size-4"
                aria-hidden="true"
              />
              <span>{t("edit")}</span>
            </Link>

            <button
              className="inline-flex items-center justify-center aspect-square size-8 bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 rounded-md hover:bg-red-100 dark:hover:bg-red-900/70 hover:text-red-700 dark:hover:text-red-300"
              title={t("delete")}
              aria-label={t("delete")}
              onClick={() => setShowDeleteModal(true)}
              disabled={isDeleting}
            >
              <Trash2 className="size-4" />
            </button>

            <ConfirmDeleteModal
              open={showDeleteModal}
              onCancel={() => setShowDeleteModal(false)}
              onConfirm={handleDelete}
              loading={isDeleting}
              title={t("deleteConfirmModal-title", { numero: hadith.numero })}
              description={t("deleteConfirmModal-description")}
            />
          </>
        )}
      </div>
    </div>
  );
}
