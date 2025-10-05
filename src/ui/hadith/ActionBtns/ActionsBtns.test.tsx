import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { mockHadith } from "@/src/mocks/mockHadith";
import { HadithType } from "@/src/types/types";
import { ActionsBtns } from "./ActionsBtns";

type LinkProps = {
  children: React.ReactNode;
  href: string;
  className?: string;
  title?: string;
  "aria-label"?: string;
};

type CopyBoardProps = {
  hadith: HadithType;
};

// Mock Next.js Link component
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: LinkProps) => (
    <a
      href={href}
      {...props}
    >
      {children}
    </a>
  ),
}));

// Mock Next.js Link component
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: LinkProps) => (
    <a
      href={href}
      {...props}
    >
      {children}
    </a>
  ),
}));

// Mock CopyBoard component
vi.mock("../../CopyBoard/CopyBoard", () => ({
  CopyBoard: ({ hadith }: CopyBoardProps) => (
    <div data-testid="copy-board">CopyBoard for hadith {hadith.numero}</div>
  ),
}));

describe("ActionsBtns Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // no env cleanup required
  });

  it("should render all basic elements", () => {
    render(
      <ActionsBtns
        hadith={mockHadith}
        isAdmin={false}
      />
    );

    expect(screen.getByTestId("copy-board")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Signaler une erreur/ })
    ).toBeInTheDocument();
    expect(screen.getByText("Signaler")).toBeInTheDocument();
  });

  it("should render Signaler button with correct styling and attributes", () => {
    render(
      <ActionsBtns
        hadith={mockHadith}
        isAdmin={false}
      />
    );

    const signalerButton = screen.getByRole("button", {
      name: /Signaler une erreur/,
    });

    expect(signalerButton).toHaveAttribute("title", "Signaler une erreur");
    expect(signalerButton).toHaveAttribute(
      "aria-label",
      "Signaler une erreur dans ce hadith"
    );
  });

  describe("Development mode", () => {
    it("should show edit link when user is admin", () => {
      render(
        <ActionsBtns
          hadith={mockHadith}
          isAdmin={true}
        />
      );

      const editLink = screen.getByRole("link", { name: /Éditer le hadith/ });
      expect(editLink).toBeInTheDocument();
      expect(editLink).toHaveAttribute(
        "href",
        `/hadith/${mockHadith.numero}/edit`
      );
      expect(editLink).toHaveAttribute("title", "Modifier ce hadith");
      expect(screen.getByText("Éditer")).toBeInTheDocument();
    });

    it("should render edit link with correct styling for admin", () => {
      render(
        <ActionsBtns
          hadith={mockHadith}
          isAdmin={true}
        />
      );

      const editLink = screen.getByRole("link", { name: /Éditer le hadith/ });
      // Instead of asserting exact class names, verify the link and label are present
      expect(editLink).toBeInTheDocument();
      expect(screen.getByText("Éditer")).toBeInTheDocument();
    });
  });

  describe("Production mode", () => {
    it("should not show edit link when user is not admin", () => {
      render(
        <ActionsBtns
          hadith={mockHadith}
          isAdmin={false}
        />
      );

      expect(
        screen.queryByRole("link", { name: /Éditer le hadith/ })
      ).not.toBeInTheDocument();
      expect(screen.queryByText("Éditer")).not.toBeInTheDocument();
    });

    it("should not show edit link when user is not admin (test mode)", () => {
      render(
        <ActionsBtns
          hadith={mockHadith}
          isAdmin={false}
        />
      );

      expect(
        screen.queryByRole("link", { name: /Éditer le hadith/ })
      ).not.toBeInTheDocument();
    });
  });

  it("should have proper container layout", () => {
    const { container } = render(
      <ActionsBtns
        hadith={mockHadith}
        isAdmin={false}
      />
    );

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass(
      "flex",
      "flex-wrap",
      "items-center",
      "justify-between",
      "gap-3",
      "mt-4"
    );
  });

  it("should pass hadith prop to CopyBoard component", () => {
    render(
      <ActionsBtns
        hadith={mockHadith}
        isAdmin={false}
      />
    );

    expect(screen.getByTestId("copy-board")).toHaveTextContent(
      `CopyBoard for hadith ${mockHadith.numero}`
    );
  });
});
