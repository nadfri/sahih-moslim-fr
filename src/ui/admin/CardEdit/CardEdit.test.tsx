import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { ItemType } from "@/src/types/types";
import { CardEdit } from "./CardEdit";

// Mock dependencies
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/src/services/actions", () => ({
  deleteItem: vi.fn(),
}));

vi.mock("../../ConfirmDeleteModal/ConfirmDeleteModal", () => ({
  ConfirmDeleteModal: vi.fn(
    ({ open, onCancel, onConfirm, title, description, hadithCount }) =>
      open ? (
        <div data-testid="confirm-delete-modal">
          <h2>{title}</h2>
          <div>{description}</div>
          <p>Hadith count: {hadithCount}</p>
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm}>Confirm</button>
        </div>
      ) : null
  ),
}));

vi.mock("../../forms/EditItemFormDialog/EditItemFormDialog", () => ({
  EditItemFormDialog: vi.fn(({ open, onCancel, item, variant }) =>
    open ? (
      <div data-testid="edit-item-dialog">
        <h2>Edit {variant}</h2>
        <p>Item: {item.name}</p>
        <button onClick={onCancel}>Cancel</button>
      </div>
    ) : null
  ),
}));

vi.mock("../../hadith/BadgeNumberOfHadith/BadgeNumberOfHadith", () => ({
  BadgeNumberOfHadith: vi.fn(({ count }) => (
    <span data-testid="hadith-badge">{count} hadiths</span>
  )),
}));

const mockChapterItem: ItemType = {
  id: "1",
  name: "La Foi",
  slug: "la-foi",
  index: 1,
  hadithCount: 15,
};

const mockNarratorItem: ItemType = {
  id: "2",
  name: "Omar ibn al-Khattab",
  slug: "omar-ibn-al-khattab",
  hadithCount: 25,
  nameArabic: "عمر بن الخطاب",
};

const mockItems: ItemType[] = [mockChapterItem, mockNarratorItem];

describe("CardEdit Component", () => {
  it("should render item information correctly", () => {
    render(
      <CardEdit
        item={mockChapterItem}
        items={mockItems}
        variant="chapters"
      />
    );

    expect(screen.getByText("La Foi")).toBeInTheDocument();
    expect(screen.getByText("Slug: la-foi")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument(); // index
    expect(screen.getByTestId("hadith-badge")).toHaveTextContent("15 hadiths");
  });

  it("should render Arabic name when provided", () => {
    render(
      <CardEdit
        item={mockNarratorItem}
        items={mockItems}
        variant="narrators"
      />
    );

    expect(screen.getByText("Omar ibn al-Khattab")).toBeInTheDocument();
    expect(screen.getByText("عمر بن الخطاب")).toBeInTheDocument();
  });

  it("should not render index when not provided", () => {
    const itemWithoutIndex = { ...mockNarratorItem };
    delete itemWithoutIndex.index;

    render(
      <CardEdit
        item={itemWithoutIndex}
        items={mockItems}
        variant="narrators"
      />
    );

    // Index badge should not be present
    expect(screen.queryByText("2")).not.toBeInTheDocument();
  });

  it("should render edit and delete buttons", () => {
    render(
      <CardEdit
        item={mockChapterItem}
        items={mockItems}
        variant="chapters"
      />
    );

    expect(screen.getByLabelText("Éditer")).toBeInTheDocument();
    expect(screen.getByLabelText("Supprimer")).toBeInTheDocument();
  });

  it("should open edit dialog when edit button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <CardEdit
        item={mockChapterItem}
        items={mockItems}
        variant="chapters"
      />
    );

    const editButton = screen.getByLabelText("Éditer");
    await user.click(editButton);

    expect(screen.getByTestId("edit-item-dialog")).toBeInTheDocument();
    expect(screen.getByText("Edit chapters")).toBeInTheDocument();
    expect(screen.getByText("Item: La Foi")).toBeInTheDocument();
  });

  it("should close edit dialog when cancel is clicked", async () => {
    const user = userEvent.setup();
    render(
      <CardEdit
        item={mockChapterItem}
        items={mockItems}
        variant="chapters"
      />
    );

    // Open dialog
    await user.click(screen.getByLabelText("Éditer"));
    expect(screen.getByTestId("edit-item-dialog")).toBeInTheDocument();

    // Close dialog
    await user.click(screen.getByText("Cancel"));
    await waitFor(() => {
      expect(screen.queryByTestId("edit-item-dialog")).not.toBeInTheDocument();
    });
  });

  it("should open delete modal when delete button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <CardEdit
        item={mockChapterItem}
        items={mockItems}
        variant="chapters"
      />
    );

    const deleteButton = screen.getByLabelText("Supprimer");
    await user.click(deleteButton);

    expect(screen.getByTestId("confirm-delete-modal")).toBeInTheDocument();
    expect(screen.getByText("Supprimer ce chapitre ?")).toBeInTheDocument();
    expect(screen.getByText("Hadith count: 15")).toBeInTheDocument();
  });

  it("should close delete modal when cancel is clicked", async () => {
    const user = userEvent.setup();
    render(
      <CardEdit
        item={mockChapterItem}
        items={mockItems}
        variant="chapters"
      />
    );

    // Open modal
    await user.click(screen.getByLabelText("Supprimer"));
    expect(screen.getByTestId("confirm-delete-modal")).toBeInTheDocument();

    // Close modal
    await user.click(screen.getByText("Cancel"));
    await waitFor(() => {
      expect(
        screen.queryByTestId("confirm-delete-modal")
      ).not.toBeInTheDocument();
    });
  });

  it("should display correct variant-specific delete text", async () => {
    const user = userEvent.setup();

    const { rerender } = render(
      <CardEdit
        item={mockChapterItem}
        items={mockItems}
        variant="chapters"
      />
    );

    await user.click(screen.getByLabelText("Supprimer"));
    expect(screen.getByText("Supprimer ce chapitre ?")).toBeInTheDocument();

    // Close modal and rerender with different variant
    await user.click(screen.getByText("Cancel"));

    rerender(
      <CardEdit
        item={mockNarratorItem}
        items={mockItems}
        variant="narrators"
      />
    );

    await user.click(screen.getByLabelText("Supprimer"));
    expect(screen.getByText("Supprimer ce narrateur ?")).toBeInTheDocument();
  });

  it("should handle sahaba variant correctly", async () => {
    const user = userEvent.setup();
    render(
      <CardEdit
        item={mockNarratorItem}
        items={mockItems}
        variant="sahabas"
      />
    );

    await user.click(screen.getByLabelText("Supprimer"));
    expect(screen.getByText("Supprimer ce compagnon ?")).toBeInTheDocument();
  });

  it("should handle transmitters variant correctly", async () => {
    const user = userEvent.setup();
    render(
      <CardEdit
        item={mockNarratorItem}
        items={mockItems}
        variant="transmitters"
      />
    );

    await user.click(screen.getByLabelText("Supprimer"));
    expect(screen.getByText("Supprimer ce transmetteur ?")).toBeInTheDocument();
  });
});
