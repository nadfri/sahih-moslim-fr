import { Link } from "@/i18n/navigation";
import { BookOpen } from "lucide-react";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center md:items-center space-x-2 text-emerald-500 hover:text-emerald-400 transition-colors"
    >
      <BookOpen
        className="size-8 md:size-22 flex-shrink-0"
        strokeWidth="1"
      />
      {/* Original title for mobile */}
      <span className="text-xl font-bold font-serif md:hidden">
        Sahih Muslim
      </span>

      <div className="hidden md:flex md:flex-col md:leading-tight">
        <span className="text-2xl font-bold font-serif">Sahih</span>
        <span className="text-2xl font-bold font-serif">Muslim</span>
      </div>
    </Link>
  );
}
