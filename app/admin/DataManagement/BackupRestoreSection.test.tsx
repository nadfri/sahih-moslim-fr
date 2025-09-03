import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BackupRestoreSection } from "./BackupRestoreSection";

// Mock de react-toastify
const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
};

vi.mock("react-toastify", () => ({
  toast: mockToast,
}));

// Mock de fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("BackupRestoreSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    } as Response);
  });

  it("rend correctement avec les boutons de sauvegarde et restauration", () => {
    render(<BackupRestoreSection />);

    expect(screen.getByText("Sauvegarde & Restauration")).toBeInTheDocument();
    expect(screen.getByText("Créer une sauvegarde")).toBeInTheDocument();
    expect(
      screen.getByText("Restaurer depuis une sauvegarde")
    ).toBeInTheDocument();
  });

  it("affiche les informations de sauvegarde", () => {
    render(<BackupRestoreSection />);

    expect(
      screen.getByText("Sauvegarde automatique toutes les 24h")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Téléchargement manuel disponible")
    ).toBeInTheDocument();
  });

  it("gère la création de sauvegarde avec succès", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true, filename: "backup.sql" }),
    } as Response);

    render(<BackupRestoreSection />);

    const backupButton = screen.getByText("Créer une sauvegarde");
    fireEvent.click(backupButton);

    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith(
        expect.stringContaining("Sauvegarde créée")
      );
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/admin/backup", {
      method: "POST",
    });
  });

  it("gère les erreurs lors de la création de sauvegarde", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    render(<BackupRestoreSection />);

    const backupButton = screen.getByText("Créer une sauvegarde");
    fireEvent.click(backupButton);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(
        "Erreur lors de la création de la sauvegarde"
      );
    });
  });

  it("gère la restauration avec succès", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    } as Response);

    render(<BackupRestoreSection />);

    const restoreButton = screen.getByText("Restaurer depuis une sauvegarde");
    fireEvent.click(restoreButton);

    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith(
        "Restauration effectuée avec succès"
      );
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/admin/restore", {
      method: "POST",
    });
  });

  it("gère les erreurs lors de la restauration", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Restore failed"));

    render(<BackupRestoreSection />);

    const restoreButton = screen.getByText("Restaurer depuis une sauvegarde");
    fireEvent.click(restoreButton);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(
        "Erreur lors de la restauration"
      );
    });
  });

  it("affiche un indicateur de chargement pendant les opérations", async () => {
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

    render(<BackupRestoreSection />);

    const backupButton = screen.getByText("Créer une sauvegarde");
    fireEvent.click(backupButton);

    // Vérifier que le bouton est désactivé pendant le chargement
    expect(backupButton).toBeDisabled();

    await waitFor(() => {
      expect(backupButton).not.toBeDisabled();
    });
  });

  it("désactive les boutons pendant les opérations longues", async () => {
    mockFetch.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              ok: true,
              json: () => Promise.resolve({ success: true }),
            } as Response);
          }, 200);
        })
    );

    render(<BackupRestoreSection />);

    const backupButton = screen.getByText("Créer une sauvegarde");
    const restoreButton = screen.getByText("Restaurer depuis une sauvegarde");

    fireEvent.click(backupButton);

    // Les deux boutons devraient être désactivés pendant l'opération
    expect(backupButton).toBeDisabled();
    expect(restoreButton).toBeDisabled();

    await waitFor(() => {
      expect(backupButton).not.toBeDisabled();
      expect(restoreButton).not.toBeDisabled();
    });
  });

  it("gère les réponses d'erreur du serveur", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: "Server error" }),
    } as Response);

    render(<BackupRestoreSection />);

    const backupButton = screen.getByText("Créer une sauvegarde");
    fireEvent.click(backupButton);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(
        "Erreur lors de la création de la sauvegarde"
      );
    });
  });

  it("affiche les informations de statut de sauvegarde", () => {
    render(<BackupRestoreSection />);

    expect(screen.getByText("Dernière sauvegarde: Aucune")).toBeInTheDocument();
    expect(screen.getByText("Taille estimée: ~50MB")).toBeInTheDocument();
  });
});
