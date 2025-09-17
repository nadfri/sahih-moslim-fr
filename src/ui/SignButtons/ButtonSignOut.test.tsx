import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ButtonSignOut } from "./ButtonSignOut";

describe("ButtonSignOut", () => {
  it("renders with PowerOff icon and triggers signOut when clicked", async () => {
    const user = userEvent.setup();
    const mockSignOut = vi.fn();

    render(<ButtonSignOut signOut={mockSignOut} />);

    // Check that the button is rendered
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();

    // Check that PowerOff icon is present
    const powerOffIcon = document.querySelector("svg");
    expect(powerOffIcon).toBeInTheDocument();
    expect(powerOffIcon?.getAttribute("aria-hidden")).toBe("true");

    // Click the button and verify signOut was called
    await user.click(button);
    expect(mockSignOut).toHaveBeenCalled();
  });
});
