import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CopyBoard } from "./CopyBoard";

// Mock minimal HadithType for test
const hadith = {
  id: "1",
  matn_fr: "Texte en français",
  matn_ar: "نص عربي",
  numero: 123,
  isnad: null,
  chapterId: "chapter-1",
  narratorId: "narrator-1",
  chapter: {
    id: "chapter-1",
    title: "La Foi",
    slug: "la-foi",
  },
  narrator: {
    id: "narrator-1",
    slug: "abu-hurayra",
    name: "Abu Hurayra",
    nameArabic: null,
  },
  mentionedSahabas: [],
};

describe("CopyBoard", () => {
  // Mock clipboard API
  const mockWriteText = vi.fn().mockImplementation(() => Promise.resolve());

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
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the copy button correctly", () => {
    render(<CopyBoard hadith={hadith} />);
    const button = screen.getByRole("button", {
      name: /copier le contenu du hadith/i,
    });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Copier");
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("displays dropdown menu when button is clicked", async () => {
    const user = userEvent.setup();
    render(<CopyBoard hadith={hadith} />);
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
    render(<CopyBoard hadith={hadith} />);
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
    render(<CopyBoard hadith={hadith} />);
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
    render(<CopyBoard hadith={hadith} />);
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
    render(<CopyBoard hadith={hadith} />);
    const button = screen.getByRole("button", {
      name: /copier le contenu du hadith/i,
    });
    await user.click(button);
    const linkOption = screen.getByText("Le lien");

    // Store original location descriptor
    const originalLocation = Object.getOwnPropertyDescriptor(
      window,
      "location"
    );

    // Mock window.location
    Object.defineProperty(window, "location", {
      value: {
        origin: "https://test.com",
        // Add other necessary properties from Location if needed by the component
        // For this test, 'origin' seems sufficient for constructing the URL
        href: "https://test.com/some/path", // Example, adjust if needed
        pathname: "/some/path", // Example, adjust if needed
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
      } as Location, // Cast to Location to satisfy TypeScript
      writable: true, // Make it writable if needed, though reassignment is handled by defineProperty
      configurable: true, // Allow redefining/deleting later
    });

    await user.click(linkOption);
    await waitFor(() => {
      const expectedText = `https://test.com/hadiths/123`;
      expect(mockWriteText).toHaveBeenCalledWith(expectedText);
    });

    // Restore original location
    if (originalLocation) {
      Object.defineProperty(window, "location", originalLocation);
    } else {
      // If originalLocation was undefined (shouldn't happen in standard envs)
      // delete window.location; // Or handle appropriately
    }
  });

  it('shows "Copié!" text after successful copy and reverts after 1 second', async () => {
    const user = userEvent.setup();
    render(<CopyBoard hadith={hadith} />);
    const button = screen.getByRole("button", {
      name: /copier le contenu du hadith/i,
    });
    await user.click(button);
    const frenchOption = screen.getByText("Français");
    await user.click(frenchOption);
    expect(await screen.findByText("Copié!")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("Copier")).toBeInTheDocument();
    });
  });

  it("closes dropdown when clicking outside", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <div data-testid="outside">Outside area</div>
        <CopyBoard hadith={hadith} />
      </div>
    );
    const button = screen.getByRole("button", {
      name: /copier le contenu du hadith/i,
    });
    await user.click(button);

    // Vérifier que le dropdown est visible
    expect(await screen.findByText("Français")).toBeInTheDocument();

    // Cliquer à l'extérieur
    const outsideElement = screen.getByTestId("outside");
    await user.click(outsideElement);

    // Attendre que le dropdown disparaisse
    await waitFor(() => {
      expect(screen.queryByText("Français")).not.toBeInTheDocument();
    });
  });
});
