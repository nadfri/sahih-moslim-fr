import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDataManagementEvents } from "./useDataManagementEvents";

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

// Mock de useRouter
const mockRouter = {
  refresh: vi.fn(),
  push: vi.fn(),
};

vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
}));

describe("useDataManagementEvents", () => {
  const mockHandlers = {
    onImportFile: vi.fn(),
    onRestoreFile: vi.fn(),
    onImportDone: vi.fn(),
    onImportFailed: vi.fn(),
    onCloseImportModal: vi.fn(),
    onRestoreDone: vi.fn(),
    onRestoreFailed: vi.fn(),
    onCloseRestoreModal: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    } as Response);
  });

  it("gère l'événement admin:import-file", () => {
    renderHook(() => useDataManagementEvents(mockHandlers));

    const testFile = new File(['{"test": "data"}'], "test.json", {
      type: "application/json",
    });

    act(() => {
      window.dispatchEvent(
        new CustomEvent("admin:import-file", {
          detail: {
            file: testFile,
            endpoint: "chapters",
          },
        })
      );
    });

    expect(mockHandlers.onImportFile).toHaveBeenCalledWith(
      testFile,
      "chapters"
    );
  });

  it("gère l'événement admin:close-import-modal", () => {
    renderHook(() => useDataManagementEvents(mockHandlers));

    act(() => {
      window.dispatchEvent(new CustomEvent("admin:close-import-modal"));
    });

    // Vérifier que le handler a été appelé
    expect(mockHandlers.onCloseImportModal).toHaveBeenCalled();
  });

  it("gère l'événement admin:import-done", async () => {
    renderHook(() => useDataManagementEvents(mockHandlers));

    act(() => {
      window.dispatchEvent(new CustomEvent("admin:import-done"));
    });

    // Attendre que l'effet se termine
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(mockHandlers.onImportDone).toHaveBeenCalled();
    expect(mockRouter.refresh).toHaveBeenCalled();
  });

  it("gère l'événement admin:restore-done avec succès", async () => {
    renderHook(() => useDataManagementEvents(mockHandlers));

    act(() => {
      window.dispatchEvent(new CustomEvent("admin:restore-done"));
    });

    // Attendre que l'effet se termine
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(mockHandlers.onRestoreDone).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledWith("/");
  });

  it("gère l'événement admin:restore-failed", async () => {
    renderHook(() => useDataManagementEvents(mockHandlers));

    act(() => {
      window.dispatchEvent(new CustomEvent("admin:restore-failed"));
    });

    // Attendre que l'effet se termine
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(mockHandlers.onRestoreFailed).toHaveBeenCalled();
  });

  it("gère l'événement admin:import-failed-items", async () => {
    const failedItems = [
      { item: { name: "Chapitre 1" }, reason: "Données invalides" },
      { item: { name: "Chapitre 2" }, reason: "Doublon détecté" },
    ];

    renderHook(() => useDataManagementEvents(mockHandlers));

    act(() => {
      window.dispatchEvent(
        new CustomEvent("admin:import-failed-items", {
          detail: { failed: failedItems },
        })
      );
    });

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(mockHandlers.onImportFailed).toHaveBeenCalledWith(failedItems);
  });

  it("gère les événements inconnus sans erreur", () => {
    renderHook(() => useDataManagementEvents(mockHandlers));

    act(() => {
      window.dispatchEvent(new CustomEvent("unknown:event"));
    });

    // Aucun handler ne devrait être appelé
    expect(mockHandlers.onImportFile).not.toHaveBeenCalled();
    expect(mockHandlers.onCloseImportModal).not.toHaveBeenCalled();
  });

  it("nettoie les event listeners au démontage", () => {
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useDataManagementEvents(mockHandlers));

    expect(addEventListenerSpy).toHaveBeenCalled();

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalled();
  });
});
