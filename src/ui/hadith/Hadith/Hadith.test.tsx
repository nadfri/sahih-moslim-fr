import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { HadithType } from "@/src/types/types";
import { mockHadith } from "@/src/utils/mocks/mockHadith";
import { Hadith } from "./Hadith";

// Mock the environment variables
vi.mock("next/link", () => ({
  __esModule: true,
  default: ({
    href,
    className,
    children,
  }: {
    href: string;
    className?: string;
    children: React.ReactNode;
  }) => (
    <a
      href={href}
      className={className}
      data-testid="mock-link"
    >
      {children}
    </a>
  ),
}));

// Mock the CopyBoard component - Keep the mock simple or as needed
vi.mock("@/src/ui/CopyBoard/CopyBoard", () => ({
  // We need a named export 'CopyBoard' that is a mock function
  CopyBoard: vi.fn(() => <div data-testid="copy-board">Mock CopyBoard</div>),
}));

describe("Hadith", () => {
  // Sample hadith data for testing with all required properties

  // Set NODE_ENV to development for testing the edit link
  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "development");
    // Clear mock calls before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("renders the hadith basic information correctly", () => {
    render(<Hadith hadith={mockHadith} />);

    // Check chapter title
    expect(screen.getByText("Test Chapter")).toBeInTheDocument();

    // Check hadith number
    expect(screen.getByText("123")).toBeInTheDocument();

    // Check narrator
    expect(screen.getByText("Abu Test")).toBeInTheDocument();

    // Check hadith text (with markdown rendered)
    expect(
      screen.getByText("Ceci est un", { exact: false })
    ).toBeInTheDocument();

    // Check sahabas
    expect(screen.getByText("Sahaba Test 1")).toBeInTheDocument();
    expect(screen.getByText("Sahaba Test 2")).toBeInTheDocument();
  });

  it("toggles Arabic text visibility when button is clicked", async () => {
    const user = userEvent.setup();
    render(<Hadith hadith={mockHadith} />);

    // Initially, Arabic should be hidden
    const arabicContent = screen.getByText("هذا اختبار للحديث باللغة العربية");
    expect(arabicContent.parentElement?.parentElement?.className).toContain(
      "grid-rows-[0fr]"
    );

    // Click the toggle button
    const toggleButton = screen.getByText("Voir la version arabe", {
      exact: false,
    });
    await user.click(toggleButton);

    // Now Arabic should be visible
    expect(arabicContent.parentElement?.parentElement?.className).toContain(
      "grid-rows-[1fr]"
    );

    // Text should change
    expect(screen.getByText("Masquer la version arabe")).toBeInTheDocument();

    // Click again to hide
    await user.click(toggleButton);

    // Arabic should be hidden again
    expect(arabicContent.parentElement?.parentElement?.className).toContain(
      "grid-rows-[0fr]"
    );
  });

  it("highlights text when highlight prop is provided", () => {
    render(
      <Hadith
        hadith={mockHadith}
        highlight="test"
      />
    );

    // The highlighted text should be wrapped in <mark> tags
    const marks = document.querySelectorAll("mark");
    expect(marks.length).toBeGreaterThan(0);

    // Check if one of the sahaba links contains a highlighted text
    // Use getAllByTestId instead of getByText to avoid ambiguity
    const sahabaLinks = screen.getAllByTestId("mock-link");
    const hasSahabaWithHighlight = sahabaLinks.some(
      (link) =>
        link.textContent?.includes("Sahaba") && link.innerHTML.includes("<mark")
    );
    expect(hasSahabaWithHighlight).toBe(true);
  });

  it("shows preview badge in update mode", () => {
    render(
      <Hadith
        hadith={mockHadith}
        update={true}
      />
    );

    // Check for preview badge
    expect(screen.getByText("Aperçu")).toBeInTheDocument();
  });

  it("shows edit link in development mode", () => {
    render(<Hadith hadith={mockHadith} />);

    // Edit link should be visible
    expect(screen.getByText("Éditer")).toBeInTheDocument();

    // The href should be correct
    const editLinks = screen.getAllByTestId("mock-link");
    const editLink = Array.from(editLinks).find((link) =>
      link.textContent?.includes("Éditer")
    );
    expect(editLink?.getAttribute("href")).toBe("/hadiths/123/edit");
  });

  it("doesn't show edit link in production mode", () => {
    // Override NODE_ENV to production
    vi.stubEnv("NODE_ENV", "production");

    render(<Hadith hadith={mockHadith} />);

    // Edit link should not be visible
    expect(screen.queryByText("Éditer")).not.toBeInTheDocument();
  });

  it("renders custom markdown styling correctly", () => {
    const hadithWithMarkdown: HadithType = {
      ...mockHadith,
      matn_fr: "Normal text with **bold text** and *italic block quote*",
    };

    render(<Hadith hadith={hadithWithMarkdown} />);

    // Check strong tag styling
    const strongElement = screen.getByText("bold text");
    expect(strongElement.className).toContain("text-emerald-600");

    // Check em tag styling
    const emElement = screen.getByText("italic block quote");
    expect(emElement.className).toContain("border-amber-500");
  });

  it("renders the report button", async () => {
    const user = userEvent.setup();
    render(<Hadith hadith={mockHadith} />);

    const reportButton = screen.getByText("Signaler");
    expect(reportButton).toBeInTheDocument();

    // We can't fully test the onClick functionality since it's not implemented yet,
    // but we can test that the button is clickable
    await user.click(reportButton);
  });
});
