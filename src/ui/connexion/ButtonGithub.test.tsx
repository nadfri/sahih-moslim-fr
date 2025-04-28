import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ButtonGithub } from "./ButtonGithub";

// Simple mocks for the required dependencies
vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (key: string) => (key === "callbackUrl" ? "/test-callback" : null),
  }),
}));

describe("ButtonGithub", () => {
  it("renders with correct text and triggers signIn on click", async () => {
    const { signIn } = await import("next-auth/react");
    const user = userEvent.setup();

    render(<ButtonGithub />);

    // Check that the button renders with the correct text
    const button = screen.getByRole("button", {
      name: /connexion avec github/i,
    });
    expect(button).toBeInTheDocument();

    // Check that the button has a Github icon
    const svgIcon = document.querySelector("svg");
    expect(svgIcon).toBeInTheDocument();

    // Click the button and verify signIn was called
    await user.click(button);
    expect(signIn).toHaveBeenCalledWith("github", {
      callbackUrl: "/test-callback",
      redirect: true,
    });
  });
});
