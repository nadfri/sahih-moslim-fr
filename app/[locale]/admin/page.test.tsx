import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { renderWithI18n } from "@/__tests__/renderWithI18n";

const enforceAdminAccess = vi.fn(async () => undefined);

vi.mock("@/src/lib/auth/supabase/helpers", () => ({
  enforceAdminAccess,
}));

vi.mock("@/src/services/services", () => ({
  getAllChapters: vi.fn(async () => [{ id: "c1" }]),
  getAllSahabas: vi.fn(async () => [{ id: "s1" }]),
  getAllTransmitters: vi.fn(async () => [{ id: "t1" }]),
  getHadithsCount: vi.fn(async () => 12),
}));

type AdminDashboardProps = {
  datas: {
    hadithsCount: number;
  };
};

vi.mock(
  "@/app/[locale]/admin/components/AdminDashboard/AdminDashboard",
  () => ({
    AdminDashboard: ({ datas }: AdminDashboardProps) => (
      <div data-testid="admin-dashboard">{datas.hadithsCount}</div>
    ),
  })
);

describe("Admin page", () => {
  it("renders dashboard data", async () => {
    const { default: AdminPage } = await import("@/app/[locale]/admin/page");

    const ui = await AdminPage();

    renderWithI18n(ui);

    expect(enforceAdminAccess).toHaveBeenCalled();
    expect(screen.getByTestId("admin-dashboard")).toHaveTextContent("12");
  });
});
