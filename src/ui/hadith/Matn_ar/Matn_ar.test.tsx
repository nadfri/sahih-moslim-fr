import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { highlightText } from "@/src/utils/highlightText";
import { mockHadith } from "@/src/utils/mocks/mockHadith";
import { Matn_ar } from "./Matn_ar";

// Mock the highlightText utility functions
vi.mock("@/src/utils/highlightText", () => ({
  highlightText: vi.fn((text: string, highlight?: string) => {
    if (!highlight) return text;
    return `${text} (highlighted: ${highlight})`;
  }),
  highlightTextAsHTML: vi.fn((text: string, highlight?: string) => {
    if (!highlight) return text;
    return text.replace(
      new RegExp(highlight, "gi"),
      `<mark>${highlight}</mark>`
    );
  }),
}));

const mockedHighlightText = vi.mocked(highlightText);

describe("Matn_ar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the mock implementation before each test
    mockedHighlightText.mockImplementation(
      (text: string, highlight?: string) => {
        if (!highlight) return text;
        return `${text} (highlighted: ${highlight})`;
      }
    );
  });

  it("should render with toggle button when update is false", () => {
    render(<Matn_ar matn={mockHadith.matn_ar} />);

    expect(
      screen.getByRole("button", { name: /Voir la version arabe/ })
    ).toBeInTheDocument();
  });

  it("should not render toggle button when update is true", () => {
    render(
      <Matn_ar
        matn={mockHadith.matn_ar}
        update={true}
      />
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("should hide Arabic content by default", () => {
    render(<Matn_ar matn={mockHadith.matn_ar} />);

    const toggleButton = screen.getByRole("button");
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");

    const contentId = toggleButton.getAttribute("aria-controls");
    const arabicContent = document.getElementById(contentId!);
    expect(arabicContent).toHaveClass("grid-rows-[0fr]", "opacity-0");
  });

  it("should toggle Arabic content visibility when button is clicked", async () => {
    const user = userEvent.setup();
    render(<Matn_ar matn={mockHadith.matn_ar} />);

    const toggleButton = screen.getByRole("button");

    // Initially hidden
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("Voir la version arabe")).toBeInTheDocument();

    // Click to show
    await user.click(toggleButton);

    expect(toggleButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Masquer la version arabe")).toBeInTheDocument();

    // Click to hide
    await user.click(toggleButton);

    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("Voir la version arabe")).toBeInTheDocument();
  });

  it("should render Arabic text with correct styling", () => {
    render(
      <Matn_ar
        matn={mockHadith.matn_ar}
        update={true}
      />
    );

    // Find the div with dir="rtl"
    const arabicDiv = document.querySelector('[dir="rtl"]');
    expect(arabicDiv).toHaveClass(
      "pt-2",
      "text-right",
      "font-matn_ar",
      "text-xl",
      "leading-loose",
      "text-pretty",
      "dark:text-gray-300"
    );
    expect(arabicDiv).toHaveAttribute("dir", "rtl");
  });

  it("should call highlightText with correct parameters when highlight is provided", () => {
    render(
      <Matn_ar
        matn={mockHadith.matn_ar}
        highlight="test"
        update={true}
      />
    );

    expect(mockedHighlightText).toHaveBeenCalledWith(
      mockHadith.matn_ar,
      "test"
    );
    expect(mockedHighlightText).toHaveBeenCalledTimes(1);
  });

  it("should call highlightText with undefined when no highlight is provided", () => {
    render(
      <Matn_ar
        matn={mockHadith.matn_ar}
        update={true}
      />
    );

    expect(mockedHighlightText).toHaveBeenCalledWith(
      mockHadith.matn_ar,
      undefined
    );
    expect(mockedHighlightText).toHaveBeenCalledTimes(1);
  });

  it("should handle empty matn gracefully", () => {
    render(
      <Matn_ar
        matn=""
        update={true}
      />
    );

    expect(mockedHighlightText).toHaveBeenCalledWith("", undefined);
  });

  it("should render highlighted content when highlight is provided", () => {
    const arabicText = "النص العربي للحديث";

    // Mock highlightText to return highlighted text
    mockedHighlightText.mockReturnValueOnce(
      "النص العربي للحديث (highlighted: العربي)"
    );

    render(
      <Matn_ar
        matn={arabicText}
        highlight="العربي"
        update={true}
      />
    );

    expect(
      screen.getByText("النص العربي للحديث (highlighted: العربي)")
    ).toBeInTheDocument();
  });
});
