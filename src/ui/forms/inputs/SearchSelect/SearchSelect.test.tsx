import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderWithI18n } from "@/__tests__/renderWithI18n";
import { SearchSelect } from "./SearchSelect";

describe("SearchSelect", () => {
  const options = ["Option 1", "Option 2", "Option 3", "Another option"];

  it("renders search select with label and placeholder", () => {
    renderWithI18n(
      <SearchSelect
        id="test-searchselect"
        label="Test Label"
        placeholder="Custom placeholder"
        options={options}
        value=""
        onChange={() => {}}
      />
    );

    expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Custom placeholder")
    ).toBeInTheDocument();
  });

  it("filters options based on input value", async () => {
    const user = userEvent.setup();

    renderWithI18n(
      <SearchSelect
        id="test-searchselect"
        label="Test Label"
        options={options}
        value=""
        onChange={() => {}}
      />
    );

    const input = screen.getByLabelText("Test Label");
    await user.click(input);

    // Check all options are displayed initially
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
    expect(screen.getByText("Option 3")).toBeInTheDocument();
    expect(screen.getByText("Another option")).toBeInTheDocument();

    // Filter by typing
    await user.type(input, "another");

    // Verify filtered results
    expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Option 2")).not.toBeInTheDocument();
    expect(screen.queryByText("Option 3")).not.toBeInTheDocument();
    expect(screen.getByText("Another option")).toBeInTheDocument();
  });

  it("calls onChange when selecting an option", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    renderWithI18n(
      <SearchSelect
        id="test-searchselect"
        label="Test Label"
        options={options}
        value=""
        onChange={handleChange}
      />
    );

    const input = screen.getByLabelText("Test Label");
    await user.click(input);
    await user.click(screen.getByText("Option 2"));

    expect(handleChange).toHaveBeenCalledWith("Option 2");
  });

  it("shows the clear button when a value is present and clears the input when clicked", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    renderWithI18n(
      <SearchSelect
        id="test-searchselect"
        label="Test Label"
        options={options}
        value="Option 1"
        onChange={handleChange}
      />
    );

    // Clear button should be visible
    const clearButton = screen.getByLabelText("Effacer");
    expect(clearButton).toBeInTheDocument();

    // Click the clear button
    await user.click(clearButton);

    // Verify onChange was called with empty string
    expect(handleChange).toHaveBeenCalledWith("");
  });

  it("toggles dropdown when clicking the chevron button", async () => {
    const user = userEvent.setup();

    renderWithI18n(
      <SearchSelect
        id="test-searchselect"
        label="Test Label"
        options={options}
        value=""
        onChange={() => {}}
      />
    );

    // Initially, dropdown is closed (chevron shows 'Ouvrir la liste')
    expect(
      screen.queryByRole("list", { name: "Test Label" })
    ).not.toBeInTheDocument();

    // Click the chevron button to open dropdown
    const openButton = screen.getByLabelText("Ouvrir la liste");
    await user.click(openButton);

    // Verify dropdown is open
    expect(
      screen.getByRole("list", { name: "Test Label" })
    ).toBeInTheDocument();

    // Click the chevron button again to close dropdown
    const closeButton = screen.getByLabelText("Fermer la liste");
    await user.click(closeButton);

    // Verify dropdown is closed
    expect(
      screen.queryByRole("list", { name: "Test Label" })
    ).not.toBeInTheDocument();
  });

  it("displays error message when error is true", () => {
    renderWithI18n(
      <SearchSelect
        id="test-searchselect"
        label="Test Label"
        options={options}
        value=""
        onChange={() => {}}
        error={true}
        errorMessage="This is an error message"
      />
    );

    expect(screen.getByText("This is an error message")).toBeInTheDocument();
  });

  it("shows 'Aucun résultat' when no options match the search", async () => {
    const user = userEvent.setup();

    renderWithI18n(
      <SearchSelect
        id="test-searchselect"
        label="Test Label"
        options={options}
        value=""
        onChange={() => {}}
      />
    );

    const input = screen.getByLabelText("Test Label");
    await user.click(input);
    await user.type(input, "nonexistent option");

    expect(screen.getByText("Aucun résultat")).toBeInTheDocument();
  });
});
