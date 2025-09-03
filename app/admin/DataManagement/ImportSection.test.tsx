import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ImportSection } from "./ImportSection";

// Mock de react-toastify
const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
};

vi.mock("react-toastify", () => ({
  toast: mockToast,
}));

describe("ImportSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rend correctement avec le titre et les boutons d'import", () => {
    render(<ImportSection />);

    expect(screen.getByText("Importer depuis JSON")).toBeInTheDocument();
    expect(screen.getByText("Importer")).toBeInTheDocument();
  });

  it("affiche tous les types d'import disponibles", () => {
    render(<ImportSection />);

    expect(screen.getByText("Chapitres")).toBeInTheDocument();
    expect(screen.getByText("Compagnons")).toBeInTheDocument();
    expect(screen.getByText("Transmetteurs")).toBeInTheDocument();
    expect(screen.getByText("Hadiths")).toBeInTheDocument();
  });

  it("gère la sélection de fichier", () => {
    render(<ImportSection />);

    const fileInput = screen.getAllByDisplayValue("")[0] as HTMLInputElement;
    const testFile = new File(["test content"], "test.json", {
      type: "application/json",
    });

    fireEvent.change(fileInput, { target: { files: [testFile] } });

    // Vérifier que l'input a bien reçu le fichier
    expect(fileInput.files?.[0]).toBe(testFile);
  });

  it("émet un événement personnalisé lors de la sélection d'un fichier valide", () => {
    const mockWindow = global.window as Window & {
      dispatchEvent: (event: Event) => void;
    };
    mockWindow.dispatchEvent = vi.fn();

    render(<ImportSection />);

    const fileInput = screen.getAllByDisplayValue("")[0] as HTMLInputElement;
    const testFile = new File(['{"test": "data"}'], "test.json", {
      type: "application/json",
    });

    fireEvent.change(fileInput, { target: { files: [testFile] } });

    // Vérifier qu'un événement personnalisé a été émis
    expect(mockWindow.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "admin:import-file",
        detail: expect.objectContaining({
          file: testFile,
          endpoint: expect.any(String),
        }),
      })
    );
  });

  it("gère les fichiers JSON invalides", () => {
    render(<ImportSection />);

    const fileInput = screen.getAllByDisplayValue("")[0] as HTMLInputElement;
    const invalidFile = new File(["invalid content"], "test.txt", {
      type: "text/plain",
    });

    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    // Vérifier que toast.error a été appelé
    expect(mockToast.error).toHaveBeenCalledWith("Fichier JSON invalide");
  });

  it("appelle toast.success pour les fichiers valides", () => {
    render(<ImportSection />);

    const fileInput = screen.getAllByDisplayValue("")[0] as HTMLInputElement;
    const validFile = new File(['{"test": "data"}'], "test.json", {
      type: "application/json",
    });

    fireEvent.change(fileInput, { target: { files: [validFile] } });

    // Vérifier que toast.success a été appelé
    expect(mockToast.success).toHaveBeenCalledWith(
      expect.stringContaining("Fichier prêt pour import")
    );
  });

  it("utilise les bonnes endpoints pour chaque type d'import", () => {
    const mockWindow = global.window as Window & {
      dispatchEvent: (event: Event) => void;
    };
    mockWindow.dispatchEvent = vi.fn();

    render(<ImportSection />);

    const fileInputs = screen.getAllByDisplayValue("") as HTMLInputElement[];
    const testFile = new File(['{"test": "data"}'], "test.json", {
      type: "application/json",
    });

    // Tester chaque type d'import
    const endpoints = ["chapters", "sahabas", "transmitters", "hadiths"];

    fileInputs.forEach((input, index) => {
      fireEvent.change(input, { target: { files: [testFile] } });

      expect(mockWindow.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "admin:import-file",
          detail: expect.objectContaining({
            endpoint: endpoints[index],
          }),
        })
      );
    });
  });

  it("reset la valeur de l'input après la sélection", () => {
    render(<ImportSection />);

    const fileInput = screen.getAllByDisplayValue("")[0] as HTMLInputElement;
    const testFile = new File(['{"test": "data"}'], "test.json", {
      type: "application/json",
    });

    // Simuler la sélection
    Object.defineProperty(fileInput, "files", {
      value: [testFile],
      writable: true,
    });
    fireEvent.change(fileInput, { target: { files: [testFile] } });

    // Vérifier que la valeur a été reset (comportement attendu)
    expect(fileInput.value).toBe("");
  });
});
