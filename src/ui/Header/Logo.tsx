import Link from "next/link";
import { BookOpen } from "lucide-react";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center md:items-start space-x-2 hover:text-emerald-600 transition-colors flex-shrink-0"
    >
      <BookOpen
        className="text-emerald-600 group-hover:text-emerald-700 transition-colors h-8 w-8 md:h-22 md:w-22 flex-shrink-0"
        strokeWidth="1"
      />
      {/* Original title for mobile */}
      <span className="text-xl font-bold font-serif md:hidden">
        Sahih Muslim <span className="text-emerald-600">FR</span>
      </span>

      <div className="hidden md:flex md:flex-col md:leading-tight">
        <span className="text-xl font-bold font-serif">Sahih</span>
        <span className="text-xl font-bold font-serif">Muslim</span>
        <span className="text-xl font-bold font-serif text-emerald-600">
          FR
        </span>
      </div>
    </Link>
  );
}
