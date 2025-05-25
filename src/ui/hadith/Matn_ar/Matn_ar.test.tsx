import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { highlightText } from "@/src/utils/highlightText";
import { mockHadith } from "@/src/utils/mocks/mockHadith";
import { Matn_ar } from "./Matn_ar";

// Mock the highlightText utility
vi.mock("@/src/utils/highlightText", () => ({
  highlightText: vi.fn((text: string, highlight?: string) => {
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

  it("should show Arabic content when update is true", () => {
    render(
      <Matn_ar
        matn={mockHadith.matn_ar}
        update={true}
      />
    );

    const arabicContent = screen.getByText(mockHadith.matn_ar).closest("div");
    expect(arabicContent?.parentElement?.parentElement).toHaveClass(
      "grid-rows-[1fr]",
      "opacity-100"
    );
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

    const arabicText = screen.getByText(mockHadith.matn_ar);
    expect(arabicText).toHaveClass(
      "pt-2",
      "text-right",
      "font-matn_ar",
      "text-xl",
      "leading-loose",
      "text-pretty",
      "dark:text-gray-300"
    );
    expect(arabicText).toHaveAttribute("dir", "rtl");
  });

  it("should call highlightText with correct parameters when highlight is provided", () => {
    render(
      <Matn_ar
        matn={mockHadith.matn_ar}
        highlight="test"
      />
    );

    expect(mockedHighlightText).toHaveBeenCalledWith(
      mockHadith.matn_ar,
      "test"
    );
    expect(mockedHighlightText).toHaveBeenCalledTimes(1);
  });

  it("should call highlightText with undefined when no highlight is provided", () => {
    render(<Matn_ar matn={mockHadith.matn_ar} />);

    expect(mockedHighlightText).toHaveBeenCalledWith(
      mockHadith.matn_ar,
      undefined
    );
    expect(mockedHighlightText).toHaveBeenCalledTimes(1);
  });

  it("should have proper container styling with dark mode support", () => {
    const { container } = render(<Matn_ar matn={mockHadith.matn_ar} />);

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass(
      "mt-5",
      "pt-4",
      "border-t",
      "border-emerald-100",
      "dark:border-emerald-900"
    );
  });

  it("should render with correct aria attributes using useId", () => {
    render(<Matn_ar matn={mockHadith.matn_ar} />);

    const toggleButton = screen.getByRole("button");
    const contentId = toggleButton.getAttribute("aria-controls");

    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
    expect(contentId).toBeTruthy();
    expect(document.getElementById(contentId!)).toBeInTheDocument();
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

  it("should use dangerouslySetInnerHTML for Arabic content", () => {
    const arabicText = "النص العربي للحديث";

    // Mock highlightText to return HTML with mark tag
    mockedHighlightText.mockReturnValue("النص <mark>العربي</mark> للحديث");

    render(
      <Matn_ar
        matn={arabicText}
        highlight="العربي"
        update={true}
      />
    );

    const arabicDiv = screen.getByText((content, element) => {
      return element?.innerHTML === "النص <mark>العربي</mark> للحديث";
    });

    expect(arabicDiv).toBeInTheDocument();
  });
});
