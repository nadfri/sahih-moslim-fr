// Skeleton loader for Hadith component
export function HadithSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border-l-4 md:border-l-8 border-emerald-600 dark:border-emerald-700 animate-pulse">
      <div className="p-3 md:p-6 space-y-5">
        {/* Metadata Section */}
        <div className="space-y-3">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-48" />
        </div>

        {/* Isnad lines */}
        <div className="space-y-2 pl-4 border-l-2 border-gray-300 dark:border-gray-700">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-56" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-52" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-48" />
        </div>

        {/* Matn text - large block */}
        <div className="space-y-3">
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full" />
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full" />
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6" />
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full" />
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-4/5" />
        </div>

        {/* Sahabas section */}
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32" />
          <div className="flex gap-2 flex-wrap">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-24" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-28" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20" />
          </div>
        </div>

        {/* Arabic text */}
        <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-40" />
          <div
            className="h-4 bg-gray-300 dark:bg-gray-700 rounded"
            dir="rtl"
          />
          <div
            className="h-4 bg-gray-300 dark:bg-gray-700 rounded"
            dir="rtl"
          />
        </div>
      </div>
    </div>
  );
}
