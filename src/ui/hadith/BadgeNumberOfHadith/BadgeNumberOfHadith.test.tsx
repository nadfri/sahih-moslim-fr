import { renderWithI18n } from "@/__tests__/renderWithI18n";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BadgeNumberOfHadith } from "./BadgeNumberOfHadith";

describe("BadgeNumberOfHadith", () => {
  it("renders with default props", () => {
    renderWithI18n(<BadgeNumberOfHadith count={0} />);
    expect(screen.getByText("0 Hadith")).toBeInTheDocument();
  });

  it("displays singular form for count of 1", () => {
    renderWithI18n(<BadgeNumberOfHadith count={1} />);
    expect(screen.getByText("1 Hadith")).toBeInTheDocument();
  });

  it("displays plural form for counts other than 1", () => {
    renderWithI18n(<BadgeNumberOfHadith count={5} />);
    expect(screen.getByText("5 Hadiths")).toBeInTheDocument();
  });

  it("applies small size styles by default", () => {
    renderWithI18n(<BadgeNumberOfHadith count={0} />);
    const badge = screen.getByText("0 Hadith");
    expect(badge).toHaveClass("text-xs");
    expect(badge).toHaveClass("bg-gray-100");
  });

  it("applies large size styles when specified", () => {
    renderWithI18n(
      <BadgeNumberOfHadith
        count={0}
        size="large"
      />
    );
    const badge = screen.getByText("0 Hadith");
    expect(badge).toHaveClass("text-md");
    expect(badge).toHaveClass("bg-emerald-100");
  });

  it("renders with BookOpenText icon", () => {
    renderWithI18n(<BadgeNumberOfHadith count={0} />);
    // Since the icon is an SVG, we can't directly query for it
    // Instead, check for its parent span
    const badge = screen.getByText("0 Hadith");
    expect(badge.firstChild).toHaveClass("h-3");
    expect(badge.firstChild).toHaveClass("w-3");
  });
});
