/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/

import { FilterType } from "@/src/types/types";

/**
 * Determine filter mode from search parameters - unified logic
 */
export function detectFilterMode(params: {
  query?: string;
  // narrator?: string; // removed
  sahabas?: string[];
  transmitters?: string[];
  numero?: string;
}): FilterType {
  const { query, sahabas = [], transmitters = [], numero } = params;

  // Priority order: specific filters first, then general word search
  if (numero) return "numero";
  // if (narrator) return "narrator";
  if (sahabas.length > 0) return "sahaba";
  if (transmitters.length > 0) return "transmitter";
  if (query) return "word";

  return "word"; // default
}

/**
 * Extract search parameters from URLSearchParams or request
 */
export function extractSearchParams(searchParams: URLSearchParams) {
  return {
    query: searchParams.get("query") || "",
    // narrator: searchParams.get("narrator") || "",
    sahabas: searchParams.getAll("sahaba"),
    transmitters: searchParams.getAll("transmitter"),
    numero: searchParams.get("numero") || "",
  };
}

/**
 * Build URLSearchParams from search criteria
 */
export function buildSearchParams(
  filterMode: FilterType,
  query: string,
  // narrator: string,
  sahabas: string[],
  transmitters: string[],
  numero: string
): URLSearchParams {
  const params = new URLSearchParams();

  // Only add the parameter that corresponds to the current filter mode
  switch (filterMode) {
    case "word":
      if (query) params.set("query", query);
      break;

    case "sahaba":
      sahabas.forEach((sahaba) => params.append("sahaba", sahaba));
      break;

    case "transmitter":
      transmitters.forEach((transmitter) =>
        params.append("transmitter", transmitter)
      );
      break;

    case "numero":
      if (numero) params.set("numero", numero);
      break;
  }

  return params;
}
