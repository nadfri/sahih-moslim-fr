// Vitest setup
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mocks
import { editItem } from "@/src/services/actions";
import type { ItemType, VariantType } from "@/src/types/types";
// Component to test
import { EditItemFormDialog } from "./EditItemFormDialog";

// Mock the actions module
vi.mock("@/src/services/actions", () => ({
  editItem: vi.fn(),
}));

// Mock react-toastify
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockEditItem = vi.mocked(editItem);
const mockToastSuccess = vi.mocked(toast.success);
const mockToastError = vi.mocked(toast.error);

const mockChapterItem: ItemType = {
  id: "chap1",
  name: "Chapitre Un",
  slug: "chapitre-un",
  index: 1,
  nameArabic: "الفصل الأول",
  hadithCount: 10,
};

const mockExistingChapters: ItemType[] = [
  mockChapterItem,
  {
    id: "chap2",
    name: "Chapitre Deux",
    slug: "chapitre-deux",
    index: 2,
    nameArabic: "الفصل الثاني",
    hadithCount: 5,
  },
  {
    id: "chap3",
    name: "Chapitre Trois",
    slug: "chapitre-trois",
    index: 3,
    nameArabic: "الفصل الثالث",
    hadithCount: 8,
  },
];

const mockNarratorItem: ItemType = {
  id: "nar1",
  name: "Narrateur Un",
  slug: "narrateur-un",
  nameArabic: "الراوي الأول",
  hadithCount: 20,
};

const mockExistingNarrators: ItemType[] = [
  mockNarratorItem,
  {
    id: "nar2",
    name: "Narrateur Deux",
    slug: "narrateur-deux",
    nameArabic: "الراوي الثاني",
    hadithCount: 15,
  },
];

const defaultProps = {
  open: true,
  onCancel: vi.fn(),
  item: mockChapterItem,
  items: mockExistingChapters,
  variant: "chapters" as VariantType,
};

