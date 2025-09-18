import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ButtonSignOut } from "./ButtonSignOut";

// Mock Supabase client
const mockSignOut = vi.fn();
vi.mock("@/src/lib/auth/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signOut: mockSignOut,
    },
  }),
}));

// Mock Next.js router
const mockPush = vi.fn();
const mockRefresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

describe("ButtonSignOut", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSignOut.mockResolvedValue(undefined);
  });

  it("renders with PowerOff icon and triggers signOut when clicked", async () => {
    const user = userEvent.setup();

    render(<ButtonSignOut />);

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

    // Verify router methods were called
    expect(mockRefresh).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith("/");
  });
});
