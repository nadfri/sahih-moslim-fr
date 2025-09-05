import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ImportConfirmModal } from "./ImportConfirmModal";
import { ItemType } from "@/src/types/types";

// Prepare holders for toast mocks (we'll populate them in beforeEach)
// Minimal typed mocks to satisfy the linter and allow assertions on
// toast.success / toast.error.
type MockFn = ReturnType<typeof vi.fn>;
type MockToast = ((...args: unknown[]) => void) & {
  success: MockFn;
  error: MockFn;
};
let mockToast: MockToast;

// Helper spy shape for accessing mock.calls without using `any`.
type Spy = { mock: { calls: unknown[][] } };

// Mock react-toastify with factory-exported mocks. We also expose the
// mock functions from the factory so tests can import them with vi.importMock.
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

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock useRouter
const mockRouter = { refresh: vi.fn() };
vi.mock("next/navigation", () => ({
  __esModule: true,
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
        name_fr: "Test Item",
        name_ar: "عنصر اختبار",
        name_en: null,
        slug: "test-item",
        index: 1,
        hadithCount: 5,
      } as ItemType,
    ],
    selectedEndpoint: "chapters",
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    // import the mocked module so we can access the mock toast object
    const mocked = await vi.importMock("react-toastify");
    mockToast = mocked.toast as MockToast;

    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    } as Response);
  });

  it("renders file and previewed items", () => {
    render(<ImportConfirmModal {...mockProps} />);
    expect(screen.getByText("test.json")).toBeInTheDocument();
    expect(
      screen.getByText(mockProps.previewItems[0].name_fr)
    ).toBeInTheDocument();
  });

  it("handles successful import", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true, imported: 10, failed: 0 }),
    } as Response);
    render(<ImportConfirmModal {...mockProps} />);
    const importButton = screen.getByText("Importer");
    fireEvent.click(importButton);
    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalled();
      // assert first argument contains the success text
      const firstArg = (mockToast.success as unknown as Spy).mock.calls[0][0];
      expect(String(firstArg)).toContain("Import réussi");
    });
  });

  it("handles import error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Import failed"));
    render(<ImportConfirmModal {...mockProps} />);
    const importButton = screen.getByText("Importer");
    fireEvent.click(importButton);
    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalled();
      const firstArg = (mockToast.error as unknown as Spy).mock.calls[0][0];
      expect(String(firstArg)).toContain("Erreur");
    });
  });

  it("handles server error response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ error: "Invalid data" }),
    } as Response);
    render(<ImportConfirmModal {...mockProps} />);
    const importButton = screen.getByText("Importer");
    fireEvent.click(importButton);
    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalled();
      const firstArg = (mockToast.error as unknown as Spy).mock.calls[0][0];
      expect(String(firstArg)).toContain("Erreur");
    });
  });

  it("shows loading indicator during import", async () => {
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
    expect(importButton).toBeDisabled();
    await waitFor(() => {
      expect(importButton).not.toBeDisabled();
    });
  });

  it("disables all buttons during import", async () => {
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
    expect(importButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
    await waitFor(() => {
      expect(importButton).not.toBeDisabled();
      expect(cancelButton).not.toBeDisabled();
    });
  });

  it("handles import with failed items", async () => {
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
      expect(mockToast.success).toHaveBeenCalled();
      const firstArg = (mockToast.success as unknown as Spy).mock.calls[0][0];
      expect(String(firstArg)).toContain("Import réussi");
    });
  });

  it("sends correct data in request", async () => {
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