describe("EditItemFormDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementation for editItem
    mockEditItem.mockResolvedValue({
      success: true,
      message: "Élément modifié avec succès",
      data: { ...mockChapterItem, name: "Nouveau Nom" }, // Simulate some change
    });
  });

  it("renders nothing if open is false", () => {
    render(
      <EditItemFormDialog
        {...defaultProps}
        open={false}
      />
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders the dialog with correct initial values for a chapter", () => {
    render(<EditItemFormDialog {...defaultProps} />);
    expect(
      screen.getByRole("dialog", { name: "Éditer le chapitre" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Index*")).toHaveValue(mockChapterItem.index);
    expect(screen.getByLabelText("Nom du chapitre*")).toHaveValue(
      mockChapterItem.name
    );
    expect(screen.getByLabelText("Nom en arabe (optionnel)")).toHaveValue(
      mockChapterItem.nameArabic
    );
    expect(
      screen.getByRole("button", { name: "Enregistrer" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Annuler" })).toBeInTheDocument();
  });

  it("calls onCancel when the Cancel button is clicked", async () => {
    render(<EditItemFormDialog {...defaultProps} />);
    await userEvent.click(screen.getByRole("button", { name: "Annuler" }));
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it("shows an error message if name is missing", async () => {
    render(<EditItemFormDialog {...defaultProps} />);
    const nameInput = screen.getByLabelText("Nom du chapitre*");
    const submitButton = screen.getByRole("button", { name: "Enregistrer" });

    await userEvent.clear(nameInput);
    await userEvent.click(submitButton);

    expect(mockEditItem).not.toHaveBeenCalled();
    expect(await screen.findByText("Au moins 3 lettres")).toBeInTheDocument(); // from getItemFormSchema
  });

  it("shows an error message if name is too short", async () => {
    render(<EditItemFormDialog {...defaultProps} />);
    const nameInput = screen.getByLabelText("Nom du chapitre*");
    const submitButton = screen.getByRole("button", { name: "Enregistrer" });

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "ab"); // Name with 2 characters
    await userEvent.click(submitButton);

    expect(mockEditItem).not.toHaveBeenCalled();
    expect(await screen.findByText("Au moins 3 lettres")).toBeInTheDocument();
  });

  it("shows an error message if index is missing for a chapter", async () => {
    render(<EditItemFormDialog {...defaultProps} />);
    const indexInput = screen.getByLabelText("Index*");
    const submitButton = screen.getByRole("button", { name: "Enregistrer" });

    await userEvent.clear(indexInput); // Clear the input
    await userEvent.click(submitButton);

    expect(mockEditItem).not.toHaveBeenCalled();
    expect(
      await screen.findByText("L'index doit être un nombre positif")
    ).toBeInTheDocument();
  });

  it("shows an error message if index is not a positive number for a chapter", async () => {
    render(<EditItemFormDialog {...defaultProps} />);
    const indexInput = screen.getByLabelText("Index*");
    const submitButton = screen.getByRole("button", { name: "Enregistrer" });

    await userEvent.clear(indexInput);
    await userEvent.type(indexInput, "0"); // Non-positive index
    await userEvent.click(submitButton);

    expect(mockEditItem).not.toHaveBeenCalled();
    expect(
      await screen.findByText("L'index doit être un nombre positif")
    ).toBeInTheDocument();

    await userEvent.clear(indexInput);
    await userEvent.type(indexInput, "-5"); // Negative index
    await userEvent.click(submitButton);

    expect(mockEditItem).not.toHaveBeenCalled();
    expect(
      await screen.findByText("L'index doit être un nombre positif")
    ).toBeInTheDocument();
  });

  it("shows an error if index already exists for a chapter (different from initial)", async () => {
    render(
      <EditItemFormDialog
        {...defaultProps}
        item={mockExistingChapters[0]}
        items={mockExistingChapters}
      />
    );
    const indexInput = screen.getByLabelText("Index*");
    const submitButton = screen.getByRole("button", { name: "Enregistrer" });

    await userEvent.clear(indexInput);
    await userEvent.type(indexInput, String(mockExistingChapters[1].index)); // Use index of chapter 2
    await userEvent.click(submitButton);

    expect(mockEditItem).not.toHaveBeenCalled();
    expect(
      await screen.findByText(
        "Cet index est déjà utilisé. Veuillez en choisir un autre."
      )
    ).toBeInTheDocument();
  });

  it("does not show index error if index is unchanged", async () => {
    render(
      <EditItemFormDialog
        {...defaultProps}
        item={mockExistingChapters[0]}
        items={mockExistingChapters}
      />
    );
    const nameInput = screen.getByLabelText("Nom du chapitre*"); // Make a valid change to another field
    const submitButton = screen.getByRole("button", { name: "Enregistrer" });

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Nouveau Nom Valide");
    await userEvent.click(submitButton); // Index is still mockExistingChapters[0].index (1)

    expect(mockEditItem).toHaveBeenCalled();
    expect(
      screen.queryByText(
        "Cet index est déjà utilisé. Veuillez en choisir un autre."
      )
    ).not.toBeInTheDocument();
  });

  it("submits the form with valid data, calls editItem and toast.success", async () => {
    render(<EditItemFormDialog {...defaultProps} />);
    const nameInput = screen.getByLabelText("Nom du chapitre*");
    const submitButton = screen.getByRole("button", { name: "Enregistrer" });

    const newName = "Chapitre Un Modifié";
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, newName);
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockEditItem).toHaveBeenCalledWith(defaultProps.variant, {
        id: mockChapterItem.id,
        name: newName,
        nameArabic: mockChapterItem.nameArabic, // Unchanged
        index: mockChapterItem.index, // Unchanged
      });
    });
    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith(
        "Élément modifié avec succès"
      );
    });
    await waitFor(() => {
      expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
    });
  });

  it("shows 'En cours...' on the button during submission", async () => {
    mockEditItem.mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({ success: true, message: "OK", data: mockChapterItem }),
            100
          )
        )
    );
    render(<EditItemFormDialog {...defaultProps} />);
    const nameInput = screen.getByLabelText("Nom du chapitre*");
    await userEvent.type(nameInput, "abc"); // Make a small valid change to enable submit

    const submitButton = screen.getByRole("button", { name: "Enregistrer" });
    userEvent.click(submitButton); // Don't await, check intermediate state

    expect(
      await screen.findByRole("button", { name: "En cours..." })
    ).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    await waitFor(() => expect(mockEditItem).toHaveBeenCalled()); // Ensure mock promise resolves
  });

  it("shows toast.error if editItem returns success:false", async () => {
    const errorMessage = "Erreur spécifique de l'action";
    mockEditItem.mockResolvedValueOnce({
      success: false,
      message: errorMessage,
    });
    render(<EditItemFormDialog {...defaultProps} />);
    const nameInput = screen.getByLabelText("Nom du chapitre*");
    const submitButton = screen.getByRole("button", { name: "Enregistrer" });

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Test Erreur Action");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(errorMessage);
    });
    expect(defaultProps.onCancel).not.toHaveBeenCalled(); // Should not close on action error
  });

  it("shows toast.error if editItem throws an exception", async () => {
    mockEditItem.mockRejectedValueOnce(new Error("Erreur critique"));
    render(<EditItemFormDialog {...defaultProps} />);
    const nameInput = screen.getByLabelText("Nom du chapitre*");
    const submitButton = screen.getByRole("button", { name: "Enregistrer" });

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Test Exception");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        "Erreur inconnue lors de la modification."
      );
    });
  });

  // Test for a different variant, e.g., narrators, where index might be optional
  describe("with variant='narrators'", () => {
    const narratorProps = {
      ...defaultProps,
      item: mockNarratorItem,
      items: mockExistingNarrators,
      variant: "narrators" as VariantType,
    };

    beforeEach(() => {
      mockEditItem.mockResolvedValue({
        // Reset mock for this describe block if needed
        success: true,
        message: "Narrateur modifié!",
        data: { ...mockNarratorItem, name: "Narrateur Modifié" },
      });
    });

    it("renders the dialog with correct initial values for a narrator", () => {
      render(<EditItemFormDialog {...narratorProps} />);
      expect(
        screen.getByRole("dialog", { name: "Éditer le narrateur" })
      ).toBeInTheDocument();
      expect(screen.queryByLabelText("Index*")).not.toBeInTheDocument(); // Index field should not be present for narrators
      expect(screen.getByLabelText("Nom du narrateur*")).toHaveValue(
        mockNarratorItem.name
      );
      expect(screen.getByLabelText("Nom en arabe (optionnel)")).toHaveValue(
        mockNarratorItem.nameArabic
      );
    });

    it("submits the form for a narrator (index optional)", async () => {
      render(<EditItemFormDialog {...narratorProps} />);
      const nameInput = screen.getByLabelText("Nom du narrateur*");
      const submitButton = screen.getByRole("button", { name: "Enregistrer" });

      const newName = "Narrateur Un Modifié";

      await userEvent.clear(nameInput);

      await userEvent.type(nameInput, newName);

      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockEditItem).toHaveBeenCalledWith(narratorProps.variant, {
          id: mockNarratorItem.id,
          name: newName,
          nameArabic: mockNarratorItem.nameArabic,
        });
      });
      expect(mockToastSuccess).toHaveBeenCalledWith("Narrateur modifié!");
      expect(narratorProps.onCancel).toHaveBeenCalledTimes(1);
    });
  });
});
