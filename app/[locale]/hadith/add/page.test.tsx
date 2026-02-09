import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { renderWithI18n } from "@/__tests__/renderWithI18n";

const enforceAdminAccess = vi.fn(async () => undefined);

vi.mock("@/src/lib/auth/supabase/helpers", () => ({
  enforceAdminAccess,
}));

vi.mock("@/prisma/prisma", () => ({
  default: {
    hadith: {
      findFirst: vi.fn(async () => ({ numero: 41 })),
    },
  },
}));

vi.mock("@/src/services/services", () => ({
  getAllChapters: vi.fn(async () => [{ id: "c1" }]),
  getAllSahabas: vi.fn(async () => [{ id: "s1" }]),
  getAllTransmitters: vi.fn(async () => [{ id: "t1" }]),
}));

type AddHadithFormProps = {
  initialNumero: number;
  chaptersData: unknown[];
  sahabasData: unknown[];
  transmittersData: unknown[];
};

vi.mock("@/app/[locale]/hadith/add/AddHadithForm", () => ({
  AddHadithForm: ({ initialNumero }: AddHadithFormProps) => (
    <div data-testid="add-form">{initialNumero}</div>
  ),
}));

describe("Add hadith page", () => {
  it("renders the form with the next numero", async () => {
    const { default: AddHadithPage } =
      await import("@/app/[locale]/hadith/add/page");

    const ui = await AddHadithPage();

    renderWithI18n(ui);

    expect(enforceAdminAccess).toHaveBeenCalled();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Ajouter"
    );
    expect(screen.getByTestId("add-form")).toHaveTextContent("42");
  });
});
