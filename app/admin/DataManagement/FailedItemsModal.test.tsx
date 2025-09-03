import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FailedItemsModal } from "./FailedItemsModal";

describe("FailedItemsModal", () => {
  const mockFailedItems = [
    { item: { name: "Chapitre 1" }, reason: "Données invalides" },
    { item: { name: "Chapitre 2" }, reason: "Doublon détecté" },
    { reason: "Erreur système" },
  ];

  const mockProps = {
    items: mockFailedItems,
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("ne rend rien quand items est vide", () => {
    render(
      <FailedItemsModal
        items={[]}
        onClose={mockProps.onClose}
      />
    );

    expect(screen.queryByText("Échecs d'import")).not.toBeInTheDocument();
  });

  it("ne rend rien quand items est null", () => {
    render(
      <FailedItemsModal
        items={[]}
        onClose={mockProps.onClose}
      />
    );

    expect(screen.queryByText("Échecs d'import")).not.toBeInTheDocument();
  });

  it("rend correctement avec des éléments échoués", () => {
    render(<FailedItemsModal {...mockProps} />);

    expect(screen.getByText("Échecs d'import")).toBeInTheDocument();
  });

  it("affiche le nombre d'éléments échoués", () => {
    render(<FailedItemsModal {...mockProps} />);

    expect(
      screen.getByText(/Certains éléments n'ont pas pu être importés/)
    ).toBeInTheDocument();
  });

  it("affiche la liste des éléments échoués avec leurs raisons", () => {
    render(<FailedItemsModal {...mockProps} />);

    expect(
      screen.getByText("Chapitre 1 — Données invalides")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Chapitre 2 — Doublon détecté")
    ).toBeInTheDocument();
    expect(screen.getByText("Item — Erreur système")).toBeInTheDocument();
  });

  it("gère les éléments sans nom d'item", () => {
    const itemsWithoutNames = [
      { reason: "Erreur de connexion" },
      { reason: "Timeout" },
    ];

    render(
      <FailedItemsModal
        items={itemsWithoutNames}
        onClose={mockProps.onClose}
      />
    );

    expect(screen.getByText("Item — Erreur de connexion")).toBeInTheDocument();
    expect(screen.getByText("Item — Timeout")).toBeInTheDocument();
    expect(
      screen.getByText(/Certains éléments n'ont pas pu être importés/)
    ).toBeInTheDocument();
  });

  it("appelle onClose quand on clique sur Fermer", () => {
    render(<FailedItemsModal {...mockProps} />);

    const closeButton = screen.getByText("Fermer");
    fireEvent.click(closeButton);

    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("appelle onClose quand on clique sur la croix de fermeture", () => {
    render(<FailedItemsModal {...mockProps} />);

    // Trouver le bouton de fermeture par sa classe
    const closeButton = screen.getByRole("button", { name: "" });
    fireEvent.click(closeButton);

    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("gère une liste vide d'éléments échoués", () => {
    render(
      <FailedItemsModal
        {...mockProps}
        items={[]}
      />
    );

    expect(screen.queryByText("Échecs d'import")).not.toBeInTheDocument();
  });

  it("affiche correctement les éléments avec des propriétés d'item complexes", () => {
    const complexFailedItems = [
      {
        item: {
          id: "1",
          name: "Test Item",
          slug: "test-item",
          index: 1,
        },
        reason: "Validation échouée",
      },
    ];

    render(
      <FailedItemsModal
        items={complexFailedItems}
        onClose={mockProps.onClose}
      />
    );

    expect(
      screen.getByText("Test Item — Validation échouée")
    ).toBeInTheDocument();
  });

  it("gère les cas où item est undefined", () => {
    const failedItemsWithUndefined = [
      { item: undefined, reason: "Erreur inconnue" },
      { reason: "Autre erreur" },
    ];

    render(
      <FailedItemsModal
        items={failedItemsWithUndefined}
        onClose={mockProps.onClose}
      />
    );

    expect(screen.getByText("Item — Erreur inconnue")).toBeInTheDocument();
    expect(screen.getByText("Item — Autre erreur")).toBeInTheDocument();
  });

  it("affiche le bon message pour un seul élément échoué", () => {
    const singleFailedItem = [{ reason: "Erreur unique" }];

    render(
      <FailedItemsModal
        items={singleFailedItem}
        onClose={mockProps.onClose}
      />
    );

    expect(
      screen.getByText(/Certains éléments n'ont pas pu être importés/)
    ).toBeInTheDocument();
  });
});
