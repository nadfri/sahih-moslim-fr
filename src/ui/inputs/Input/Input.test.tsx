import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Input } from "./Input";

describe("Input", () => {
  it("renders and accepts input", async () => {
    const handleChange = vi.fn();
    render(
      <Input
        id="test-input"
        label="Test"
        value=""
        onChange={handleChange}
      />
    );
    const input = screen.getByLabelText("Test");
    expect(input).toBeDefined();
    await userEvent.type(input, "abc");
    // Optionally check if handleChange is called
  });
});
