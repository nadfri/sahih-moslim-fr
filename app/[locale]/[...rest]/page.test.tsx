import { describe, expect, it, vi } from "vitest";

const notFoundMock = vi.fn();
vi.mock("next/navigation", () => ({
  notFound: () => notFoundMock(),
}));

describe("Catch-all page", () => {
  it("calls notFound", async () => {
    const { default: CatchAllPage } =
      await import("@/app/[locale]/[...rest]/page");

    CatchAllPage();

    expect(notFoundMock).toHaveBeenCalled();
  });
});
