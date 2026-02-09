import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { renderWithI18n } from "@/__tests__/renderWithI18n";

const enforceAdminAccess = vi.fn(async () => undefined);

vi.mock("@/src/lib/auth/supabase/helpers", () => ({
  enforceAdminAccess,
}));

vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
}));

vi.mock("@/src/services/services", () => ({
  getHadithByNumero: vi.fn(async () => ({ numero: 123 })),
  getAllChapters: vi.fn(async () => [{ id: "c1" }]),
  getAllSahabas: vi.fn(async () => [{ id: "s1" }]),
  getAllTransmitters: vi.fn(async () => [{ id: "t1" }]),
}));

type EditHadithFormProps = {
  hadith: { numero: number };
  chaptersData: unknown[];
  sahabasData: unknown[];
  transmittersData: unknown[];
};

vi.mock("@/app/[locale]/hadith/[numero]/edit/EditHadithForm", () => ({
  EditHadithForm: ({ hadith }: EditHadithFormProps) => (
    <div data-testid="edit-form">{hadith.numero}</div>
  ),
}));

describe("Edit hadith page", () => {
  it("renders the edit form", async () => {
    const { default: EditPage } =
      await import("@/app/[locale]/hadith/[numero]/edit/page");

    const ui = await EditPage({ params: Promise.resolve({ numero: "123" }) });

    renderWithI18n(ui);

    expect(enforceAdminAccess).toHaveBeenCalled();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("123");
    expect(screen.getByTestId("edit-form")).toHaveTextContent("123");
  });
});
