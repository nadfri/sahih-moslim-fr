import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Page from "./page";

describe("UnauthorizedPage", () => {
  it("renders unauthorized message", () => {
    render(<Page />);
    expect(screen.getByText(/accès non autorisé/i)).toBeInTheDocument();
  });
});
