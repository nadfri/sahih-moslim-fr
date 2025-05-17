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
  { id: "1", name: "Chapitre 1", slug: "chapitre-1", index: 1 },
  { id: "2", name: "Chapitre 2", slug: "chapitre-2", index: 2 },
];

describe("AddItemForm", () => {
  const defaultProps = {
    items: mockItemsChapter,
    variant: "chapters" as VariantType,
  };

  // Mock server actions and dependencies
  vi.mock("@/src/services/actions", () => ({
    addItem: vi.fn(),
  }));

  vi.mock("react-toastify", () => ({
    toast: {
      success: vi.fn(),
      error: vi.fn(),
    },
  }));

  const mockAddItem = vi.mocked(addItem);
  const mockToastSuccess = vi.mocked(toast.success);
  const mockToastError = vi.mocked(toast.error);

  const placeholderText = {
    title: {
      chapters: "Ajouter un chapitre",
      narrators: "Ajouter un narrateur",
      sahabas: "Ajouter un compagnon",
    },
    name: {
      chapters: "Nom du chapitre",
      narrators: "Nom du narrateur",
      sahabas: "Nom du compagnon",
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

  it("displays the title and correct fields for narrators", () => {
    render(
      <AddItemForm
        {...defaultProps}
        variant="narrators"
        items={[]} // Example: provide empty or specific items for narrators
      />
    );
    expect(
      screen.getByRole("heading", {
        name: placeholderText.title.narrators,
      })
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText(/Numero du chapitre/i)
    ).not.toBeInTheDocument();
    expect(
      screen.getByLabelText(placeholderText.title.narrators + "*")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: placeholderText.title.narrators })
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

  it("suggère le prochain index disponible pour les chapitres", () => {
    render(<AddItemForm {...defaultProps} />);
    expect(screen.getByText(/Suggéré: 3/i)).toBeInTheDocument(); // Based on mockItemsChapter
  });

  it("ne soumet pas si le numéro du chapitre est manquant", async () => {
    render(<AddItemForm {...defaultProps} />);
    const indexInput = screen.getByLabelText(/Numero du chapitre/i);
    const submitButton = screen.getByRole("button", {
      name: placeholderText.title.chapters,
    });

    await userEvent.clear(indexInput);
    await userEvent.click(submitButton);

    expect(mockAddItem).not.toHaveBeenCalled();
    expect(
      await screen.findByText("L'index doit être un nombre positif")
    ).toBeInTheDocument();
  });

  it("ne soumet pas si le nom est manquant", async () => {
    render(<AddItemForm {...defaultProps} />);
    const submitButton = screen.getByRole("button", {
      name: placeholderText.title.chapters,
    });
    await userEvent.click(submitButton);

    expect(mockAddItem).not.toHaveBeenCalled();
    expect(await screen.findByText("Au moins 3 lettres")).toBeInTheDocument();
  });

  it("soumet le formulaire avec des données valides pour un chapitre", async () => {
    render(<AddItemForm {...defaultProps} />);
    const nameInput = screen.getByLabelText(
      placeholderText.title.chapters + "*"
    );
    const indexInput = screen.getByLabelText(/Numero du chapitre/i);
    const submitButton = screen.getByRole("button", {
      name: placeholderText.title.chapters,
    });

    await userEvent.type(nameInput, "Nouveau Chapitre Test");
    await userEvent.clear(indexInput);
    await userEvent.type(indexInput, "10");

    await userEvent.click(submitButton);

    expect(mockAddItem).toHaveBeenCalledWith("chapters", {
      name: "Nouveau Chapitre Test",
      nameArabic: null,
      index: 10,
    });
    expect(mockToastSuccess).toHaveBeenCalledWith("Élément ajouté avec succès");
    expect(nameInput).toHaveValue("");
    // Default addItem mock returns data with index: 3.
    // Initial items: [index:1, index:2]. After add, items in component state: [ {id:"1", index:1, ...}, {id:"2", index:2,...}, {id:"3", index:3,...} ].
    // nextAvailableIndex on this list is 4.
    await waitFor(() => expect(indexInput).toHaveValue(4));
  });

  it("soumet le formulaire avec des données valides pour un narrateur", async () => {
    mockAddItem.mockResolvedValueOnce({
      success: true,
      message: "Narrateur ajouté",
      data: {
        id: "nar-1",
        name: "Nouveau Narrateur Test",
        slug: "nouveau-narrateur-test",
      },
    });
    render(
      <AddItemForm
        {...defaultProps}
        variant="narrators"
        items={[]}
      />
    );
    const nameInput = screen.getByLabelText(
      placeholderText.title.narrators + "*"
    );
    const submitButton = screen.getByRole("button", {
      name: placeholderText.title.narrators,
    });

    await userEvent.type(nameInput, "Nouveau Narrateur Test");
    await userEvent.click(submitButton);

    expect(mockAddItem).toHaveBeenCalledWith("narrators", {
      name: "Nouveau Narrateur Test",
      nameArabic: null,
      index: undefined,
    });
    expect(mockToastSuccess).toHaveBeenCalledWith("Narrateur ajouté");
    expect(nameInput).toHaveValue("");
  });

  it("affiche un message d'erreur si l'ajout échoue (erreur serveur)", async () => {
    mockAddItem.mockResolvedValueOnce({
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

  it("affiche un message d'erreur en cas d'erreur inattendue (exception)", async () => {
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

  it("affiche 'En cours...' sur le bouton pendant la soumission", async () => {
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

  it("met à jour la liste des éléments et réinitialise le formulaire après un ajout réussi", async () => {
    const newItemData = {
      id: "3",
      name: "Nouveau Chapitre Ajouté",
      slug: "nouveau-chapitre-ajoute",
      index: 3,
    };
    mockAddItem.mockResolvedValueOnce({
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
      name: newItemData.name,
      nameArabic: null,
      index: newItemData.index,
    });
    expect(mockToastSuccess).toHaveBeenCalledWith("Ajouté !");
    expect(nameInput).toHaveValue("");

    // Initial items: [index:1, index:2]. Added item: {index:3}.
    // After add, items in component state: [ {id:"1", index:1,...}, {id:"2", index:2,...}, {id:"3", index:3,...} ].
    // nextAvailableIndex on this list is 4.
    await waitFor(() => {
      expect(indexInput).toHaveValue(4);
    });
    await waitFor(() => {
      expect(screen.getByText(/Suggéré: 4/i)).toBeInTheDocument();
    });
  });
});
