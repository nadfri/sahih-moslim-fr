import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithI18n } from "@/__tests__/renderWithI18n";
import { Matn_ar } from "./Matn_ar";

// Mock data for testing
const mockHadith = {
  matn_ar: "قال رسول الله صلى الله عليه وسلم",
  matn_fr: "Le Messager d'Allah a dit",
};

// Mock the MarkdownHighlighter component
vi.mock("@/src/ui/hadith/MarkdownHighlighter/MarkdownHighlighter", () => ({
  MarkdownHighlighter: ({
    children,
    highlight,
  }: {
    children: string;
    highlight?: string;
  }) => {
    if (highlight) {
      // Simple mock highlighting by wrapping highlighted text in <mark>
      const regex = new RegExp(`(${highlight})`, "gi");
      const highlightedContent = children.replace(regex, "<mark>$1</mark>");
      return <div dangerouslySetInnerHTML={{ __html: highlightedContent }} />;
    }
    return <div>{children}</div>;
  },
}));

// Mock the containsArabic utility
vi.mock("@/src/utils/normalizeArabicText", () => ({
  containsArabic: vi.fn((text: string) => {
    // Simple Arabic detection for testing
    const arabicRegex = /[\u0600-\u06FF]/;
    return arabicRegex.test(text);
  }),
  prepareArabicForHighlight: vi.fn((text: string) => {
    // Simple mock that removes diacritics
    return text.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "");
  }),
}));

