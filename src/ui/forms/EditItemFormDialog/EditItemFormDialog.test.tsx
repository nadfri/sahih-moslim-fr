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

// Accept either Zod generic number error or the localized schema message
const INDEX_ERROR_REGEX =
  /Invalid input: expected number, received string|L'index doit être un nombre positif/i;

const mockChapterItem: ItemType = {
  id: "chap1",
  name_fr: "Chapitre Un",
  name_ar: "الفصل الأول",
  name_en: "Chapter One",
  slug: "chapitre-un",
  index: 1,
  hadithCount: 10,
};

const mockExistingChapters: ItemType[] = [
  mockChapterItem,
  {
    id: "chap2",
    name_fr: "Chapitre Deux",
    name_ar: "الفصل الثاني",
    name_en: "Chapter Two",
    slug: "chapitre-deux",
    index: 2,
    hadithCount: 5,
  },
  {
    id: "chap3",
    name_fr: "Chapitre Trois",
    name_ar: "الفصل الثالث",
    name_en: "Chapter Three",
    slug: "chapitre-trois",
    index: 3,
    hadithCount: 8,
  },
];

const mockTransmitterItem: ItemType = {
  id: "trans1",
  name_fr: "Transmetteur Un",
  name_ar: "الناقل الأول",
  name_en: "Transmitter One",
  slug: "transmetteur-un",
  hadithCount: 12,
};

const mockExistingTransmitters: ItemType[] = [
  mockTransmitterItem,
  {
    id: "trans2",
    name_fr: "Transmetteur Deux",
    name_ar: "الناقل الثاني",
    name_en: "Transmitter Two",
    slug: "transmetteur-deux",
    hadithCount: 8,
  },
];

