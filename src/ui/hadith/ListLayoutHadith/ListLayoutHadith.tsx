import { HadithType } from "@/src/types/types";
import { BadgeNumberOfHadith } from "@/src/ui/BadgeNumberOfHadith/BadgeNumberOfHadith";
import { Hadith } from "@/src/ui/hadith/Hadith/Hadith";

type ListLayoutHadithProps = {
  title: string;
  name: string;
  hadiths: HadithType[];
};

export function ListLayoutHadith({
  title,
  name,
  hadiths,
}: ListLayoutHadithProps) {
  return (
    <>
      <h1 className="text-2xl md:text-4xl font-serif font-bold text-center text-emerald-800 mb-8 md:mb-12 tracking-tight">
        {title}{" "}
        <span className="text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded">
          {name}
        </span>
      </h1>

      <BadgeNumberOfHadith
        count={hadiths.length}
        size="large"
      />

      <div className="space-y-8">
        {hadiths.map((hadith) => (
          <Hadith
            key={hadith.id}
            hadith={hadith}
          />
        ))}
      </div>
    </>
  );
}
