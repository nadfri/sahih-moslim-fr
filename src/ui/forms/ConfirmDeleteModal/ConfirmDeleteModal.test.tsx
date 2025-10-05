import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ConfirmDeleteModal } from "./ConfirmDeleteModal";

describe("ConfirmDeleteModal", () => {
  const onConfirmMock = vi.fn();
  const onCancelMock = vi.fn();
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  it("should not render the modal when open is false", () => {
    render(
      <ConfirmDeleteModal
        open={false}
        onConfirm={onConfirmMock}
        onCancel={onCancelMock}
      />
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Supprimer" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Annuler" })
    ).not.toBeInTheDocument();
  });

  it("should render the modal with default title and message when open is true", () => {
    render(
      <ConfirmDeleteModal
        open={true}
        onConfirm={onConfirmMock}
        onCancel={onCancelMock}
      />
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    // Default title from component
    expect(screen.getByText("Supprimer cet élément ?")).toBeInTheDocument();
    // Default description from component
    expect(
      screen.getByText("Êtes-vous sûr de vouloir supprimer cet élément ?")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Supprimer" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Annuler" })).toBeInTheDocument();
  });

  it("should render custom title and message when provided", async () => {
    const customTitle = "Custom Title";
    const customMessage = "Custom Message for deletion.";
    render(
      <ConfirmDeleteModal
        open={true}
        onConfirm={onConfirmMock}
        onCancel={onCancelMock}
        title={customTitle}
        // The component prop is 'description', not 'message'
        description={customMessage}
      />
    );
    expect(screen.getByText(customTitle)).toBeInTheDocument();
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it("should call onConfirm when the 'Supprimer' button is clicked", async () => {
    render(
      <ConfirmDeleteModal
        open={true}
        onConfirm={onConfirmMock}
        onCancel={onCancelMock}
      />
    );
    await user.click(screen.getByRole("button", { name: "Supprimer" }));
    expect(onConfirmMock).toHaveBeenCalledTimes(1);
    expect(onCancelMock).not.toHaveBeenCalled();
  });

  it("should call onCancel when the 'Annuler' button is clicked", async () => {
    render(
      <ConfirmDeleteModal
        open={true}
        onConfirm={onConfirmMock}
        onCancel={onCancelMock}
      />
    );
    await user.click(screen.getByRole("button", { name: "Annuler" }));
    await waitFor(() => {
      expect(onCancelMock).toHaveBeenCalledTimes(1);
    });
    expect(onConfirmMock).not.toHaveBeenCalled();
  });

  it("should display 'Suppression...' on confirm button and disable buttons when loading is true", () => {
    render(
      <ConfirmDeleteModal
        open={true}
        onConfirm={onConfirmMock}
        onCancel={onCancelMock}
        loading={true}
      />
    );
    const confirmButton = screen.getByRole("button", {
      name: "Suppression...",
    });
    const cancelButton = screen.getByRole("button", { name: "Annuler" });

    expect(confirmButton).toBeInTheDocument();
    expect(confirmButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  it("should display hadith count warning message when hadithCount > 0", () => {
    const hadithCount = 5;
    render(
      <ConfirmDeleteModal
        open={true}
        onConfirm={onConfirmMock}
        onCancel={onCancelMock}
        hadithCount={hadithCount}
      />
    );
    expect(
      screen.getByText(
        `Attention : ${hadithCount} hadith(s) lié(s) seront rattachés à « Inconnu ».`,
        { exact: false }
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText("Cette action est irréversible.", { exact: false })
    ).toBeInTheDocument();
  });

  it("should not display hadith count warning message when hadithCount is 0", () => {
    render(
      <ConfirmDeleteModal
        open={true}
        onConfirm={onConfirmMock}
        onCancel={onCancelMock}
        hadithCount={0}
      />
    );
    expect(
      screen.queryByText(/hadith\(s\) lié\(s\) seront rattachés/i)
    ).not.toBeInTheDocument();
  });
});
