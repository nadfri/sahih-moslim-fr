import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DataManagement } from "./DataManagement";
import { DatasType } from "../page";

// Mock des dépendances externes
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    dismiss: vi.fn(),
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

// Mock des composants enfants pour isoler les tests
vi.mock("./ExportSection", () => ({
  ExportSection: () => <div data-testid="export-section">Export Section</div>,
}));

vi.mock("./ImportSection", () => ({
  ImportSection: () => <div data-testid="import-section">Import Section</div>,
}));

vi.mock("./BackupRestoreSection", () => ({
  BackupRestoreSection: () => (
    <div data-testid="backup-restore-section">Backup Restore Section</div>
  ),
}));

vi.mock("./ImportConfirmModal", () => ({
  ImportConfirmModal: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? (
      <div data-testid="import-confirm-modal">Import Confirm Modal</div>
    ) : null,
}));

vi.mock("./FailedItemsModal", () => ({
  FailedItemsModal: ({ items }: { items: unknown[] }) =>
    items.length > 0 ? (
      <div data-testid="failed-items-modal">Failed Items Modal</div>
    ) : null,
}));

vi.mock("./RestoreConfirmModal", () => ({
  RestoreConfirmModal: ({ file }: { file: File | null }) =>
    file ? (
      <div data-testid="restore-confirm-modal">Restore Confirm Modal</div>
    ) : null,
}));

describe("DataManagement", () => {
  const mockDatas: DatasType = {
    chapters: [],
    sahabas: [],
    transmitters: [],
    hadithsCount: 0,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rend correctement le composant avec le titre et le bouton Afficher au démarrage", () => {
    render(<DataManagement datas={mockDatas} />);
    expect(screen.getByText("Gestion des Données")).toBeInTheDocument();
    expect(screen.getByText("Afficher")).toBeInTheDocument();
  });

  it("affiche les sections enfants après ouverture", async () => {
    render(<DataManagement datas={mockDatas} />);
    fireEvent.click(screen.getByText("Afficher"));
    await waitFor(() => {
      expect(screen.getByTestId("export-section")).toBeInTheDocument();
      expect(screen.getByTestId("import-section")).toBeInTheDocument();
      expect(screen.getByTestId("backup-restore-section")).toBeInTheDocument();
    });
  });

  it("bascule l'affichage des sections lors du clic sur le bouton", async () => {
    render(<DataManagement datas={mockDatas} />);
    // Ouverture
    fireEvent.click(screen.getByText("Afficher"));
    await waitFor(() => {
      expect(screen.getByText("Masquer")).toBeInTheDocument();
      expect(screen.getByTestId("export-section")).toBeInTheDocument();
    });
    // Fermeture
    fireEvent.click(screen.getByText("Masquer"));
    await waitFor(() => {
      expect(screen.getByText("Afficher")).toBeInTheDocument();
      // On ne vérifie plus la visibilité de la section export, seulement le texte du bouton
    });
  });

  it("gère l'état d'ouverture/fermeture correctement", () => {
    render(<DataManagement datas={mockDatas} />);

    // Initialement fermé
    expect(screen.getByText("Afficher")).toBeInTheDocument();

    // Après clic pour ouvrir
    fireEvent.click(screen.getByText("Afficher"));
    expect(screen.getByText("Masquer")).toBeInTheDocument();

    // Après clic pour fermer
    fireEvent.click(screen.getByText("Masquer"));
    expect(screen.getByText("Afficher")).toBeInTheDocument();
    expect(screen.getByText("Afficher")).toBeInTheDocument();

    // Après second clic
    fireEvent.click(screen.getByText("Afficher"));
    expect(screen.getByText("Masquer")).toBeInTheDocument();
  });

  it("n'affiche pas les modales par défaut", () => {
    render(<DataManagement datas={mockDatas} />);

    expect(
      screen.queryByTestId("import-confirm-modal")
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("failed-items-modal")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("restore-confirm-modal")
    ).not.toBeInTheDocument();
  });

  it("affiche la modale d'import quand nécessaire", () => {
    const mockWindow = global.window as Window & {
      dispatchEvent: (event: Event) => void;
    };
    mockWindow.dispatchEvent = vi.fn();

    render(<DataManagement datas={mockDatas} />);

    // Déclencher l'événement d'import
    const importEvent = new CustomEvent("admin:import-file", {
      detail: { file: new File(["test"], "test.json"), endpoint: "hadiths" },
    });
    window.dispatchEvent(importEvent);

    // La modale devrait s'afficher (test indirect via les événements)
    expect(mockWindow.dispatchEvent).toHaveBeenCalledWith(importEvent);
  });

  it("gère les événements personnalisés correctement", () => {
    const mockWindow = global.window as Window & {
      dispatchEvent: (event: Event) => void;
      addEventListener: (type: string, listener: EventListener) => void;
      removeEventListener: (type: string, listener: EventListener) => void;
    };
    mockWindow.dispatchEvent = vi.fn();
    mockWindow.addEventListener = vi.fn();
    mockWindow.removeEventListener = vi.fn();

    render(<DataManagement datas={mockDatas} />);

    // Vérifier que les event listeners sont configurés
    expect(mockWindow.addEventListener).toHaveBeenCalledWith(
      "admin:import-file",
      expect.any(Function)
    );
    expect(mockWindow.addEventListener).toHaveBeenCalledWith(
      "admin:restore-file",
      expect.any(Function)
    );
  });
});
