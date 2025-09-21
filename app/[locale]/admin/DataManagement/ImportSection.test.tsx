import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ImportSection } from "./ImportSection";

// Mock for react-toastify created via factory so tests can import the
// mock functions reliably (ESM friendly).
type MockFn = ReturnType<typeof vi.fn>;
type MockToast = ((...args: unknown[]) => void) & {
  success: MockFn;
  error: MockFn;
};
let mockToast: MockToast;

vi.mock("react-toastify", () => {
  const success = vi.fn();
  const error = vi.fn();
  const toast = Object.assign(() => {}, { success, error });
  return {
    __esModule: true,
    toast,
    __mockToastSuccess: success,
    __mockToastError: error,
  };
});

describe("ImportSection", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    const mocked = await vi.importMock("react-toastify");
    mockToast = mocked.toast as MockToast;
  });

  it("rend correctement avec le titre et les boutons d'import", () => {
    render(<ImportSection />);

    expect(screen.getByText("Importer depuis JSON")).toBeInTheDocument();
    // there are multiple "Importer" buttons (one per import type)
    expect(screen.getAllByText("Importer").length).toBe(4);
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
    const fileInput = document.querySelectorAll(
      'input[type="file"]'
    )[0] as HTMLInputElement;
    const testFile = new File(["test content"], "test.json", {
      type: "application/json",
    });

    fireEvent.change(fileInput, { target: { files: [testFile] } });

    // Vérifier que l'input a bien reçu le fichier
    expect(fileInput.files?.[0]).toBe(testFile);
  });

  it("émet un événement personnalisé lors de la sélection d'un fichier valide", async () => {
    const dispatchSpy = vi.spyOn(window, "dispatchEvent");

    render(<ImportSection />);

    const fileInput = document.querySelectorAll(
      'input[type="file"]'
    )[0] as HTMLInputElement;
    const testFile = new File(['{"test": "data"}'], "test.json", {
      type: "application/json",
    });

    // Trigger change to emit the custom event
    fireEvent.change(fileInput, { target: { files: [testFile] } });

    // Vérifier qu'un événement personnalisé a été émis
    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "admin:import-file",
          detail: expect.objectContaining({
            file: testFile,
            endpoint: expect.any(String),
          }),
        })
      );
    });
  });

  it("gère les fichiers JSON invalides", () => {
    render(<ImportSection />);
    const fileInput = document.querySelectorAll(
      'input[type="file"]'
    )[0] as HTMLInputElement;
    const invalidFile = new File(["invalid content"], "test.txt", {
      type: "text/plain",
    });

    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    // Vérifier que toast.error a été appelé
    // FileReader or parsing may be async — wait for the toast call
    return waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(
        expect.stringContaining("Fichier JSON invalide")
      );
    });
  });

  it("appelle toast.success pour les fichiers valides", async () => {
    render(<ImportSection />);
    const fileInput = document.querySelectorAll(
      'input[type="file"]'
    )[0] as HTMLInputElement;
    const validFile = new File(['{"test": "data"}'], "test.json", {
      type: "application/json",
    });

    fireEvent.change(fileInput, { target: { files: [validFile] } });

    // Vérifier que toast.success a été appelé (FileReader parsing is async)
    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith(
        expect.stringContaining("Fichier prêt pour import")
      );
    });
  });

  it("utilise les bonnes endpoints pour chaque type d'import", async () => {
    const dispatchSpy = vi.spyOn(window, "dispatchEvent");

    render(<ImportSection />);

    const fileInputs = Array.from(
      document.querySelectorAll('input[type="file"]')
    ) as HTMLInputElement[];
    const testFile = new File(['{"test": "data"}'], "test.json", {
      type: "application/json",
    });

    // Tester chaque type d'import
    const endpoints = ["chapters", "sahabas", "transmitters", "hadiths"];

    for (let index = 0; index < fileInputs.length; index++) {
      const input = fileInputs[index];
      fireEvent.change(input, { target: { files: [testFile] } });
      await waitFor(() => {
        expect(dispatchSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "admin:import-file",
            detail: expect.objectContaining({
              endpoint: endpoints[index],
            }),
          })
        );
      });
    }
  });

  it("reset la valeur de l'input après la sélection", () => {
    render(<ImportSection />);
    const fileInput = document.querySelectorAll(
      'input[type="file"]'
    )[0] as HTMLInputElement;
    const testFile = new File(['{"test": "data"}'], "test.json", {
      type: "application/json",
    });

    // Simuler la sélection via change event (avoid redefining files property)
    fireEvent.change(fileInput, { target: { files: [testFile] } });

    // Vérifier que la valeur a été reset (comportement attendu)
    expect(fileInput.value).toBe("");
  });
});
