import { HadithType } from "../types/types";

export function getNarratorName(hadith: HadithType): string | undefined {
  return hadith?.isnadTransmitters[hadith.isnadTransmitters.length - 1]
    ?.name_fr;
}
