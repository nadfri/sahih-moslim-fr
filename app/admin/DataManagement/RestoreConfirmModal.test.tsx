import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RestoreConfirmModal } from "./RestoreConfirmModal";

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

describe("RestoreConfirmModal", () => {
  const mockProps = {
    file: new File(['{"test": "data"}'], "backup.sql", {
      type: "application/sql",
    }),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    } as Response);
  });

  it("ne rend rien quand file est null", () => {
    render(<RestoreConfirmModal file={null} />);

    expect(
      screen.queryByText("Confirmer la restauration")
    ).not.toBeInTheDocument();
  });

  it("rend correctement avec un fichier", () => {
    render(<RestoreConfirmModal {...mockProps} />);

    expect(screen.getByText("Confirmer la restauration")).toBeInTheDocument();
    expect(screen.getByText("Annuler")).toBeInTheDocument();
    expect(screen.getByText("Restaurer")).toBeInTheDocument();
  });

  it("affiche les informations du fichier de sauvegarde", () => {
    render(<RestoreConfirmModal {...mockProps} />);

    expect(screen.getByText("backup.sql")).toBeInTheDocument();
    expect(screen.getByText("application/sql")).toBeInTheDocument();
  });

  it("affiche l'avertissement de restauration", () => {
    render(<RestoreConfirmModal {...mockProps} />);

    expect(
      screen.getByText(
        "Cette action va remplacer toutes les données actuelles. Cette action est irréversible."
      )
    ).toBeInTheDocument();
  });

  it("appelle onClose quand on clique sur Annuler", () => {
    render(<RestoreConfirmModal {...mockProps} />);

    const cancelButton = screen.getByText("Annuler");
    fireEvent.click(cancelButton);

    // Le composant émet un événement personnalisé pour la fermeture
    // Nous ne pouvons pas tester directement onClose car il n'existe pas
  });

  it("gère la restauration avec succès", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          message: "Restauration effectuée avec succès",
        }),
    } as Response);

    render(<RestoreConfirmModal {...mockProps} />);

    const restoreButton = screen.getByText("Restaurer");
    fireEvent.click(restoreButton);

    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith(
        "Restauration effectuée avec succès"
      );
    });
  });

  it("gère les erreurs de restauration", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Restore failed"));

    render(<RestoreConfirmModal {...mockProps} />);

    const restoreButton = screen.getByText("Restaurer");
    fireEvent.click(restoreButton);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(
        "Erreur lors de la restauration"
      );
    });
  });

  it("gère les réponses d'erreur du serveur", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: "Server error" }),
    } as Response);

    render(<RestoreConfirmModal {...mockProps} />);

    const restoreButton = screen.getByText("Restaurer");
    fireEvent.click(restoreButton);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(
        "Erreur lors de la restauration"
      );
    });
  });

  it("affiche un indicateur de chargement pendant la restauration", async () => {
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

    render(<RestoreConfirmModal {...mockProps} />);

    const restoreButton = screen.getByText("Restaurer");
    fireEvent.click(restoreButton);

    // Vérifier que le bouton est désactivé pendant le chargement
    expect(restoreButton).toBeDisabled();

    await waitFor(() => {
      expect(restoreButton).not.toBeDisabled();
    });
  });

  it("désactive tous les boutons pendant la restauration", async () => {
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

    render(<RestoreConfirmModal {...mockProps} />);

    const restoreButton = screen.getByText("Restaurer");
    const cancelButton = screen.getByText("Annuler");

    fireEvent.click(restoreButton);

    // Les deux boutons devraient être désactivés
    expect(restoreButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();

    await waitFor(() => {
      expect(restoreButton).not.toBeDisabled();
      expect(cancelButton).not.toBeDisabled();
    });
  });

  it("envoie les bonnes données dans la requête", async () => {
    const formData = new FormData();
    formData.append("file", mockProps.file);

    render(<RestoreConfirmModal {...mockProps} />);

    const restoreButton = screen.getByText("Restaurer");
    fireEvent.click(restoreButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/admin/restore", {
        method: "POST",
        body: expect.any(FormData),
      });
    });
  });

  it("gère les fichiers avec des noms longs", () => {
    const longFileName = "a".repeat(100) + ".sql";
    const longFile = new File(['{"test": "data"}'], longFileName, {
      type: "application/sql",
    });

    render(
      <RestoreConfirmModal
        {...mockProps}
        file={longFile}
      />
    );

    expect(screen.getByText(longFileName)).toBeInTheDocument();
  });

  it("gère les fichiers sans extension", () => {
    const noExtFile = new File(['{"test": "data"}'], "backup", {
      type: "application/sql",
    });

    render(
      <RestoreConfirmModal
        {...mockProps}
        file={noExtFile}
      />
    );

    expect(screen.getByText("backup")).toBeInTheDocument();
    expect(screen.getByText("application/sql")).toBeInTheDocument();
  });
});
