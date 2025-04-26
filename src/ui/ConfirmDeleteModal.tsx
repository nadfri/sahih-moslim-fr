"use client";

import { useEffect, useRef, useState } from "react";

type ConfirmDeleteModalProps = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
  title?: string;
  description?: string;
};

export function ConfirmDeleteModal({
  open,
  onCancel,
  onConfirm,
  loading = false,
  title = "Confirm deletion",
  description = "Are you sure you want to delete this item?",
}: ConfirmDeleteModalProps) {
  // Animation state
  const [show, setShow] = useState(open);
  const [visible, setVisible] = useState(open);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (open) {
      setVisible(true);
      setTimeout(() => setShow(true), 10); // trigger animation
    } else {
      setShow(false);
      timeoutRef.current = setTimeout(() => setVisible(false), 200); // match duration
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [open]);

  if (!visible) return null;
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2 transition-opacity duration-200 ${show ? "opacity-100" : "opacity-0"}`}
    >
      <div
        className={`bg-white rounded-lg shadow-lg p-6 max-w-sm w-full transform transition-all duration-200 ${show ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}`}
      >
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="mb-4">{description}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? "Supression..." : "Supprimer"}
          </button>
        </div>
      </div>
    </div>
  );
}
