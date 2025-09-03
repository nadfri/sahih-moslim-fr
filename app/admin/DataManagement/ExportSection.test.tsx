import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ExportSection } from "./ExportSection";

// Mock de react-toastify
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
  },
}));

// Mock de fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("ExportSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(new Blob()),
      headers: new Headers(),
    });

    // Mock URL.createObjectURL et revokeObjectURL
    global.URL.createObjectURL = vi.fn(() => "mock-url");
    global.URL.revokeObjectURL = vi.fn();

    // Mock document methods
    document.body.appendChild = vi.fn();
    document.body.removeChild = vi.fn();
    document.createElement = vi.fn((tag: string) => {
      if (tag === "a") {
        return {
          href: "",
          download: "",
          click: vi.fn(),
        } as unknown as HTMLElement;
      }
      return {} as HTMLElement;
    });
  });

  it("rend correctement avec le titre et les boutons d'export", () => {
    render(<ExportSection />);

    expect(screen.getByText("Exporter en JSON")).toBeInTheDocument();
    expect(screen.getByText("Télécharger")).toBeInTheDocument();
  });

  it("affiche tous les types d'export disponibles", () => {
    render(<ExportSection />);

    expect(screen.getByText("Chapitres")).toBeInTheDocument();
    expect(screen.getByText("Compagnons")).toBeInTheDocument();
    expect(screen.getByText("Transmetteurs")).toBeInTheDocument();
    expect(screen.getByText("Hadiths")).toBeInTheDocument();
  });

  it("déclenche l'export quand on clique sur un bouton", async () => {
    render(<ExportSection />);

    const exportButton = screen.getAllByText("Télécharger")[0];
    fireEvent.click(exportButton);

    // Vérifier que fetch a été appelé
    expect(global.fetch).toHaveBeenCalledWith("/api/export/chapters");

    // Vérifier que l'élément a a été créé et cliqué
    expect(document.createElement).toHaveBeenCalledWith("a");
  });

  it("gère les erreurs d'export", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
    });

    render(<ExportSection />);

    const exportButton = screen.getAllByText("Télécharger")[0];
    fireEvent.click(exportButton);

    // Vérifier que fetch a été appelé malgré l'erreur
    expect(mockFetch).toHaveBeenCalledWith("/api/export/chapters");
  });

  it("appelle toast.success après un export réussi", async () => {
    const { toast } = await import("react-toastify");

    render(<ExportSection />);

    const exportButton = screen.getAllByText("Télécharger")[0];
    fireEvent.click(exportButton);

    expect(toast.success).toHaveBeenCalledWith("Export démarré");
  });

  it("utilise les bonnes URLs d'export pour chaque type", () => {
    render(<ExportSection />);

    const buttons = screen.getAllByText("Télécharger");

    // Simuler les clics pour vérifier les URLs
    fireEvent.click(buttons[0]); // Chapitres
    expect(global.fetch).toHaveBeenCalledWith("/api/export/chapters");

    fireEvent.click(buttons[1]); // Sahabas
    expect(global.fetch).toHaveBeenCalledWith("/api/export/sahabas");

    fireEvent.click(buttons[2]); // Transmetteurs
    expect(global.fetch).toHaveBeenCalledWith("/api/export/transmitters");

    fireEvent.click(buttons[3]); // Hadiths
    expect(global.fetch).toHaveBeenCalledWith("/api/export/hadiths");
  });
});
