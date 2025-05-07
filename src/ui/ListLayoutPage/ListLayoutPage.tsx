import Link from "next/link";
import { BookOpenText, MoveRight } from "lucide-react";

import { PersonType } from "../../types/types";

type ListPageProps = {
  title: string;
  persons: PersonType[];
  basePath: "narrators" | "sahabas";
};

export function ListLayoutPage({ title, persons, basePath }: ListPageProps) {
  return (
    <div className="container mx-auto max-w-5xl">
      {/*Title*/}
      <h1 className="title">{title}</h1>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {/*Links*/}
        {persons.map((person) => (
          <Link
            href={`${basePath}/${person.slug}`}
            key={person.name}
            className="group block h-full"
          >
            {/* Card Content */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col p-6 transition-all duration-300 ease-in-out border border-transparent group-hover:shadow-xl group-hover:border-emerald-300 group-hover:-translate-y-1">
              <div className="flex-grow">
                {/* Name */}
                <h2 className="text-xl font-semibold font-serif text-emerald-700 mb-2 group-hover:text-emerald-600 transition-colors">
                  {person.name}
                </h2>

                {/* Hadith Count */}
                <p className="text-xs inline-flex items-center font-medium bg-gray-100 text-gray-600 rounded-md px-2 py-0.5">
                  <BookOpenText className="h-3 w-3 mr-1" />
                  {person.hadithCount} Hadiths
                </p>
              </div>

              {/* Navigation Indicator */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-sm font-medium text-emerald-600 flex items-center group-hover:text-emerald-700 transition-colors">
                  Explorer
                  <MoveRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
