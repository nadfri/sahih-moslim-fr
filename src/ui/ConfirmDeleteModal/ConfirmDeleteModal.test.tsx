import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ConfirmDeleteModal } from "./ConfirmDeleteModal";

describe("ConfirmDeleteModal", () => {
  it("renders and handles confirm/cancel", async () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    const user = userEvent.setup();

    render(
      <ConfirmDeleteModal
        open={true}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    await user.click(screen.getByText("Supprimer"));
    expect(onConfirm).toHaveBeenCalled();

    await user.click(screen.getByText("Annuler"));
    expect(onCancel).toHaveBeenCalled();
  });
});
