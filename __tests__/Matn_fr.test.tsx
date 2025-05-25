import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Matn_fr } from "../src/ui/hadith/Matn_fr/Matn_fr";

describe("Matn_fr", () => {
  it("renders basic text content", () => {
    render(<Matn_fr matn="Ceci est un hadith test." />);

    expect(screen.getByText("Ceci est un hadith test.")).toBeInTheDocument();
  });

  it("renders custom strong tags with proper styling", () => {
    render(<Matn_fr matn="Texte **important** dans le hadith." />);

    const strongElement = screen.getByText("important");
    expect(strongElement.tagName).toBe("SPAN");
    expect(strongElement).toHaveClass(
      "text-emerald-600",
      "dark:text-emerald-400",
      "font-medium"
    );
  });

  it("renders custom em tags with proper styling", () => {
    render(<Matn_fr matn="Texte *emphasized* dans le hadith." />);

    const emElement = screen.getByText("emphasized");
    expect(emElement.tagName).toBe("EM");
    expect(emElement).toHaveClass(
      "border-l-4",
      "rounded-md",
      "border-amber-500",
      "dark:border-amber-600",
      "bg-amber-50",
      "dark:bg-amber-900/30"
    );
  });

  it("renders custom del tags with proper styling", () => {
    render(<Matn_fr matn="Texte ~~deleted~~ dans le hadith." />);

    const delElement = screen.getByText("deleted");
    expect(delElement.tagName).toBe("DEL");
    expect(delElement).toHaveClass(
      "text-blue-600",
      "dark:text-blue-500",
      "no-underline",
      "font-medium"
    );
  });

  it("handles complex markdown with multiple custom elements", () => {
    render(<Matn_fr matn="Le **Prophète** *a dit* : ~~Texte supprimé~~" />);

    expect(screen.getByText("Prophète")).toHaveClass("text-emerald-600");
    expect(screen.getByText("a dit")).toHaveClass("border-amber-500");
    expect(screen.getByText("Texte supprimé")).toHaveClass("text-blue-600");
  });

  it("handles raw HTML content", () => {
    render(
      <Matn_fr matn='Texte avec <mark class="bg-yellow-200">highlight</mark>' />
    );

    const markElement = screen.getByText("highlight");
    expect(markElement.tagName).toBe("MARK");
    expect(markElement).toHaveClass("bg-yellow-200");
  });

  it("renders empty string without errors", () => {
    const { container } = render(<Matn_fr matn="" />);

    expect(container.firstChild).toBeInTheDocument();
    expect(container.textContent).toBe("");
  });

  it("applies container styling correctly", () => {
    const { container } = render(<Matn_fr matn="Test content" />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass(
      "space-y-3",
      "text-gray-700",
      "dark:text-gray-300",
      "leading-relaxed",
      "text-pretty"
    );
  });
});
