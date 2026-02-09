"use client";

import { NextIntlClientProvider } from "next-intl";
import Image from "next/image";

import { Hadith } from "@/src/ui/hadith/Hadith/Hadith";
import { HadithType } from "@/src/types/types";
import frMessages from "@/src/messages/fr.json";
import enMessages from "@/src/messages/en.json";
import arMessages from "@/src/messages/ar.json";

type Props = {
  hadith: HadithType;
  highlight?: string;
};

const previews = [
  {
    locale: "fr" as const,
    label: "Version Francaise",
    flag: "/flag_fr.svg",
    messages: frMessages,
    dir: "ltr" as const,
  },
  {
    locale: "en" as const,
    label: "English Version",
    flag: "/flag_en.svg",
    messages: enMessages,
    dir: "ltr" as const,
  },
  {
    locale: "ar" as const,
    label: "Arabic Version",
    flag: "/flag_ar.svg",
    messages: arMessages,
    dir: "rtl" as const,
  },
];

export function HadithPreviewAll({ hadith, highlight }: Props) {
  return (
    <div className="space-y-8">
      {previews.map((preview, index) => (
        <div
          key={preview.locale}
          className={
            index === 0
              ? ""
              : "pt-4 border-t border-gray-200 dark:border-gray-700"
          }
        >
          <div className="mb-3 flex justify-end">
            <Image
              src={preview.flag}
              alt={preview.label}
              width={28}
              height={20}
              className="h-5 w-auto"
            />
            <span className="sr-only">{preview.label}</span>
          </div>

          <div dir={preview.dir}>
            <NextIntlClientProvider
              locale={preview.locale}
              messages={preview.messages}
            >
              <Hadith
                hadith={hadith}
                edit
                highlight={highlight}
              />
            </NextIntlClientProvider>
          </div>
        </div>
      ))}
    </div>
  );
}