describe("Matn_ar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the toggle button", () => {
    renderWithI18n(<Matn_ar matn={mockHadith.matn_ar} />);

    const toggleButton = screen.getByRole("button");
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveTextContent("Voir la version arabe");
  });

  it("should initially hide the Arabic text", () => {
    renderWithI18n(<Matn_ar matn={mockHadith.matn_ar} />);

    // Arabic text should not be visible initially (check by grid rows class)
    const arabicContainer = document.querySelector("[id]");
    expect(arabicContainer).toHaveClass("grid-rows-[0fr]", "opacity-0");
  });

  it("should show Arabic text when toggle button is clicked", async () => {
    const user = userEvent.setup();
    renderWithI18n(<Matn_ar matn={mockHadith.matn_ar} />);

    const toggleButton = screen.getByRole("button");
    await user.click(toggleButton);

    // Arabic text should now be visible (check by grid rows class)
    const arabicContainer = document.querySelector("[id]");
    expect(arabicContainer).toHaveClass("grid-rows-[1fr]", "opacity-100");
    expect(toggleButton).toHaveTextContent("Masquer la version arabe");
  });

  it("should hide Arabic text when toggle button is clicked again", async () => {
    const user = userEvent.setup();
    renderWithI18n(<Matn_ar matn={mockHadith.matn_ar} />);

    const toggleButton = screen.getByRole("button");

    // Show the text
    await user.click(toggleButton);
    const arabicContainer = document.querySelector("[id]");
    expect(arabicContainer).toHaveClass("grid-rows-[1fr]", "opacity-100");

    // Hide the text
    await user.click(toggleButton);
    expect(arabicContainer).toHaveClass("grid-rows-[0fr]", "opacity-0");
    expect(toggleButton).toHaveTextContent("Voir la version arabe");
  });

  it("should auto-show Arabic text when highlight contains Arabic characters", () => {
    const arabicHighlight = "رسول";

    renderWithI18n(
      <Matn_ar
        matn={mockHadith.matn_ar}
        highlight={arabicHighlight}
      />
    );

    // Arabic text should be automatically visible (check by grid rows class)
    const arabicContainer = document.querySelector("[id]");
    expect(arabicContainer).toHaveClass("grid-rows-[1fr]", "opacity-100");

    const toggleButton = screen.getByRole("button");
    expect(toggleButton).toHaveTextContent("Masquer la version arabe");
  });

  it("should not auto-show Arabic text when highlight contains only Latin characters", () => {
    const latinHighlight = "test";

    renderWithI18n(
      <Matn_ar
        matn={mockHadith.matn_ar}
        highlight={latinHighlight}
      />
    );

    // Arabic text should remain hidden (check by grid rows class)
    const arabicContainer = document.querySelector("[id]");
    expect(arabicContainer).toHaveClass("grid-rows-[0fr]", "opacity-0");

    const toggleButton = screen.getByRole("button");
    expect(toggleButton).toHaveTextContent("Voir la version arabe");
  });

  it("should render with correct CSS classes for the container", () => {
    renderWithI18n(<Matn_ar matn={mockHadith.matn_ar} />);

    const container = screen.getByRole("button").parentElement;
    expect(container).toHaveClass(
      "mt-4",
      "pt-2",
      "border-t",
      "border-emerald-100",
      "dark:border-emerald-900"
    );
  });

  it("should render toggle button with correct styling", () => {
    renderWithI18n(<Matn_ar matn={mockHadith.matn_ar} />);

    const toggleButton = screen.getByRole("button");
    expect(toggleButton).toHaveClass(
      "flex",
      "items-center",
      "space-x-2",
      "text-sm",
      "font-medium",
      "text-emerald-700",
      "dark:text-emerald-500"
    );
  });

  it("should render Arabic text with correct styling when visible", async () => {
    const user = userEvent.setup();
    renderWithI18n(<Matn_ar matn={mockHadith.matn_ar} />);

    const toggleButton = screen.getByRole("button");
    await user.click(toggleButton);

    // Find the div with dir="rtl" which contains the Arabic text styling
    const arabicTextContainer = document.querySelector('[dir="rtl"]');
    expect(arabicTextContainer).toHaveClass(
      "pt-2",
      "text-right",
      "text-xl",
      "leading-loose",
      "text-pretty",
      "dark:text-gray-300"
    );
  });

  it("should pass highlight prop to MarkdownHighlighter when visible", () => {
    const highlightTerm = "رسول";

    renderWithI18n(
      <Matn_ar
        matn={mockHadith.matn_ar}
        highlight={highlightTerm}
      />
    );

    // Text should be auto-shown and highlighted
    const markElement = document.querySelector("mark");
    expect(markElement).toBeInTheDocument();
    expect(markElement?.textContent).toBe(highlightTerm);
  });

  it("should handle empty matn content", async () => {
    const user = userEvent.setup();
    renderWithI18n(<Matn_ar matn="" />);

    const toggleButton = screen.getByRole("button");
    expect(toggleButton).toBeInTheDocument();

    await user.click(toggleButton);
    // Should not crash when rendering empty content
  });

  it("should handle undefined highlight prop", () => {
    renderWithI18n(
      <Matn_ar
        matn={mockHadith.matn_ar}
        highlight={undefined}
      />
    );

    // Should render without crashing
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should handle empty highlight prop", () => {
    renderWithI18n(
      <Matn_ar
        matn={mockHadith.matn_ar}
        highlight=""
      />
    );

    // Should not auto-show for empty highlight (check by grid rows class)
    const arabicContainer = document.querySelector("[id]");
    expect(arabicContainer).toHaveClass("grid-rows-[0fr]", "opacity-0");
  });

  it("should update visibility when highlight prop changes", () => {
    const { rerender } = renderWithI18n(
      <Matn_ar
        matn={mockHadith.matn_ar}
        highlight="test"
      />
    );

    // Initially hidden for Latin highlight
    const arabicContainer = document.querySelector("[id]");
    expect(arabicContainer).toHaveClass("grid-rows-[0fr]", "opacity-0");

    // Update to Arabic highlight
    rerender(
      <Matn_ar
        matn={mockHadith.matn_ar}
        highlight="رسول"
      />
    );

    // Should now be visible
    expect(arabicContainer).toHaveClass("grid-rows-[1fr]", "opacity-100");
  });

  it("should preserve manual toggle state when highlight is not Arabic", async () => {
    const user = userEvent.setup();
    renderWithI18n(
      <Matn_ar
        matn={mockHadith.matn_ar}
        highlight="test"
      />
    );

    const toggleButton = screen.getByRole("button");
    const arabicContainer = document.querySelector("[id]");

    // Manually show the text
    await user.click(toggleButton);
    expect(arabicContainer).toHaveClass("grid-rows-[1fr]", "opacity-100");

    // Manually hide the text
    await user.click(toggleButton);
    expect(arabicContainer).toHaveClass("grid-rows-[0fr]", "opacity-0");
  });

  it("should handle long Arabic text content", async () => {
    const user = userEvent.setup();
    const longArabicText = "قال رسول الله صلى الله عليه وسلم ".repeat(10);

    renderWithI18n(<Matn_ar matn={longArabicText} />);

    const toggleButton = screen.getByRole("button");
    await user.click(toggleButton);

    // Check that the content is visible by checking container classes
    const arabicContainer = document.querySelector("[id]");
    expect(arabicContainer).toHaveClass("grid-rows-[1fr]", "opacity-100");
  });

  it("should handle mixed Arabic and non-Arabic characters", async () => {
    const user = userEvent.setup();
    const mixedText = "قال رسول الله ﷺ said";

    renderWithI18n(<Matn_ar matn={mixedText} />);

    const toggleButton = screen.getByRole("button");
    await user.click(toggleButton);

    // Check that the content is visible by checking container classes
    const arabicContainer = document.querySelector("[id]");
    expect(arabicContainer).toHaveClass("grid-rows-[1fr]", "opacity-100");
  });
});
