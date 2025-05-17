import { BookOpenText } from "lucide-react";

type BadgeNumberOfHadithProps = {
  count?: number;
  size?: "small" | "large";
};

export function BadgeNumberOfHadith({
  count = 0,
  size = "small",
}: BadgeNumberOfHadithProps) {
  const baseClasses = "inline-flex items-center font-medium rounded-md";
  const sizeClasses = {
    small:
      "text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5",
    large:
      "text-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-400 px-3 py-1 mb-4",
  };
  const iconSizeClasses = {
    small: "h-3 w-3 mr-1",
    large: "h-4 w-4 mr-1.5",
  };

  return (
    <span className={`${baseClasses} ${sizeClasses[size]}`}>
      <BookOpenText className={`${iconSizeClasses[size]}`} />
      {count} Hadith{count !== 1 ? "s" : ""}
    </span>
  );
}
