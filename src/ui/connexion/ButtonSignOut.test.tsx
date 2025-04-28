import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ButtonSignOut } from "./ButtonSignOut";

// Mock next-auth/react
vi.mock("next-auth/react", () => ({
  signOut: vi.fn(),
}));

describe("ButtonSignOut", () => {
  it("renders with PowerOff icon and triggers signOut with redirect to home page", async () => {
    const { signOut } = await import("next-auth/react");
    const user = userEvent.setup();

    render(<ButtonSignOut />);

    // Check that the button is rendered
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();

    // Check that PowerOff icon is present
    const powerOffIcon = document.querySelector("svg");
    expect(powerOffIcon).toBeInTheDocument();
    expect(powerOffIcon?.getAttribute("aria-hidden")).toBe("true");

    // Click the button and verify signOut was called with correct parameters
    await user.click(button);
    expect(signOut).toHaveBeenCalledWith({
      redirectTo: "/",
      redirect: true,
    });
  });
});