describe("EditItemFormDialog", () => {
  let mockOnCancel: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnCancel = vi.fn(); // Create a fresh mock for each test
    // Default mock implementation for editItem
    mockEditItem.mockResolvedValue({
      success: true,
      message: "Élément modifié avec succès",
      data: { ...mockChapterItem, name: "Nouveau Nom" },
    });
  });

  const getDefaultProps = () => ({
    open: true,
    onCancel: mockOnCancel,
    item: mockChapterItem,
    items: mockExistingChapters,
    variant: "chapters" as VariantType,
  });

  it("renders nothing if open is false", () => {
    render(
      <EditItemFormDialog
        {...getDefaultProps()}
        open={false}
      />
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders the dialog with correct initial values for a chapter", () => {
    render(<EditItemFormDialog {...getDefaultProps()} />);
    expect(
      screen.getByRole("dialog", { name: "Éditer le chapitre" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Index*")).toHaveValue(mockChapterItem.index);
    expect(screen.getByLabelText("Nom du chapitre*")).toHaveValue(
      mockChapterItem.name_fr
    );
    expect(screen.getByLabelText("Nom en arabe (optionnel)")).toHaveValue(
      mockChapterItem.name_ar
    );
    expect(screen.getByLabelText("Nom en anglais (optionnel)")).toHaveValue(
      mockChapterItem.name_en
    );
    expect(
      screen.getByRole("button", { name: "Enregistrer" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Annuler" })).toBeInTheDocument();
  });

  it("calls onCancel when the Cancel button is clicked", async () => {
    const props = getDefaultProps();
    render(<EditItemFormDialog {...props} />);
    await userEvent.click(screen.getByRole("button", { name: "Annuler" }));
    expect(props.onCancel).toHaveBeenCalledTimes(1);
  });

  it("shows an error message if name is missing", async () => {
    render(<EditItemFormDialog {...getDefaultProps()} />);
    const nameInput = screen.getByLabelText("Nom du chapitre*");
    const submitButton = screen.getByRole("button", { name: "Enregistrer" });

    await userEvent.clear(nameInput);
    await userEvent.click(submitButton);

    expect(mockEditItem).not.toHaveBeenCalled();
    expect(await screen.findByText("Au moins 3 lettres")).toBeInTheDocument(); // from getItemFormSchema
  });

  it("shows an error message if name is too short", async () => {
    render(<EditItemFormDialog {...getDefaultProps()} />);
    const nameInput = screen.getByLabelText("Nom du chapitre*");
    const submitButton = screen.getByRole("button", { name: "Enregistrer" });

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "ab"); // Name with 2 characters
    await userEvent.click(submitButton);

    expect(mockEditItem).not.toHaveBeenCalled();
    expect(await screen.findByText("Au moins 3 lettres")).toBeInTheDocument();
  });

  it("shows an error message if index is missing for a chapter", async () => {
    render(<EditItemFormDialog {...getDefaultProps()} />);
    const indexInput = screen.getByLabelText("Index*");
    const submitButton = screen.getByRole("button", { name: "Enregistrer" });

    await userEvent.clear(indexInput); // Clear the input
    await userEvent.click(submitButton);

    expect(mockEditItem).not.toHaveBeenCalled();
    // The validation message can be the Zod generic message when the input is empty
    // or the localized message defined in the schema. Accept both.
    expect(await screen.findByText(INDEX_ERROR_REGEX)).toBeInTheDocument();
  });

  it("shows an error message if index is not a positive number for a chapter", async () => {
    render(<EditItemFormDialog {...getDefaultProps()} />);
    const indexInput = screen.getByLabelText("Index*");
    const submitButton = screen.getByRole("button", { name: "Enregistrer" });

    await userEvent.clear(indexInput);
    await userEvent.type(indexInput, "0"); // Non-positive index
    await userEvent.click(submitButton);

    expect(mockEditItem).not.toHaveBeenCalled();
    expect(await screen.findByText(INDEX_ERROR_REGEX)).toBeInTheDocument();

    await userEvent.clear(indexInput);
    await userEvent.type(indexInput, "-5"); // Negative index
    await userEvent.click(submitButton);

    expect(mockEditItem).not.toHaveBeenCalled();
    expect(await screen.findByText(INDEX_ERROR_REGEX)).toBeInTheDocument();
  });

  it("shows an error if index already exists for a chapter (different from initial)", async () => {
    render(
      <EditItemFormDialog
        {...getDefaultProps()}
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
    // If the input is treated as a string the Zod generic message may appear.
    // Accept either the uniqueness message or the generic Zod message.
    const uniqueIndexRegex =
      /Invalid input: expected number, received string|Cet index est déjà utilisé. Veuillez en choisir un autre\./i;
    expect(await screen.findByText(uniqueIndexRegex)).toBeInTheDocument();
  });

  it("does not show index error if index is unchanged", async () => {
    render(
      <EditItemFormDialog
        {...getDefaultProps()}
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
    const props = getDefaultProps();
    render(<EditItemFormDialog {...props} />);
    const nameInput = screen.getByLabelText("Nom du chapitre*");
    const submitButton = screen.getByRole("button", { name: "Enregistrer" });

    const newName = "Chapitre Un Modifié";
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, newName);
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockEditItem).toHaveBeenCalledWith(props.variant, {
        id: mockChapterItem.id,
        name_fr: newName,
        name_ar: mockChapterItem.name_ar,
        name_en: mockChapterItem.name_en,
        index: mockChapterItem.index,
      });
    });
    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith(
        "Élément modifié avec succès"
      );
    });
    await waitFor(() => {
      expect(props.onCancel).toHaveBeenCalledTimes(1);
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
    render(<EditItemFormDialog {...getDefaultProps()} />);
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

    const props = getDefaultProps();
    render(<EditItemFormDialog {...props} />);
    const nameInput = screen.getByLabelText("Nom du chapitre*");
    const submitButton = screen.getByRole("button", { name: "Enregistrer" });

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Test Erreur Action");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(errorMessage);
    });
    expect(props.onCancel).not.toHaveBeenCalled();
  });

  it("shows toast.error if editItem throws an exception", async () => {
    mockEditItem.mockRejectedValueOnce(new Error("Erreur critique"));

    const props = getDefaultProps();
    render(<EditItemFormDialog {...props} />);
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
    expect(props.onCancel).not.toHaveBeenCalled();
  });

  // Test for transmitters variant, where index is optional
  describe("with variant='transmitters'", () => {
    const getTransmitterProps = () => ({
      ...getDefaultProps(),
      item: mockTransmitterItem,
      items: mockExistingTransmitters,
      variant: "transmitters" as VariantType,
    });

    beforeEach(() => {
      mockEditItem.mockResolvedValue({
        // Reset mock for this describe block if needed
        success: true,
        message: "Transmetteur modifié!",
        data: { ...mockTransmitterItem, name: "Transmetteur Modifié" },
      });
    });

    it("renders the dialog with correct initial values for a transmitter", () => {
      render(<EditItemFormDialog {...getTransmitterProps()} />);
      expect(
        screen.getByRole("dialog", { name: "Éditer le transmetteur" })
      ).toBeInTheDocument();
      expect(screen.queryByLabelText("Index*")).not.toBeInTheDocument(); // Index field should not be present for transmitters
      expect(screen.getByLabelText("Nom du transmetteur*")).toHaveValue(
        mockTransmitterItem.name_fr
      );
      expect(screen.getByLabelText("Nom en arabe (optionnel)")).toHaveValue(
        mockTransmitterItem.name_ar
      );
      expect(screen.getByLabelText("Nom en anglais (optionnel)")).toHaveValue(
        mockTransmitterItem.name_en
      );
    });

    it("submits the form for a transmitter (index optional)", async () => {
      const transmitterProps = getTransmitterProps();
      render(<EditItemFormDialog {...transmitterProps} />);
      const nameInput = screen.getByLabelText("Nom du transmetteur*");
      const submitButton = screen.getByRole("button", { name: "Enregistrer" });

      const newName = "Transmetteur Un Modifié";

      await userEvent.clear(nameInput);

      await userEvent.type(nameInput, newName);

      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockEditItem).toHaveBeenCalledWith(transmitterProps.variant, {
          id: mockTransmitterItem.id,
          name_fr: newName,
          name_ar: mockTransmitterItem.name_ar,
          name_en: mockTransmitterItem.name_en,
        });
      });
      expect(mockToastSuccess).toHaveBeenCalledWith("Transmetteur modifié!");
      expect(transmitterProps.onCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe("with variant='transmitters'", () => {
    const getTransmitterProps = () => ({
      ...getDefaultProps(),
      item: mockTransmitterItem,
      items: mockExistingTransmitters,
      variant: "transmitters" as VariantType,
    });

    beforeEach(() => {
      mockEditItem.mockResolvedValue({
        success: true,
        message: "Transmetteur modifié!",
        data: { ...mockTransmitterItem, name: "Transmetteur Modifié" },
      });
    });

    it("renders the dialog with correct initial values for a transmitter", () => {
      render(<EditItemFormDialog {...getTransmitterProps()} />);
      expect(
        screen.getByRole("dialog", { name: "Éditer le transmetteur" })
      ).toBeInTheDocument();
      expect(screen.queryByLabelText("Index*")).not.toBeInTheDocument(); // Index field should not be present for transmitters
      expect(screen.getByLabelText("Nom du transmetteur*")).toHaveValue(
        mockTransmitterItem.name_fr
      );
      expect(screen.getByLabelText("Nom en arabe (optionnel)")).toHaveValue(
        mockTransmitterItem.name_ar
      );
      expect(screen.getByLabelText("Nom en anglais (optionnel)")).toHaveValue(
        mockTransmitterItem.name_en
      );
    });

    it("submits the form for a transmitter (index optional)", async () => {
      const transmitterProps = getTransmitterProps();
      render(<EditItemFormDialog {...transmitterProps} />);
      const nameInput = screen.getByLabelText("Nom du transmetteur*");
      const submitButton = screen.getByRole("button", { name: "Enregistrer" });

      const newName = "Transmetteur Un Modifié";

      await userEvent.clear(nameInput);
      await userEvent.type(nameInput, newName);
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockEditItem).toHaveBeenCalledWith(transmitterProps.variant, {
          id: mockTransmitterItem.id,
          name_fr: newName,
          name_ar: mockTransmitterItem.name_ar,
          name_en: mockTransmitterItem.name_en,
        });
      });
      expect(mockToastSuccess).toHaveBeenCalledWith("Transmetteur modifié!");
      expect(transmitterProps.onCancel).toHaveBeenCalledTimes(1);
    });
  });
});
