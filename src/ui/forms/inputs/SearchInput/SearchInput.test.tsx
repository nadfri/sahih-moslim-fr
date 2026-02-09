import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SearchInput } from "./SearchInput";
import { renderWithI18n } from "@/__tests__/renderWithI18n";

describe("SearchInput", () => {
  it("renders with label and placeholder", () => {
    renderWithI18n(
      <SearchInput
        id="test-search"
        label="Search"
        value=""
        onChange={() => {}}
      />
    );

    expect(screen.getByLabelText("Search")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Rechercher...")).toBeInTheDocument();
  });

  it("calls onChange when input value changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderWithI18n(
      <SearchInput
        id="test-search"
        label="Search"
        value=""
        onChange={onChange}
      />
    );

    const input = screen.getByRole("textbox");
    await user.type(input, "test");

    // onChange is called once per character typed
    expect(onChange).toHaveBeenCalledTimes(4);
    expect(onChange.mock.calls.map((call) => call[0]).join("")).toBe("test");
  });

  it("shows clear button when value is not empty", () => {
    renderWithI18n(
      <SearchInput
        id="test-search"
        label="Search"
        value="some text"
        onChange={() => {}}
      />
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("clears value when clear button is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderWithI18n(
      <SearchInput
        id="test-search"
        label="Search"
        value="some text"
        onChange={onChange}
      />
    );

    const clearButton = screen.getByRole("button");
    await user.click(clearButton);

    expect(onChange).toHaveBeenCalledWith("");
  });
});
