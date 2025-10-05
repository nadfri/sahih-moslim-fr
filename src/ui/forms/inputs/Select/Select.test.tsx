import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Select } from "./Select";

describe("Select", () => {
  it("renders select options correctly", () => {
    render(
      <Select
        id="test-select"
        label="Test"
        options={["Option A", "Option B", "Option C"]}
        value="Option A"
        onChange={() => {}}
      />
    );

    expect(screen.getByLabelText("Test")).toBeDefined();
    expect(screen.getByText("Option A")).toBeDefined();
    expect(screen.getByText("Option B")).toBeDefined();
    expect(screen.getByText("Option C")).toBeDefined();
  });

  it("calls onChange when an option is selected", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Select
        id="test-select"
        label="Test"
        options={["Option A", "Option B", "Option C"]}
        value="Option A"
        onChange={handleChange}
      />
    );

    const selectElement = screen.getByLabelText("Test");
    await user.click(selectElement);
    await user.selectOptions(selectElement, "Option B");

    expect(handleChange).toHaveBeenCalledWith("Option B");
  });

  it("displays error message when error prop is true", () => {
    render(
      <Select
        id="test-select"
        label="Test"
        options={["Option A", "Option B"]}
        value="Option A"
        onChange={() => {}}
        error={true}
        errorMessage="Erreur test"
      />
    );

    expect(screen.getByText("Erreur test")).toBeDefined();
  });
});
