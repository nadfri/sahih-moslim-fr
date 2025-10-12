// filepath: e:/DEV/sahih-moslim-fr/src/ui/forms/AddItemForm.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { toast } from "react-toastify";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { addItem } from "@/src/services/actions";
import { ItemType, VariantType } from "@/src/types/types";
import { AddItemForm } from "./AddItemForm";

// Ensure VariantType is imported

// Mock the server action
vi.mock("@/src/services/actions", () => ({
  addItem: vi.fn(),
}));

// Mock react-toastify
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockItemsChapter: ItemType[] = [
  {
    id: "1",
    name_fr: "Chapitre 1",
    name_ar: null,
    name_en: null,
    slug: "chapitre-1",
    index: 1,
  },
  {
    id: "2",
    name_fr: "Chapitre 2",
    name_ar: null,
    name_en: null,
    slug: "chapitre-2",
    index: 2,
  },
];

describe("AddItemForm", () => {
  const defaultProps = {
    items: mockItemsChapter,
    variant: "chapters" as VariantType,
  };

  const mockAddItem = vi.mocked(addItem);
  const mockToastSuccess = vi.mocked(toast.success);
  const mockToastError = vi.mocked(toast.error);

  const placeholderText = {
    title: {
      chapters: "Ajouter un chapitre",
      sahabas: "Ajouter un compagnon",
      transmitters: "Ajouter un transmetteur",
    },
    name: {
      chapters: "Nom du chapitre",
      sahabas: "Nom du compagnon",
      transmitters: "Nom du transmetteur",
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Set default mock implementation for addItem
    mockAddItem.mockResolvedValue({
      success: true,
      message: "Élément ajouté avec succès",
      data: {
        id: "3",
        name: "Nouveau Chapitre",
        slug: "nouveau-chapitre",
        index: 3,
      }, // Added slug
    });
  });

  it("displays the title and correct fields for chapters", () => {
    render(<AddItemForm {...defaultProps} />);
    expect(
      screen.getByRole("heading", {
        name: placeholderText.title.chapters,
      })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Numero du chapitre/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(placeholderText.title.chapters + "*")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: placeholderText.title.chapters })
    ).toBeInTheDocument();
  });

  it("displays the title and correct fields for transmitters", () => {
    render(
      <AddItemForm
        {...defaultProps}
        variant="transmitters"
        items={[]} // Example: provide empty or specific items for transmitters
      />
    );
    expect(
      screen.getByRole("heading", {
        name: placeholderText.title.transmitters,
      })
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText(/Numero du chapitre/i)
    ).not.toBeInTheDocument();
    expect(
      screen.getByLabelText(placeholderText.title.transmitters + "*")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: placeholderText.title.transmitters })
    ).toBeInTheDocument();
  });

  it("displays the title and correct fields for sahabas", () => {
    render(
      <AddItemForm
        {...defaultProps}
        variant="sahabas"
        items={[]} // Example: provide empty or specific items for sahabas
      />
    );
    expect(
      screen.getByRole("heading", {
        name: placeholderText.title.sahabas,
      })
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText(/Numero du chapitre/i)
    ).not.toBeInTheDocument();
    expect(
      screen.getByLabelText(placeholderText.title.sahabas + "*")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: placeholderText.title.sahabas })
    ).toBeInTheDocument();
  });

  it("suggests next available index for chapters", () => {
    render(<AddItemForm {...defaultProps} />);
    expect(screen.getByText(/Suggéré: 3/i)).toBeInTheDocument(); // Based on mockItemsChapter
  });

  it("does not submit if name already exists (client validation)", async () => {
    render(<AddItemForm {...defaultProps} />);
    const nameInput = screen.getByLabelText(
      placeholderText.title.chapters + "*"
    );
    const submitButton = screen.getByRole("button", {
      name: placeholderText.title.chapters,
    });

    await userEvent.type(nameInput, "Chapitre 1"); // Nom qui existe déjà dans mockItemsChapter

    await userEvent.click(submitButton);

    expect(mockAddItem).not.toHaveBeenCalled();
    expect(
      await screen.findByText(
        "Ce nom français est déjà utilisé. Veuillez en choisir un autre."
      )
    ).toBeInTheDocument();
  });

  it("does not submit if chapter number is missing", async () => {
    render(<AddItemForm {...defaultProps} />);
    const indexInput = screen.getByLabelText(/Numero du chapitre/i);
    const submitButton = screen.getByRole("button", {
      name: placeholderText.title.chapters,
    });

    await userEvent.clear(indexInput);
    await userEvent.click(submitButton);

    expect(mockAddItem).not.toHaveBeenCalled();
    expect(
      await screen.findByText("Invalid input: expected number, received NaN")
    ).toBeInTheDocument();
  });

  it("does not submit if item already exists (server validation)", async () => {
    // Simuler un échec côté serveur pour un item dupliqué
    mockAddItem.mockResolvedValue({
      success: false,
      message: "Un élément avec ce nom existe déjà",
    });

    render(<AddItemForm {...defaultProps} />);
    const nameInput = screen.getByLabelText(
      placeholderText.title.chapters + "*"
    );
    const submitButton = screen.getByRole("button", {
      name: placeholderText.title.chapters,
    });

    await userEvent.type(
      nameInput,
      "Nouveau Chapitre Unique" // Nom qui n'existe pas côté client
    );
    // Do not modify the index input (it is pre-filled with a numeric value).
    // Modifying it as a string causes Zod to reject before server call.
    await userEvent.click(submitButton);

    expect(mockAddItem).toHaveBeenCalledWith("chapters", {
      name_fr: "Nouveau Chapitre Unique",
      name_ar: null,
      name_en: null,
      index: 3,
    });

    expect(mockToastError).toHaveBeenCalledWith(
      "Un élément avec ce nom existe déjà"
    );

    // Le formulaire ne doit pas être réinitialisé en cas d'échec
    expect(nameInput).toHaveValue("Nouveau Chapitre Unique");

    // index remains the suggested numeric value after failed submission
    const indexInputAfter = screen.getByLabelText(/Numero du chapitre/i);
    expect(indexInputAfter).toHaveValue(3);
  });

  it("submits form with valid data for a chapter", async () => {
    mockAddItem.mockResolvedValue({
      success: true,
      message: "Élément ajouté avec succès",
      data: {
        id: "3",
        name: "Nouveau Chapitre Test",
        slug: "nouveau-chapitre-test",
        index: 3,
      },
    });

    render(<AddItemForm {...defaultProps} />);
    const nameInput = screen.getByLabelText(
      placeholderText.title.chapters + "*"
    );
    const indexInput = screen.getByLabelText(/Numero du chapitre/i);
    const submitButton = screen.getByRole("button", {
      name: placeholderText.title.chapters,
    });

    await userEvent.type(nameInput, "Nouveau Chapitre Test");
    // Don't change the index - use the suggested value (3)

    await userEvent.click(submitButton);

    expect(mockAddItem).toHaveBeenCalledWith("chapters", {
      name_fr: "Nouveau Chapitre Test",
      name_ar: null,
      name_en: null,
      index: 3, // Use the suggested index (3) instead of 5
    });
    expect(mockToastSuccess).toHaveBeenCalledWith("Élément ajouté avec succès");
    // Note: Form does not reset automatically as serverItems prop hasn't changed
    expect(nameInput).toHaveValue("Nouveau Chapitre Test");
    expect(indexInput).toHaveValue(3);
  });

  it("submits form with valid data for a transmitter", async () => {
    mockAddItem.mockResolvedValue({
      success: true,
      message: "Transmetteur ajouté",
      data: {
        id: "trans-1",
        name: "Nouveau Transmetteur Test",
        slug: "nouveau-transmetteur-test",
      },
    });
    render(
      <AddItemForm
        {...defaultProps}
        variant="transmitters"
        items={[]}
      />
    );
    const nameInput = screen.getByLabelText(
      placeholderText.title.transmitters + "*"
    );
    const submitButton = screen.getByRole("button", {
      name: placeholderText.title.transmitters,
    });

    await userEvent.type(nameInput, "Nouveau Transmetteur Test");
    await userEvent.click(submitButton);

    expect(mockAddItem).toHaveBeenCalledWith("transmitters", {
      name_fr: "Nouveau Transmetteur Test",
      name_ar: null,
      name_en: null,
      index: undefined,
    });
    expect(mockToastSuccess).toHaveBeenCalledWith("Transmetteur ajouté");
    // Note: Form does not reset automatically
    expect(nameInput).toHaveValue("Nouveau Transmetteur Test");
  });

  it("shows error message if add fails (server error)", async () => {
    mockAddItem.mockResolvedValue({
      success: false,
      message: "Erreur serveur simulée",
    });
    render(<AddItemForm {...defaultProps} />);
    const nameInput = screen.getByLabelText(
      placeholderText.title.chapters + "*"
    );
    const submitButton = screen.getByRole("button", {
      name: placeholderText.title.chapters,
    });

    await userEvent.type(nameInput, "Test Échec");
    await userEvent.click(submitButton);

    expect(mockToastError).toHaveBeenCalledWith("Erreur serveur simulée");
  });

  it("shows error message on unexpected error (exception)", async () => {
    mockAddItem.mockRejectedValueOnce(new Error("Erreur inattendue"));
    render(<AddItemForm {...defaultProps} />);
    const nameInput = screen.getByLabelText(
      placeholderText.title.chapters + "*"
    );
    const submitButton = screen.getByRole("button", {
      name: placeholderText.title.chapters,
    });

    await userEvent.type(nameInput, "Test Exception");
    await userEvent.click(submitButton);

    expect(mockToastError).toHaveBeenCalledWith("Erreur inattendue");
  });

  it("shows 'En cours...' on the button during submission", async () => {
    mockAddItem.mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                success: true,
                message: "OK",
                data: { id: "tmp", name: "tmp", slug: "tmp-slug" },
              }), // Added slug
            100
          )
        )
    );

    render(<AddItemForm {...defaultProps} />);
    const nameInput = screen.getByLabelText(
      placeholderText.title.chapters + "*"
    );
    const submitButton = screen.getByRole("button", {
      name: placeholderText.title.chapters,
    });

    await userEvent.type(nameInput, "Test Chargement");
    userEvent.click(submitButton);

    expect(
      await screen.findByRole("button", { name: "En cours..." })
    ).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    await waitFor(() => expect(mockAddItem).toHaveBeenCalled());
  });

  it("updates item list and resets form after successful add", async () => {
    const newItemData = {
      id: "3",
      name: "Nouveau Chapitre Ajouté",
      slug: "nouveau-chapitre-ajoute",
      index: 3,
    };
    mockAddItem.mockResolvedValue({
      success: true,
      message: "Ajouté !",
      data: newItemData,
    });

    render(<AddItemForm {...defaultProps} />);
    const nameInput = screen.getByLabelText(
      placeholderText.title.chapters + "*"
    );
    const indexInput = screen.getByLabelText(/Numero du chapitre/i);
    const submitButton = screen.getByRole("button", {
      name: placeholderText.title.chapters,
    });

    expect(screen.getByText(/Suggéré: 3/i)).toBeInTheDocument();
    expect(indexInput).toHaveValue(3);

    await userEvent.type(nameInput, newItemData.name);
    // Submitting with index 3 (pre-filled suggested value)

    await userEvent.click(submitButton);

    expect(mockAddItem).toHaveBeenCalledWith("chapters", {
      name_fr: newItemData.name,
      name_ar: null,
      name_en: null,
      index: newItemData.index,
    });
    expect(mockToastSuccess).toHaveBeenCalledWith("Ajouté !");
    // Note: Form does not reset automatically as serverItems prop hasn't changed
    expect(nameInput).toHaveValue(newItemData.name);
    expect(indexInput).toHaveValue(3);
    expect(screen.getByText(/Suggéré: 3/i)).toBeInTheDocument();
  });
});
