import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { MultiSelectDragNDrop } from "./MultiSelectDragNDrop";

describe("MultiSelectDragNDrop", () => {
  const options = ["Option 1", "Option 2", "Option 3", "Option 4"] as const;

  const defaultProps = {
    id: "test-multi-select-dnd",
    label: "Test Select DnD",
    options,
    selected: [] as string[],
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("Basic rendering", () => {
    it("renders correctly with label", () => {
      render(<MultiSelectDragNDrop {...defaultProps} />);

      expect(screen.getByText("Test Select DnD")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Rechercher...")).toBeInTheDocument();
    });

    it("renders without label when not provided", () => {
      render(
        <MultiSelectDragNDrop
          {...defaultProps}
          label=""
        />
      );

      expect(screen.queryByText("Test Select DnD")).not.toBeInTheDocument();
      expect(screen.getByPlaceholderText("Rechercher...")).toBeInTheDocument();
    });

    it("shows custom placeholder when provided", () => {
      render(
        <MultiSelectDragNDrop
          {...defaultProps}
          placeholder="Tapez ici..."
        />
      );

      expect(screen.getByPlaceholderText("Tapez ici...")).toBeInTheDocument();
    });

    it("displays error state when error prop is true", () => {
      render(
        <MultiSelectDragNDrop
          {...defaultProps}
          error={true}
          errorMessage="Erreur de test"
        />
      );

      expect(screen.getByText("Erreur de test")).toBeInTheDocument();
    });
  });

  describe("Selected items display", () => {
    it("displays selected options as ordered badges with numbers", () => {
      render(
        <MultiSelectDragNDrop
          {...defaultProps}
          selected={["Option 2", "Option 1", "Option 4"]}
        />
      );

      // Check that items are displayed with order numbers
      expect(screen.getByText("1.")).toBeInTheDocument();
      expect(screen.getByText("2.")).toBeInTheDocument();
      expect(screen.getByText("3.")).toBeInTheDocument();
      expect(screen.getByText("Option 2")).toBeInTheDocument();
      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.getByText("Option 4")).toBeInTheDocument();
    });
    it("shows grip vertical icon for drag and drop", () => {
      render(
        <MultiSelectDragNDrop
          {...defaultProps}
          selected={["Option 1"]}
        />
      );

      // The GripVertical icon should be present - check for the first SVG (grip icon)
      const selectedItemContainer = screen.getByText("Option 1").closest("div");
      const svgElements = selectedItemContainer?.querySelectorAll("svg");
      expect(svgElements).toHaveLength(2); // GripVertical + X icons
      expect(svgElements?.[0]).toBeInTheDocument(); // First SVG should be GripVertical
    });

    it("shows counter text for selected items", () => {
      render(
        <MultiSelectDragNDrop
          {...defaultProps}
          selected={["Option 1", "Option 2"]}
        />
      );

      expect(
        screen.getByText(
          /Glissez-déposez pour réorganiser l'ordre • 2 éléments sélectionnés/
        )
      ).toBeInTheDocument();
    });

    it("shows singular counter text for single item", () => {
      render(
        <MultiSelectDragNDrop
          {...defaultProps}
          selected={["Option 1"]}
        />
      );

      expect(
        screen.getByText(
          /Glissez-déposez pour réorganiser l'ordre • 1 élément sélectionné/
        )
      ).toBeInTheDocument();
    });
  });

  describe("Dropdown functionality", () => {
    it("opens dropdown when input is clicked", async () => {
      const user = userEvent.setup();
      render(<MultiSelectDragNDrop {...defaultProps} />);

      // Click the input to open dropdown
      await user.click(screen.getByPlaceholderText("Rechercher..."));

      // Options should be visible in dropdown
      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.getByText("Option 2")).toBeInTheDocument();
      expect(screen.getByText("Option 3")).toBeInTheDocument();
      expect(screen.getByText("Option 4")).toBeInTheDocument();
    });

    it("opens/closes dropdown when chevron button is clicked", async () => {
      const user = userEvent.setup();
      render(<MultiSelectDragNDrop {...defaultProps} />);

      const chevronButton = screen.getByLabelText("Ouvrir la liste");
      await user.click(chevronButton);

      // Options should be visible
      expect(screen.getByText("Option 1")).toBeInTheDocument();

      // Click again to close
      const closeButton = screen.getByLabelText("Fermer la liste");
      await user.click(closeButton);

      // Wait for dropdown to close and check that options are not visible
      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });

    it("filters options based on search term", async () => {
      const user = userEvent.setup();
      render(<MultiSelectDragNDrop {...defaultProps} />);

      // Focus on input and type to search
      const input = screen.getByPlaceholderText("Rechercher...");
      await user.click(input);
      await user.type(input, "1");

      // Only Option 1 should be visible in dropdown
      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.queryByText("Option 2")).not.toBeInTheDocument();
      expect(screen.queryByText("Option 3")).not.toBeInTheDocument();
      expect(screen.queryByText("Option 4")).not.toBeInTheDocument();
    });

    it("shows 'Aucun résultat trouvé' when search has no matches", async () => {
      const user = userEvent.setup();
      render(<MultiSelectDragNDrop {...defaultProps} />);

      const input = screen.getByPlaceholderText("Rechercher...");
      await user.click(input);
      await user.type(input, "xyz");

      expect(screen.getByText("Aucun résultat trouvé")).toBeInTheDocument();
    });

    it("shows 'Toutes les options sont sélectionnées' when all options are selected", async () => {
      const user = userEvent.setup();
      render(
        <MultiSelectDragNDrop
          {...defaultProps}
          selected={["Option 1", "Option 2", "Option 3", "Option 4"]}
        />
      );

      const input = screen.getByPlaceholderText("");
      await user.click(input);

      expect(
        screen.getByText("Toutes les options sont sélectionnées")
      ).toBeInTheDocument();
    });
  });

  describe("Selection functionality", () => {
    it("selects an option when clicked in dropdown", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(
        <MultiSelectDragNDrop
          {...defaultProps}
          onChange={onChange}
        />
      );

      // Open dropdown and select option
      await user.click(screen.getByPlaceholderText("Rechercher..."));
      await user.click(screen.getByText("Option 1"));

      expect(onChange).toHaveBeenCalledWith(["Option 1"]);
    });

    it("adds new selections to the end of the array", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(
        <MultiSelectDragNDrop
          {...defaultProps}
          selected={["Option 2"]}
          onChange={onChange}
        />
      );

      // Open dropdown and select another option
      await user.click(screen.getByPlaceholderText(""));
      await user.click(screen.getByText("Option 1"));

      expect(onChange).toHaveBeenCalledWith(["Option 2", "Option 1"]);
    });

    it("removes selected option when clicking X button", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <MultiSelectDragNDrop
          {...defaultProps}
          selected={["Option 1", "Option 2"]}
          onChange={onChange}
        />
      );

      // Find and click the X button for the first option
      const firstSelectedItem = screen.getByText("Option 1").closest("div");
      const removeButton = firstSelectedItem?.querySelector("button");

      if (removeButton) {
        await user.click(removeButton);
      }

      expect(onChange).toHaveBeenCalledWith(["Option 2"]);
    });

    it("clears search term after selection", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(
        <MultiSelectDragNDrop
          {...defaultProps}
          onChange={onChange}
        />
      );

      const input = screen.getByPlaceholderText("Rechercher...");
      await user.click(input);
      await user.type(input, "1");
      await user.click(screen.getByText("Option 1"));

      // Input should be cleared
      expect(input).toHaveValue("");
    });
  });

  describe("Drag and drop functionality", () => {
    it("handles drag start event", () => {
      render(
        <MultiSelectDragNDrop
          {...defaultProps}
          selected={["Option 1", "Option 2"]}
        />
      );

      const firstBadge = screen.getByText("Option 1").closest("div");
      expect(firstBadge).toHaveAttribute("draggable", "true");

      // Simulate drag start
      if (firstBadge) {
        fireEvent.dragStart(firstBadge);
        expect(firstBadge).toHaveClass("cursor-move");
      }
    });

    it("handles drag over event", () => {
      render(
        <MultiSelectDragNDrop
          {...defaultProps}
          selected={["Option 1", "Option 2"]}
        />
      );

      const firstBadge = screen.getByText("Option 1").closest("div");

      if (firstBadge) {
        const dragOverEvent = new Event("dragover", { bubbles: true });
        Object.defineProperty(dragOverEvent, "preventDefault", {
          value: vi.fn(),
          writable: true,
        });

        fireEvent(firstBadge, dragOverEvent);
        expect(dragOverEvent.preventDefault).toHaveBeenCalled();
      }
    });

    it("reorders items on drop", () => {
      const onChange = vi.fn();
      render(
        <MultiSelectDragNDrop
          {...defaultProps}
          selected={["Option 1", "Option 2", "Option 3"]}
          onChange={onChange}
        />
      );

      // Simulate dragging first item to third position
      const firstBadge = screen.getByText("Option 1").closest("div");
      const thirdBadge = screen.getByText("Option 3").closest("div");

      if (firstBadge && thirdBadge) {
        // Start drag on first item
        fireEvent.dragStart(firstBadge);

        // Drop on third item
        const dropEvent = new Event("drop", { bubbles: true });
        Object.defineProperty(dropEvent, "preventDefault", {
          value: vi.fn(),
          writable: true,
        });

        fireEvent(thirdBadge, dropEvent);

        // Should reorder: Option 2, Option 3, Option 1
        expect(onChange).toHaveBeenCalledWith([
          "Option 2",
          "Option 3",
          "Option 1",
        ]);
      }
    });
  });

  describe("Hidden inputs for form submission", () => {
    it("creates hidden inputs when name prop is provided", () => {
      render(
        <MultiSelectDragNDrop
          {...defaultProps}
          name="test-field"
          selected={["Option 1", "Option 2"]}
        />
      );

      const hiddenInputs = document.querySelectorAll('input[type="hidden"]');
      expect(hiddenInputs).toHaveLength(2);
      expect(hiddenInputs[0]).toHaveAttribute("name", "test-field[0]");
      expect(hiddenInputs[0]).toHaveAttribute("value", "Option 1");
      expect(hiddenInputs[1]).toHaveAttribute("name", "test-field[1]");
      expect(hiddenInputs[1]).toHaveAttribute("value", "Option 2");
    });

    it("does not create hidden inputs when name prop is not provided", () => {
      render(
        <MultiSelectDragNDrop
          {...defaultProps}
          selected={["Option 1", "Option 2"]}
        />
      );

      const hiddenInputs = document.querySelectorAll('input[type="hidden"]');
      expect(hiddenInputs).toHaveLength(0);
    });
  });

  describe("Accessibility", () => {
    it("has proper aria labels for buttons", () => {
      render(<MultiSelectDragNDrop {...defaultProps} />);

      expect(screen.getByLabelText("Ouvrir la liste")).toBeInTheDocument();
    });

    it("associates label with input correctly", () => {
      render(<MultiSelectDragNDrop {...defaultProps} />);

      const label = screen.getByText("Test Select DnD");
      const input = screen.getByPlaceholderText("Rechercher...");

      expect(label).toHaveAttribute("for", "test-multi-select-dnd");
      expect(input).toHaveAttribute("id", "test-multi-select-dnd");
    });
  });
});
