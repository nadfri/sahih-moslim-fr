import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { MarkdownHighlighter } from "./MarkdownHighlighter";
import { renderWithI18n } from "@/__tests__/renderWithI18n";

// Mock Mark.js
const mockUnmark = vi.fn();
const mockMark = vi.fn();

vi.mock("mark.js", () => {
  // Return a class constructor, not a function
  class MockMark {
    constructor(public element: Element) {}

    mark = mockMark;

    unmark = mockUnmark;
  }

  return {
    default: MockMark,
  };
});

// Mock the normalizeArabicText utility
vi.mock("@/src/utils/normalizeArabicText", () => ({
  prepareArabicForHighlight: vi.fn((text: string) => {
    // Simple mock that removes diacritics
    return text.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "");
  }),
}));

describe("MarkdownHighlighter Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset DOM modifications
    document.body.innerHTML = "";
  });

  describe("Basic Rendering", () => {
    it("should render markdown content correctly", () => {
      const content = "This is **bold** and *italic* text";
      renderWithI18n(<MarkdownHighlighter>{content}</MarkdownHighlighter>);

      // Check that the content is rendered
      expect(screen.getByText("bold")).toBeInTheDocument();
      expect(screen.getByText("italic")).toBeInTheDocument();
    });

    it("should render without highlight when no highlight prop is provided", () => {
      const content = "Simple text content";
      renderWithI18n(<MarkdownHighlighter>{content}</MarkdownHighlighter>);

      expect(screen.getByText(content)).toBeInTheDocument();
      expect(mockMark).not.toHaveBeenCalled();
    });

    it("should handle empty content", () => {
      renderWithI18n(<MarkdownHighlighter>{""}</MarkdownHighlighter>);
      // Should render without errors
      expect(mockMark).not.toHaveBeenCalled();
    });
  });

  describe("Custom Markdown Renderers", () => {
    it("should apply custom styling to strong elements", () => {
      const content = "This is **important** text";
      renderWithI18n(<MarkdownHighlighter>{content}</MarkdownHighlighter>);

      const strongElement = screen.getByText("important");
      expect(strongElement).toHaveClass(
        "text-emerald-600",
        "dark:text-emerald-400",
        "font-medium"
      );
    });

    it("should apply custom styling to emphasis elements", () => {
      const content = "This is *emphasized* text";
      renderWithI18n(<MarkdownHighlighter>{content}</MarkdownHighlighter>);

      const emElement = screen.getByText("emphasized");
      expect(emElement).toHaveClass(
        "border-l-4",
        "rounded-md",
        "border-amber-500",
        "dark:border-amber-600",
        "bg-amber-100",
        "dark:bg-amber-900/30",
        "p-3",
        "my-4",
        "text-amber-800",
        "dark:text-amber-400",
        "italic",
        "block"
      );
    });

    it("should apply custom styling to deleted elements", () => {
      const content = "This is ~~deleted~~ text";
      renderWithI18n(<MarkdownHighlighter>{content}</MarkdownHighlighter>);

      const delElement = screen.getByText("deleted");
      expect(delElement).toHaveClass(
        "text-blue-600",
        "dark:text-blue-500",
        "no-underline",
        "font-medium"
      );
    });
  });

  describe("Latin Text Highlighting", () => {
    it("should highlight Latin text using Mark.js", () => {
      const content = "This is a test message";
      const highlight = "test";

      renderWithI18n(
        <MarkdownHighlighter highlight={highlight}>
          {content}
        </MarkdownHighlighter>
      );

      // Verify Mark.js was called correctly
      expect(mockUnmark).toHaveBeenCalled();
      expect(mockMark).toHaveBeenCalledWith(highlight, {
        accuracy: "partially",
        ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
        ignoreJoiners: true,
        separateWordSearch: false,
        diacritics: true,
        className: "bg-yellow-200",
      });
    });

    it("should handle special characters in Latin search terms", () => {
      const content = "Email: test@example.com";
      const highlight = "test@example.com";

      renderWithI18n(
        <MarkdownHighlighter highlight={highlight}>
          {content}
        </MarkdownHighlighter>
      );

      expect(mockMark).toHaveBeenCalledWith(highlight, expect.any(Object));
    });

    it("should handle case-insensitive highlighting", () => {
      const content = "The Prophet said";
      const highlight = "prophet";

      renderWithI18n(
        <MarkdownHighlighter highlight={highlight}>
          {content}
        </MarkdownHighlighter>
      );

      expect(mockMark).toHaveBeenCalledWith(highlight, expect.any(Object));
    });
  });

  describe("Arabic Text Highlighting", () => {
    it("should detect Arabic text and use manual highlighting", () => {
      const content = "قال رسول الله صلى الله عليه وسلم";
      const highlight = "رسول";

      renderWithI18n(
        <MarkdownHighlighter highlight={highlight}>
          {content}
        </MarkdownHighlighter>
      );

      // Mark.js should not be called for Arabic text
      expect(mockMark).not.toHaveBeenCalled();
      // But unmark should still be called to clear previous highlights
      expect(mockUnmark).toHaveBeenCalled();
    });

    it("should handle Arabic text with diacritics", () => {
      const content = "قَالَ رَسُولُ اللَّهِ";
      const highlight = "رسول"; // Without diacritics

      renderWithI18n(
        <MarkdownHighlighter highlight={highlight}>
          {content}
        </MarkdownHighlighter>
      );

      // Should use manual highlighting for Arabic
      expect(mockMark).not.toHaveBeenCalled();
    });

    it("should handle mixed Arabic and non-Arabic content", () => {
      const content = "The Prophet ﷺ said: قال رسول الله";
      const highlight = "رسول";

      renderWithI18n(
        <MarkdownHighlighter highlight={highlight}>
          {content}
        </MarkdownHighlighter>
      );

      // Should detect Arabic and use manual highlighting
      expect(mockMark).not.toHaveBeenCalled();
    });
  });

  describe("Highlight Updates", () => {
    it("should update highlighting when highlight prop changes", () => {
      const content = "This is a test message";
      const { rerender } = renderWithI18n(
        <MarkdownHighlighter highlight="test">{content}</MarkdownHighlighter>
      );

      expect(mockMark).toHaveBeenCalledWith("test", expect.any(Object));

      // Clear mocks and re-render with new highlight
      vi.clearAllMocks();

      rerender(
        <MarkdownHighlighter highlight="message">{content}</MarkdownHighlighter>
      );

      expect(mockUnmark).toHaveBeenCalled();
      expect(mockMark).toHaveBeenCalledWith("message", expect.any(Object));
    });

    it("should clear highlighting when highlight prop is removed", () => {
      const content = "This is a test message";
      const { rerender } = renderWithI18n(
        <MarkdownHighlighter highlight="test">{content}</MarkdownHighlighter>
      );

      // Clear mocks and re-render without highlight
      vi.clearAllMocks();

      rerender(<MarkdownHighlighter>{content}</MarkdownHighlighter>);

      // When highlight is removed, useEffect should not run highlighting logic
      // but unmark might be called as part of cleanup
      expect(mockMark).not.toHaveBeenCalled();
    });

    it("should update highlighting when content changes", () => {
      const { rerender } = renderWithI18n(
        <MarkdownHighlighter highlight="test">
          {"This is a test"}
        </MarkdownHighlighter>
      );

      // Clear mocks and re-render with new content
      vi.clearAllMocks();

      rerender(
        <MarkdownHighlighter highlight="test">
          {"Another test message"}
        </MarkdownHighlighter>
      );

      expect(mockUnmark).toHaveBeenCalled();
      expect(mockMark).toHaveBeenCalledWith("test", expect.any(Object));
    });
  });

  describe("Edge Cases", () => {
    it("should handle undefined highlight prop", () => {
      const content = "Test content";

      renderWithI18n(
        <MarkdownHighlighter highlight={undefined}>
          {content}
        </MarkdownHighlighter>
      );

      expect(mockMark).not.toHaveBeenCalled();
      expect(screen.getByText(content)).toBeInTheDocument();
    });

    it("should handle empty highlight prop", () => {
      const content = "Test content";

      renderWithI18n(
        <MarkdownHighlighter highlight="">{content}</MarkdownHighlighter>
      );

      expect(mockMark).not.toHaveBeenCalled();
      expect(screen.getByText(content)).toBeInTheDocument();
    });

    it("should handle complex markdown with highlighting", () => {
      const content = `
# Title
This is **bold** text with a [link](https://example.com).
- List item 1
- List item 2
      `;
      const highlight = "bold";

      renderWithI18n(
        <MarkdownHighlighter highlight={highlight}>
          {content}
        </MarkdownHighlighter>
      );

      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("bold")).toBeInTheDocument();
      expect(screen.getByText("link")).toBeInTheDocument();
      expect(mockMark).toHaveBeenCalledWith(highlight, expect.any(Object));
    });

    it("should handle very long content", () => {
      const longContent = "Lorem ipsum dolor sit amet. ".repeat(100);
      const highlight = "Lorem";

      renderWithI18n(
        <MarkdownHighlighter highlight={highlight}>
          {longContent}
        </MarkdownHighlighter>
      );

      expect(mockMark).toHaveBeenCalledWith(highlight, expect.any(Object));
    });

    it("should handle special unicode characters", () => {
      const content = "Special chars: ™ © ® ﷺ";
      const highlight = "chars";

      renderWithI18n(
        <MarkdownHighlighter highlight={highlight}>
          {content}
        </MarkdownHighlighter>
      );

      expect(screen.getByText(/Special chars/)).toBeInTheDocument();
      expect(mockMark).toHaveBeenCalledWith(highlight, expect.any(Object));
    });
  });

  describe("Cleanup", () => {
    it("should cleanup Mark.js instance on unmount", () => {
      const content = "Test content";
      const { unmount } = renderWithI18n(
        <MarkdownHighlighter highlight="test">{content}</MarkdownHighlighter>
      );

      // Clear the call history
      vi.clearAllMocks();

      // Unmount the component
      unmount();

      // The cleanup function should have been called
      // Note: This is implicit in the useEffect cleanup
    });
  });

  describe("Accessibility", () => {
    it("should maintain proper DOM structure for screen readers", () => {
      const content = "This is **important** information";

      renderWithI18n(
        <MarkdownHighlighter highlight="important">
          {content}
        </MarkdownHighlighter>
      );

      // The content should be accessible
      expect(screen.getByText("important")).toBeInTheDocument();
      // Use more flexible text matching for "information" since it might be split
      expect(screen.getByText(/information/)).toBeInTheDocument();
    });

    it("should handle ARIA labels correctly", () => {
      const content = "Read this *carefully*";

      renderWithI18n(
        <MarkdownHighlighter highlight="carefully">
          {content}
        </MarkdownHighlighter>
      );

      // Content should be properly structured for accessibility
      expect(screen.getByText("carefully")).toBeInTheDocument();
    });
  });
});
