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

  it("ne rend rien si open est false", () => {
    render(
      <EditItemFormDialog
        {...defaultProps}
        open={false}
      />
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("rend le dialogue avec les valeurs initiales correctes pour un chapitre", () => {
    render(<EditItemFormDialog {...defaultProps} />);
    expect(
      screen.getByRole("dialog", { name: "Éditer le chapitre" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Index*")).toHaveValue(mockChapterItem.index);
    expect(screen.getByLabelText("Nom du chapitre*")).toHaveValue(
      mockChapterItem.name
    );
    expect(screen.getByLabelText("Nom arabe (optionnel)")).toHaveValue(
      mockChapterItem.nameArabic
    );
    expect(
      screen.getByRole("button", { name: "Enregistrer" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Annuler" })).toBeInTheDocument();
  });

  it("appelle onCancel lorsque le bouton Annuler est cliqué", async () => {
    render(<EditItemFormDialog {...defaultProps} />);
    await userEvent.click(screen.getByRole("button", { name: "Annuler" }));
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it("affiche un message d'erreur si le nom est manquant", async () => {
    render(<EditItemFormDialog {...defaultProps} />);
    const nameInput = screen.getByLabelText("Nom du chapitre*");
    const submitButton = screen.getByRole("button", { name: "Enregistrer" });

    await userEvent.clear(nameInput);
    await userEvent.click(submitButton);

    expect(mockEditItem).not.toHaveBeenCalled();
    expect(await screen.findByText("Au moins 3 lettres")).toBeInTheDocument(); // from getItemFormSchema
  });

  it("affiche un message d'erreur si l'index est manquant pour un chapitre", async () => {
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

  it("affiche un message d'erreur si l'index existe déjà pour un chapitre (différent de l'initial)", async () => {
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

  it("ne montre pas d'erreur d'index si l'index est inchangé", async () => {
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

  it("soumet le formulaire avec des données valides, appelle editItem et toast.success", async () => {
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

  it("affiche 'En cours...' sur le bouton pendant la soumission", async () => {
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

  it("affiche toast.error si editItem lève une exception", async () => {
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
    expect(defaultProps.onCancel).not.toHaveBeenCalled();
  });

  // Test for a different variant, e.g., narrators, where index might be optional
  describe("avec variant='narrators'", () => {
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

    it("rend le dialogue avec les valeurs initiales correctes pour un narrateur", () => {
      render(<EditItemFormDialog {...narratorProps} />);
      expect(
        screen.getByRole("dialog", { name: "Éditer le chapitre" })
      ).toBeInTheDocument(); // Title is static
      // Index field is present, but its value might be null/undefined if narrator.index is not set
      // For mockNarratorItem, index is undefined. Input type number with undefined value is empty.
      // However, react-hook-form defaultValues will set it. If item.index is undefined, it will be undefined.
      // The input will show empty. Let's assume it should be empty if undefined.
      // The schema for narrators makes index optional (z.number().optional().nullable())
      // The <Input register={register("index")} /> will register it.
      // If mockNarratorItem.index is undefined, the input field will be empty.
      // Let's ensure mockNarratorItem has an index or test the empty case.
      // Our mockNarratorItem does not have an 'index' field.
      // So defaultValues: item will mean formState.defaultValues.index is undefined.
      // The input field for number will be empty.
      expect(screen.getByLabelText("Index*")).toHaveValue(null); // Empty number input
      expect(screen.getByLabelText("Nom du chapitre*")).toHaveValue(
        mockNarratorItem.name
      ); // Label is static
      expect(screen.getByLabelText("Nom arabe (optionnel)")).toHaveValue(
        mockNarratorItem.nameArabic
      );
    });

    it("soumet le formulaire pour un narrateur (index optionnel)", async () => {
      render(<EditItemFormDialog {...narratorProps} />);
      const nameInput = screen.getByLabelText("Nom du chapitre*"); // Static label
      const indexInput = screen.getByLabelText("Index*");
      const submitButton = screen.getByRole("button", { name: "Enregistrer" });

      const newName = "Narrateur Un Modifié";
      await userEvent.clear(nameInput);
      await userEvent.type(nameInput, newName);

      // For narrators, index is optional. We can leave it empty or set it.
      // If we leave it empty, it should submit as undefined or null.
      // The schema getItemFormSchema for non-chapters: z.number().optional().nullable()
      // An empty number input, when coerced by Zod, might become undefined or null if empty.
      // If we clear it:
      await userEvent.clear(indexInput);
      // Let's also test setting it
      // await userEvent.type(indexInput, "123");

      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockEditItem).toHaveBeenCalledWith(narratorProps.variant, {
          id: mockNarratorItem.id,
          name: newName,
          nameArabic: mockNarratorItem.nameArabic,
          index: null, // z.coerce.number on empty string can be null if schema allows .nullable()
          // or undefined if .optional() and it's not provided/empty.
          // Given schema is .optional().nullable(), empty string from clear() -> coerce -> null
        });
      });
      expect(mockToastSuccess).toHaveBeenCalledWith("Narrateur modifié!");
      expect(narratorProps.onCancel).toHaveBeenCalledTimes(1);
    });
  });
});
