import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PersonType } from "../../types/types";
import { ListLayoutPage } from "./ListLayoutPage";

// Mock next/link to render a simple anchor
vi.mock("next/link", () => ({
  __esModule: true,
  default: ({
    href,
    className,
    children,
  }: {
    href: string;
    className?: string;
    children: React.ReactNode;
  }) => (
    <a
      href={href}
      className={className}
      data-testid="mock-link"
    >
      {children}
    </a>
  ),
}));

const persons: PersonType[] = [
  { id: "1", name: "Ali", slug: "ali", hadithCount: 10 },
  { id: "2", name: "Omar", slug: "omar", hadithCount: 5 },
];

describe("ListLayoutPage", () => {
  it("renders the title and all persons", () => {
    render(
      <ListLayoutPage
        title="Test Title"
        persons={persons}
        basePath="narrators"
      />
    );
    // Title
    expect(
      screen.getByRole("heading", { name: /test title/i })
    ).toBeInTheDocument();
    // Cards
    expect(screen.getByText("Ali")).toBeInTheDocument();
    expect(screen.getByText("Omar")).toBeInTheDocument();
    // Hadith count
    expect(screen.getByText(/10 Hadiths/)).toBeInTheDocument();
    expect(screen.getByText(/5 Hadiths/)).toBeInTheDocument();
    // Explorer text
    expect(screen.getAllByText(/Explorer/)).toHaveLength(2);
  });

  it("renders correct links for each person", () => {
    render(
      <ListLayoutPage
        title="Test"
        persons={persons}
        basePath="sahabas"
      />
    );
    // Check hrefs
    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "sahabas/ali");
    expect(links[1]).toHaveAttribute("href", "sahabas/omar");
  });
});
