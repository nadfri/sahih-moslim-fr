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
    // Check if handleChange is called for each character
    expect(handleChange).toHaveBeenCalledTimes(3);
  });

  it("renders the label", () => {
    render(
      <Input
        id="label-input"
        label="My Label"
        value=""
        onChange={() => {}}
      />
    );
    expect(screen.getByText("My Label")).toBeInTheDocument();
  });

  it("renders with placeholder", () => {
    render(
      <Input
        id="placeholder-input"
        label="Label"
        value=""
        placeholder="Enter something"
        onChange={() => {}}
      />
    );
    expect(screen.getByPlaceholderText("Enter something")).toBeInTheDocument();
  });

  it("is controlled by value prop", async () => {
    // Controlled input: value does not change unless parent changes it
    let value = "";
    const handleChange = vi.fn((e) => {
      value = e.target.value;
    });
    render(
      <Input
        id="controlled-input"
        label="Controlled"
        value={value}
        onChange={handleChange}
      />
    );
    const input = screen.getByLabelText("Controlled");
    await userEvent.type(input, "x");
    expect(handleChange).toHaveBeenCalled();
    // The value prop is still "", so input value should be ""
    expect((input as HTMLInputElement).value).toBe("");
  });
});
