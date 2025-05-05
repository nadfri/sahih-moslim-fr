import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";

import { MdTextArea } from "./MdTextArea";

// Mock MDEditor component
vi.mock("@uiw/react-md-editor", () => ({
  default: ({
    value,
    onChange,
    textareaProps,
  }: {
    value: string;
    onChange: (value: string | undefined) => void;
    textareaProps: {
      placeholder?: string;
      onFocus: () => void;
      onBlur: () => void;
    };
  }) => {
    return (
      <div data-testid="md-editor-mock">
        <textarea
          data-testid="md-editor-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={textareaProps?.placeholder}
          onFocus={textareaProps?.onFocus}
          onBlur={textareaProps?.onBlur}
        />
      </div>
    );
  },
}));

// Wrapper component for testing
function TestWrapper({
  defaultValue = "",
  error = false,
  errorMessage = "",
  onValueChange,
  height,
  placeholder,
}: {
  defaultValue?: string;
  error?: boolean;
  errorMessage?: string;
  onValueChange?: (value: string) => string;
  height?: number;
  placeholder?: string;
}) {
  type FormValues = {
    content: string;
  };

  const { control } = useForm<FormValues>({
    defaultValues: {
      content: defaultValue,
    },
  });

  return (
    <MdTextArea
      id="test-md-textarea"
      name="content"
      label="Test Label"
      control={control}
      error={error}
      errorMessage={errorMessage}
      onValueChange={onValueChange}
      height={height}
      placeholder={placeholder}
    />
  );
}

describe("MdTextArea", () => {
  it("renders with the correct label", () => {
    render(<TestWrapper />);

    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("displays placeholder text when provided", () => {
    render(<TestWrapper placeholder="Enter markdown text..." />);

    const textarea = screen.getByTestId("md-editor-textarea");
    expect(textarea).toHaveAttribute("placeholder", "Enter markdown text...");
  });

  it("displays error message when error is true", () => {
    render(
      <TestWrapper
        error={true}
        errorMessage="This field is required"
      />
    );

    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("does not display error message when error is false", () => {
    render(
      <TestWrapper
        error={false}
        errorMessage="This field is required"
      />
    );

    expect(
      screen.queryByText("This field is required")
    ).not.toBeInTheDocument();
  });

  it("applies focus styling when editor is focused", async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const container = screen.getByTestId("md-editor-textarea").closest("div");
    const parentDiv = container?.parentElement?.parentElement;

    expect(parentDiv).not.toHaveClass("ring-2 ring-blue-500");

    await user.click(screen.getByTestId("md-editor-textarea"));

    // After focus, it should have blue ring
    expect(parentDiv).toHaveClass("ring-2 ring-blue-500");
  });

  it("applies error styling when error is true", () => {
    render(<TestWrapper error={true} />);

    const container = screen.getByTestId("md-editor-textarea").closest("div");
    const parentDiv = container?.parentElement?.parentElement;

    expect(parentDiv).toHaveClass("ring-2 ring-red-500");
  });

  it("calls onValueChange when text is entered", async () => {
    const mockValue = "test markdown";
    const onValueChangeMock = vi.fn((val) => val);
    const user = userEvent.setup();

    render(<TestWrapper onValueChange={onValueChangeMock} />);

    const textarea = screen.getByTestId("md-editor-textarea");
    await user.type(textarea, mockValue);

    expect(onValueChangeMock).toHaveBeenCalledWith(mockValue);
  });

  it("initializes with default value when provided", () => {
    render(<TestWrapper defaultValue="Initial content" />);

    const textarea = screen.getByTestId("md-editor-textarea");
    expect(textarea).toHaveValue("Initial content");
  });

  it("removes focus styling when editor is blurred", async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const textarea = screen.getByTestId("md-editor-textarea");
    const container = textarea.closest("div");
    const parentDiv = container?.parentElement?.parentElement;

    // First focus the element
    await user.click(textarea);
    expect(parentDiv).toHaveClass("ring-2 ring-blue-500");

    // Then blur by clicking outside
    await user.click(document.body);
    expect(parentDiv).not.toHaveClass("ring-2 ring-blue-500");
  });
});
