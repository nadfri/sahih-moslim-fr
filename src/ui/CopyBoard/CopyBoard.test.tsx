import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { mockHadith } from "@/src/utils/mocks/mockHadith";
import { CopyBoard } from "./CopyBoard";

// Mock minimal HadithType for test

describe("CopyBoard", () => {
  // Mock clipboard API
  const mockWriteText = vi.fn().mockImplementation(() => Promise.resolve());
  let originalLocation: PropertyDescriptor | undefined;

  beforeEach(() => {
    // Setup clipboard mock
    if (!navigator.clipboard) {
      Object.defineProperty(navigator, "clipboard", {
        value: { writeText: mockWriteText },
        configurable: true,
      });
    } else {
      vi.spyOn(navigator.clipboard, "writeText").mockImplementation(
        mockWriteText
      );
    }
    vi.clearAllMocks();
    // Store and mock window.location for link copy
    originalLocation = Object.getOwnPropertyDescriptor(window, "location");
    Object.defineProperty(window, "location", {
      value: {
        origin: "https://test.com",
        href: "https://test.com/some/path",
        pathname: "/some/path",
        assign: vi.fn(),
        reload: vi.fn(),
        replace: vi.fn(),
        toString: () => "https://test.com/some/path",
        ancestorOrigins: {} as DOMStringList,
        hash: "",
        host: "test.com",
        hostname: "test.com",
        port: "",
        protocol: "https:",
        search: "",
      } as Location,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // Restore original window.location
    if (originalLocation) {
      Object.defineProperty(window, "location", originalLocation);
    }
  });

  it("renders the copy button correctly", () => {
    render(<CopyBoard hadith={mockHadith} />);
    const button = screen.getByRole("button", {
      name: /copier le contenu du hadith/i,
    });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Copier");
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("displays dropdown menu when button is clicked", async () => {
    const user = userEvent.setup();
    render(<CopyBoard hadith={mockHadith} />);
    const button = screen.getByRole("button", {
      name: /copier le contenu du hadith/i,
    });
    await user.click(button);
    await waitFor(() => {
      expect(button).toHaveAttribute("aria-expanded", "true");
    });
    expect(screen.getByText("Français")).toBeInTheDocument();
    expect(screen.getByText("Arabe")).toBeInTheDocument();
    expect(screen.getByText("Les deux")).toBeInTheDocument();
    expect(screen.getByText("Le lien")).toBeInTheDocument(); // New option
  });

  it('copies French text when "Français" option is selected', async () => {
    const user = userEvent.setup();
    render(<CopyBoard hadith={mockHadith} />);
    const button = screen.getByRole("button", {
      name: /copier le contenu du hadith/i,
    });
    await user.click(button);
    const frenchOption = screen.getByText("Français");
    await user.click(frenchOption);
    await waitFor(() => {
      const expectedText = `Sahih Moslim - Hadith n°123\nChapitre: La Foi\nRapporté par: Abu Hurayra\n\nTexte en français`;
      expect(mockWriteText).toHaveBeenCalledWith(expectedText);
    });
  });

  it('copies Arabic text when "Arabe" option is selected', async () => {
    const user = userEvent.setup();
    render(<CopyBoard hadith={mockHadith} />);
    const button = screen.getByRole("button", {
      name: /copier le contenu du hadith/i,
    });
    await user.click(button);
    const arabicOption = screen.getByText("Arabe");
    await user.click(arabicOption);
    await waitFor(() => {
      const expectedText = `Sahih Moslim - Hadith n°123\nChapitre: La Foi\nRapporté par: Abu Hurayra\n\nنص عربي`;
      expect(mockWriteText).toHaveBeenCalledWith(expectedText);
    });
  });

  it('copies both texts when "Les deux" option is selected', async () => {
    const user = userEvent.setup();
    render(<CopyBoard hadith={mockHadith} />);
    const button = screen.getByRole("button", {
      name: /copier le contenu du hadith/i,
    });
    await user.click(button);
    const bothOption = screen.getByText("Les deux");
    await user.click(bothOption);
    await waitFor(() => {
      const expectedText = `Sahih Moslim - Hadith n°123\nChapitre: La Foi\nRapporté par: Abu Hurayra\n\nTexte en français\n\nنص عربي`;
      expect(mockWriteText).toHaveBeenCalledWith(expectedText);
    });
  });

  it('copies link when "Le lien" option is selected', async () => {
    const user = userEvent.setup();
    render(<CopyBoard hadith={mockHadith} />);
    const button = screen.getByRole("button", {
      name: /copier le contenu du hadith/i,
    });
    await user.click(button);
    const linkOption = screen.getByText("Le lien");

    await user.click(linkOption);
    await waitFor(() => {
      const expectedText = `https://test.com/hadiths/123`;
      expect(mockWriteText).toHaveBeenCalledWith(expectedText);
    });
  });

  it('shows "Copié!" text after successful copy and reverts after 1 second', async () => {
    const user = userEvent.setup();
    render(<CopyBoard hadith={mockHadith} />);
    const button = screen.getByRole("button", {
      name: /copier le contenu du hadith/i,
    });
    await user.click(button);
    const frenchOption = screen.getByText("Français");
    await user.click(frenchOption);
    expect(await screen.findByText("Copié!")).toBeInTheDocument();
    // Wait for revert (1s)
    await waitFor(
      () => {
        expect(screen.getByText("Copier")).toBeInTheDocument();
      },
      { timeout: 1500 }
    );
  });

  it("closes dropdown when clicking outside", async () => {
    const user = userEvent.setup();
    render(
      <div>
        {/* This div is used to simulate clicking outside the CopyBoard component */}
        <div data-testid="outside">Outside area</div>
        <CopyBoard hadith={mockHadith} />
      </div>
    );
    const button = screen.getByRole("button", {
      name: /copier le contenu du hadith/i,
    });
    await user.click(button);

    // Check if the dropdown is visible
    expect(await screen.findByText("Français")).toBeInTheDocument();

    // Click the outside area
    const outsideElement = screen.getByTestId("outside");
    await user.click(outsideElement);

    // Wait for the dropdown to disappear
    await waitFor(() => {
      expect(screen.queryByText("Français")).not.toBeInTheDocument();
    });
  });
});
