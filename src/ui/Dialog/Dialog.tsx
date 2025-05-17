import { ReactNode, useEffect, useId, useRef } from "react";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export function Dialog({ open, onClose, title, children }: DialogProps) {
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const titleId = useId();

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!open) return null;

  const handleClose = () => {
    if (ref.current) {
      ref.current.classList.replace("fadeIn", "fadeOut");
      timeoutRef.current = setTimeout(onClose, 200);
    }
  };

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/70 px-2 transition-opacity duration-200 fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-lg w-full duration-200 moveUp relative">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 text-xl font-bold"
          aria-label="Fermer"
        >
          ×
        </button>
        <h2
          id={titleId}
          className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100"
        >
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
