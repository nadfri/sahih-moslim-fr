import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { MultiSelect } from "./MultiSelect";
import { renderWithI18n } from "@/__tests__/renderWithI18n";

describe("MultiSelect", () => {
  const options = ["Option 1", "Option 2", "Option 3"];

  const defaultProps = {
    id: "test-multi-select",
    label: "Test Select",
    options,
    selected: [] as string[],
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders correctly with label", () => {
    renderWithI18n(<MultiSelect {...defaultProps} />);

    // Assert combobox is labeled correctly via accessible name
    expect(
      screen.getByRole("combobox", { name: "Test Select" })
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Rechercher...")).toBeInTheDocument();
  });

  it("shows placeholder when no options are selected", () => {
    renderWithI18n(<MultiSelect {...defaultProps} />);

    const input = screen.getByPlaceholderText("Rechercher...");
    expect(input).toBeInTheDocument();
  });

  it("displays selected options as badges", () => {
    renderWithI18n(
      <MultiSelect
        {...defaultProps}
        selected={["Option 1", "Option 3"]}
      />
    );

    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 3")).toBeInTheDocument();
    expect(screen.queryByText("Option 2")).not.toBeInTheDocument();
  });

  it("opens dropdown when input is clicked", async () => {
    const user = userEvent.setup();
    renderWithI18n(<MultiSelect {...defaultProps} />);

    // Click the input to open dropdown
    await user.click(screen.getByPlaceholderText("Rechercher..."));

    // Options should be visible in dropdown
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
    expect(screen.getByText("Option 3")).toBeInTheDocument();
  });

  it("filters options based on search term", async () => {
    const user = userEvent.setup();
    renderWithI18n(<MultiSelect {...defaultProps} />);

    // Focus on input and type to search
    const input = screen.getByPlaceholderText("Rechercher...");
    await user.click(input);
    await user.type(input, "1");

    // Only Option 1 should be visible
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.queryByText("Option 2")).not.toBeInTheDocument();
    expect(screen.queryByText("Option 3")).not.toBeInTheDocument();
  });

  it("selects an option when clicked in dropdown", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderWithI18n(
      <MultiSelect
        {...defaultProps}
        onChange={onChange}
      />
    );

    // Open dropdown
    await user.click(screen.getByPlaceholderText("Rechercher..."));

    // Select an option
    await user.click(screen.getByText("Option 1"));

    expect(onChange).toHaveBeenCalledWith(["Option 1"]);
  });

  it("removes selected option when clicking X button", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderWithI18n(
      <MultiSelect
        {...defaultProps}
        selected={["Option 1", "Option 2"]}
        onChange={onChange}
      />
    );

    // Find first X button (for Option 1) and click it
    const removeButtons = screen.getAllByRole("button", { name: "" });
    await user.click(removeButtons[0]);

    expect(onChange).toHaveBeenCalledWith(["Option 2"]);
  });

  it("displays error message when error prop is true", () => {
    renderWithI18n(
      <MultiSelect
        {...defaultProps}
        error={true}
        errorMessage="This field is required"
      />
    );

    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("closes dropdown when clicking outside", async () => {
    const user = userEvent.setup();

    renderWithI18n(
      <>
        <div data-testid="outside">Outside element</div>
        <MultiSelect {...defaultProps} />
      </>
    );

    // Open dropdown
    await user.click(screen.getByPlaceholderText("Rechercher..."));

    // Verify dropdown is open
    expect(screen.getByText("Option 1")).toBeInTheDocument();

    // Click outside
    await user.click(screen.getByTestId("outside"));

    // Verify dropdown is closed - option should not be visible
    expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
  });
});
