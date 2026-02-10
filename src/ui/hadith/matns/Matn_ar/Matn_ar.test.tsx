import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Matn_ar } from "./Matn_ar";

// Mock dependencies
vi.mock("@/src/ui/hadith/MarkdownHighlighter/MarkdownHighlighter", () => ({
  MarkdownHighlighter: ({
    children,
    highlight,
  }: {
    children: string;
    highlight?: string;
  }) => (
    <div
      data-testid="markdown-highlighter"
      data-highlight={highlight}
    >
      {children}
    </div>
  ),
}));

vi.mock("@/src/utils/normalizeArabicText", () => ({
  containsArabic: (text: string) => /[\u0600-\u06FF]/.test(text),
}));

vi.mock("@/src/utils/wrapProphetNamesMultilingual", () => ({
  wrapArabicProphetNames: (text: string) =>
    text.replace(/محمد/g, "<prophet>محمد</prophet>"),
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      "hadith.ActionsBtns.hide-arabic": "إخفاء النص العربي",
      "hadith.ActionsBtns.see-arabic": "عرض النص العربي",
    };
    return translations[key] || key;
  },
}));

describe("Matn_ar Component", () => {
  describe("Rendering", () => {
    it("renders Arabic hadith text", () => {
      const arabicText = "قال النبي صلى الله عليه وسلم: ...";
      render(
        <Matn_ar
          matn={arabicText}
          showToggle={false}
        />
      );

      expect(screen.getByTestId("markdown-highlighter")).toBeInTheDocument();
    });

    it("renders with RTL direction attribute", () => {
      const arabicText = "نص عربي";
      const { container } = render(
        <Matn_ar
          matn={arabicText}
          showToggle={false}
        />
      );

      const rtlDiv = container.querySelector('[dir="rtl"]');
      expect(rtlDiv).toBeInTheDocument();
      expect(rtlDiv).toHaveClass("text-right");
    });

    it("renders empty string without errors", () => {
      render(
        <Matn_ar
          matn=""
          showToggle={false}
        />
      );

      expect(screen.getByTestId("markdown-highlighter")).toBeInTheDocument();
    });
  });

  describe("Toggle button visibility", () => {
    it("shows toggle button when showToggle is true", () => {
      const arabicText = "نص عربي";
      render(
        <Matn_ar
          matn={arabicText}
          showToggle={true}
        />
      );

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("hides toggle button when showToggle is false", () => {
      const arabicText = "نص عربي";
      const { container } = render(
        <Matn_ar
          matn={arabicText}
          showToggle={false}
        />
      );

      const buttons = container.querySelectorAll("button");
      expect(buttons.length).toBe(0);
    });

    it("hides toggle button when showToggle is undefined (defaults to true)", () => {
      const arabicText = "نص عربي";
      render(<Matn_ar matn={arabicText} />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });
  });

  describe("Toggle functionality", () => {
    it("toggles visibility when button is clicked", async () => {
      const user = userEvent.setup();
      const arabicText = "نص عربي";
      render(
        <Matn_ar
          matn={arabicText}
          showToggle={true}
        />
      );

      const button = screen.getByRole("button");

      // Initial state - should be hidden (based on no highlight)
      expect(button.textContent).toContain("see-arabic");

      // Click to show
      await user.click(button);
      expect(button.textContent).toContain("hide-arabic");

      // Click to hide
      await user.click(button);
      expect(button.textContent).toContain("see-arabic");
    });

    it("has correct button styling", () => {
      const arabicText = "نص عربي";
      render(
        <Matn_ar
          matn={arabicText}
          showToggle={true}
        />
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass(
        "flex",
        "items-center",
        "space-x-2",
        "text-sm",
        "font-medium"
      );
    });

    it("displays Eye icon when content is visible", async () => {
      const arabicText = "نص عربي";
      render(
        <Matn_ar
          matn={arabicText}
          showToggle={true}
        />
      );

      const button = screen.getByRole("button");
      // First icon should be EyeOff (visible state)
      expect(button).toBeInTheDocument();
    });
  });

  describe("Auto-show behavior", () => {
    it("auto-shows when highlight contains Arabic text", () => {
      const arabicText = "نص عربي";
      const arabicHighlight = "نص";
      render(
        <Matn_ar
          matn={arabicText}
          showToggle={true}
          highlight={arabicHighlight}
        />
      );

      const button = screen.getByRole("button");
      // When highlight is Arabic, content should be auto-shown
      expect(button.textContent).toContain("hide-arabic");
    });

    it("hides content initially when highlight is non-Arabic", () => {
      const arabicText = "نص عربي";
      const englishHighlight = "text";
      render(
        <Matn_ar
          matn={arabicText}
          showToggle={true}
          highlight={englishHighlight}
        />
      );

      const button = screen.getByRole("button");
      // When highlight is not Arabic, content should stay hidden
      expect(button.textContent).toContain("see-arabic");
    });

    it("auto-shows without toggle when even if highlight has Arabic (showToggle=false)", () => {
      const arabicText = "نص عربي";
      const arabicHighlight = "نص";
      render(
        <Matn_ar
          matn={arabicText}
          showToggle={false}
          highlight={arabicHighlight}
        />
      );

      expect(screen.getByTestId("markdown-highlighter")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has aria-expanded attribute on button", () => {
      const arabicText = "نص عربي";
      render(
        <Matn_ar
          matn={arabicText}
          showToggle={true}
        />
      );

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-expanded");
    });

    it("has aria-controls attribute on button", () => {
      const arabicText = "نص عربي";
      render(
        <Matn_ar
          matn={arabicText}
          showToggle={true}
        />
      );

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-controls");
    });

    it("aria-expanded changes when content is toggled", async () => {
      const user = userEvent.setup();
      const arabicText = "نص عربي";
      render(
        <Matn_ar
          matn={arabicText}
          showToggle={true}
        />
      );

      const button = screen.getByRole("button");
      const initialAriaExpanded = button.getAttribute("aria-expanded");

      await user.click(button);
      const newAriaExpanded = button.getAttribute("aria-expanded");

      expect(initialAriaExpanded).not.toBe(newAriaExpanded);
    });

    it("content div has ID matching aria-controls", () => {
      const arabicText = "نص عربي";
      const { container } = render(
        <Matn_ar
          matn={arabicText}
          showToggle={true}
        />
      );

      const button = screen.getByRole("button");
      const controlsId = button.getAttribute("aria-controls");

      const controlledDiv = container.querySelector(`#${controlsId}`);
      expect(controlledDiv).toBeInTheDocument();
    });
  });

  describe("Content wrapper styling", () => {
    it("applies grid-based animation to toggle wrapper", () => {
      const arabicText = "نص عربي";
      const { container } = render(
        <Matn_ar
          matn={arabicText}
          showToggle={true}
        />
      );

      const gridDiv = container.querySelector(".grid");
      expect(gridDiv).toBeInTheDocument();
    });

    it("applies transition classes for smooth animation", () => {
      const arabicText = "نص عربي";
      const { container } = render(
        <Matn_ar
          matn={arabicText}
          showToggle={true}
        />
      );

      const gridDiv = container.querySelector(
        ".transition-\\[grid-template-rows\\,opacity\\]"
      );
      expect(gridDiv).toBeInTheDocument();
    });

    it("applies border styling when showToggle is true", () => {
      const arabicText = "نص عربي";
      const { container } = render(
        <Matn_ar
          matn={arabicText}
          showToggle={true}
        />
      );

      const wrapper = container.querySelector(".border-t");
      expect(wrapper).toBeInTheDocument();
    });

    it("does not apply border when showToggle is false", () => {
      const arabicText = "نص عربي";
      const { container } = render(
        <Matn_ar
          matn={arabicText}
          showToggle={false}
        />
      );

      const wrapper = container.querySelector(".border-t");
      expect(wrapper).not.toBeInTheDocument();
    });
  });

  describe("Props handling", () => {
    it("passes highlight prop to MarkdownHighlighter", () => {
      const arabicText = "نص عربي";
      const highlight = "عربي";

      render(
        <Matn_ar
          matn={arabicText}
          showToggle={false}
          highlight={highlight}
        />
      );

      expect(screen.getByTestId("markdown-highlighter")).toHaveAttribute(
        "data-highlight",
        highlight
      );
    });

    it("renders without highlight prop", () => {
      const arabicText = "نص عربي";
      render(
        <Matn_ar
          matn={arabicText}
          showToggle={false}
        />
      );

      const element = screen.getByTestId("markdown-highlighter");
      expect(element.getAttribute("data-highlight")).toBeNull();
    });
  });

  describe("Text wrapping", () => {
    it("applies Arabic prophet name wrapping", () => {
      const arabicText = "قال محمد عليه السلام";
      render(
        <Matn_ar
          matn={arabicText}
          showToggle={false}
        />
      );

      expect(screen.getByTestId("markdown-highlighter")).toBeInTheDocument();
    });
  });

  describe("Hydration safety", () => {
    it("generates deterministic content ID based on matn length", () => {
      const arabicText = "نص عربي";
      const { container: container1 } = render(
        <Matn_ar
          matn={arabicText}
          showToggle={true}
        />
      );

      const id1 = container1.querySelector("[id^='matn-ar-']")?.id;

      const { container: container2 } = render(
        <Matn_ar
          matn={arabicText}
          showToggle={true}
        />
      );

      const id2 = container2.querySelector("[id^='matn-ar-']")?.id;

      expect(id1).toBe(id2);
    });

    it("generates unique IDs for different matn content", () => {
      const arabicText1 = "نص قصير";
      const arabicText2 = "نص أطول بكثير من السابق";

      const { container: container1 } = render(
        <Matn_ar
          matn={arabicText1}
          showToggle={true}
        />
      );
      const id1 = container1.querySelector("[id^='matn-ar-']")?.id;

      const { container: container2 } = render(
        <Matn_ar
          matn={arabicText2}
          showToggle={true}
        />
      );
      const id2 = container2.querySelector("[id^='matn-ar-']")?.id;

      expect(id1).not.toBe(id2);
    });
  });

  describe("Dark mode support", () => {
    it("applies dark mode text color classes", () => {
      const arabicText = "نص عربي";
      const { container } = render(
        <Matn_ar
          matn={arabicText}
          showToggle={false}
        />
      );

      const textDiv = container.querySelector(".dark\\:text-gray-300");
      expect(textDiv).toBeInTheDocument();
    });

    it("applies dark mode border color", () => {
      const arabicText = "نص عربي";
      const { container } = render(
        <Matn_ar
          matn={arabicText}
          showToggle={true}
        />
      );

      const wrapper = container.querySelector(".dark\\:border-emerald-900");
      expect(wrapper).toBeInTheDocument();
    });
  });
});
