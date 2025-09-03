import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ImportConfirmModal } from "./ImportConfirmModal";
import { ItemType } from "@/src/types/types";

// Mock de react-toastify
const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
};

vi.mock("react-toastify", () => ({
  toast: mockToast,
}));

// Mock de fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock de useRouter
const mockRouter = {
  refresh: vi.fn(),
};

vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
}));

describe("ImportConfirmModal", () => {
  const mockProps = {
    selectedFile: new File(['{"test": "data"}'], "test.json", {
      type: "application/json",
    }),
    previewItems: [
      {
        id: "1",
        name: "Test Item",
        slug: "test-item",
        nameArabic: "عنصر اختبار",
        index: 1,
        hadithCount: 5,
      } as ItemType,
    ],
    selectedEndpoint: "chapters",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
        }),
    } as Response);
  });

  it("rend correctement avec les informations du fichier", () => {
    render(<ImportConfirmModal {...mockProps} />);

    expect(screen.getByText("Confirmer l'import")).toBeInTheDocument();
    expect(screen.getByText("Annuler")).toBeInTheDocument();
    expect(screen.getByText("Importer")).toBeInTheDocument();
  });

  it("affiche les informations du fichier et des éléments prévisualisés", () => {
    render(<ImportConfirmModal {...mockProps} />);

    expect(screen.getByText("test.json")).toBeInTheDocument();
    expect(screen.getByText("Test Item")).toBeInTheDocument();
    expect(screen.getByText("عنصر اختبار")).toBeInTheDocument();
  });

  it("gère l'import avec succès", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          imported: 10,
          failed: 0,
        }),
    } as Response);

    render(<ImportConfirmModal {...mockProps} />);

    const importButton = screen.getByText("Importer");
    fireEvent.click(importButton);

    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith(
        "Import réussi: 10 éléments importés, 0 échoués"
      );
    });
  });

  it("gère les erreurs d'import", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Import failed"));

    render(<ImportConfirmModal {...mockProps} />);

    const importButton = screen.getByText("Importer");
    fireEvent.click(importButton);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith("Erreur lors de l'import");
    });
  });

  it("gère les réponses d'erreur du serveur", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ error: "Invalid data" }),
    } as Response);

    render(<ImportConfirmModal {...mockProps} />);

    const importButton = screen.getByText("Importer");
    fireEvent.click(importButton);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith("Erreur lors de l'import");
    });
  });

  it("affiche un indicateur de chargement pendant l'import", async () => {
    mockFetch.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              ok: true,
              json: () => Promise.resolve({ success: true }),
            } as Response);
          }, 100);
        })
    );

    render(<ImportConfirmModal {...mockProps} />);

    const importButton = screen.getByText("Importer");
    fireEvent.click(importButton);

    // Vérifier que le bouton est désactivé pendant le chargement
    expect(importButton).toBeDisabled();

    await waitFor(() => {
      expect(importButton).not.toBeDisabled();
    });
  });

  it("désactive tous les boutons pendant l'import", async () => {
    mockFetch.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              ok: true,
              json: () => Promise.resolve({ success: true }),
            } as Response);
          }, 100);
        })
    );

    render(<ImportConfirmModal {...mockProps} />);

    const importButton = screen.getByText("Importer");
    const cancelButton = screen.getByText("Annuler");

    fireEvent.click(importButton);

    // Les deux boutons devraient être désactivés
    expect(importButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();

    await waitFor(() => {
      expect(importButton).not.toBeDisabled();
      expect(cancelButton).not.toBeDisabled();
    });
  });

  it("gère les imports avec des éléments échoués", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          imported: 8,
          failed: 2,
          failedItems: ["item1", "item2"],
        }),
    } as Response);

    render(<ImportConfirmModal {...mockProps} />);

    const importButton = screen.getByText("Importer");
    fireEvent.click(importButton);

    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith(
        "Import réussi: 8 éléments importés, 2 échoués"
      );
    });
  });

  it("envoie les bonnes données dans la requête", async () => {
    const formData = new FormData();
    formData.append("file", mockProps.selectedFile);

    render(<ImportConfirmModal {...mockProps} />);

    const importButton = screen.getByText("Importer");
    fireEvent.click(importButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        `/api/import/${mockProps.selectedEndpoint}`,
        {
          method: "POST",
          body: expect.any(FormData),
        }
      );
    });
  });
});
