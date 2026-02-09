import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Dialog } from "./Dialog";

describe("Dialog Component", () => {
  const title = "Test Dialog Title";
  const contentText = "This is the dialog content.";
  const MockChildren = () => <p>{contentText}</p>;

  it("should not render when open is false", () => {
    render(
      <Dialog
        open={false}
        onClose={() => {}}
        title={title}
      >
        <MockChildren />
      </Dialog>
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should render when open is true", () => {
    render(
      <Dialog
        open={true}
        onClose={() => {}}
        title={title}
      >
        <MockChildren />
      </Dialog>
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(contentText)).toBeInTheDocument();
  });

  it("should call onClose when the close button is clicked", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(
      <Dialog
        open={true}
        onClose={handleClose}
        title={title}
      >
        <MockChildren />
      </Dialog>
    );

    const closeButton = screen.getByLabelText("Fermer");
    await user.click(closeButton);

    // Wait for the fadeOut animation and subsequent onClose call
    await waitFor(
      () => {
        expect(handleClose).toHaveBeenCalledTimes(1);
      },
      { timeout: 300 }
    ); // Timeout should be greater than animation time (200ms)
  });

  it("clears timeout on unmount", async () => {
    const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");
    const user = userEvent.setup();
    const { unmount } = render(
      <Dialog
        open={true}
        onClose={() => {}}
        title="Test"
      >
        <div>Content</div>
      </Dialog>
    );

    // Trigger close to set the timeout
    const closeButton = screen.getByLabelText("Fermer");
    await user.click(closeButton);

    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});
