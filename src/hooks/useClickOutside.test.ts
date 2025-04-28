import { renderHook } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { useClickOutside } from "./useClickOutside";

describe("useClickOutside", () => {
  it("should call handler on outside click", async () => {
    // Set up the mock handler and user event
    const handler = vi.fn();
    const user = userEvent.setup();

    // Create a ref element that we can control
    const element = document.createElement("div");
    document.body.appendChild(element);

    // Create a ref object pointing to our element
    const ref = { current: element };

    // Render the hook with our controlled ref
    renderHook(() => useClickOutside(ref, handler));

    // Simulate click outside the element
    await user.click(document.body);
    expect(handler).toHaveBeenCalledTimes(1);

    // Reset the mock
    handler.mockReset();

    // Simulate click inside the element
    await user.click(element);
    expect(handler).not.toHaveBeenCalled();

    // Clean up
    document.body.removeChild(element);
  });
});
