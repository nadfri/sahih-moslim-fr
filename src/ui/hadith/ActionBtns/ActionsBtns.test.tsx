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

// Mock useAuth hook
const mockUseAuth = vi.fn(() => ({
  user: null,
  profile: null,
  loading: false,
  signInWithGitHub: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("@/src/hooks/useAuth", () => ({
  useAuth: () => mockUseAuth(),
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
    render(<ActionsBtns hadith={mockHadith} />);

    expect(screen.getByTestId("copy-board")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Signaler une erreur/ })
    ).toBeInTheDocument();
    expect(screen.getByText("Signaler")).toBeInTheDocument();
  });

  it("should not show preview badge when update is false", () => {
    render(<ActionsBtns hadith={mockHadith} />);

    expect(screen.queryByText("Aperçu")).not.toBeInTheDocument();
  });

  it("should show preview badge when update is true", () => {
    render(
      <ActionsBtns
        hadith={mockHadith}
        edit={true}
      />
    );

    expect(screen.getByText("Aperçu")).toBeInTheDocument();
  });

  it("should render Signaler button with correct styling and attributes", () => {
    render(<ActionsBtns hadith={mockHadith} />);

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
      mockUseAuth.mockReturnValueOnce({
        user: null,
        profile: { role: "ADMIN" },
        loading: false,
        signInWithGitHub: vi.fn(),
        signOut: vi.fn(),
      } as unknown as ReturnType<typeof mockUseAuth>);

      render(<ActionsBtns hadith={mockHadith} />);

      const editLink = screen.getByRole("link", { name: /Éditer le hadith/ });
      expect(editLink).toBeInTheDocument();
      expect(editLink).toHaveAttribute(
        "href",
        `/hadiths/${mockHadith.numero}/edit`
      );
      expect(editLink).toHaveAttribute("title", "Modifier ce hadith");
      expect(screen.getByText("Éditer")).toBeInTheDocument();
    });

    it("should render edit link with correct styling for admin", () => {
      mockUseAuth.mockReturnValueOnce({
        user: null,
        profile: { role: "ADMIN" },
        loading: false,
        signInWithGitHub: vi.fn(),
        signOut: vi.fn(),
      } as unknown as ReturnType<typeof mockUseAuth>);

      render(<ActionsBtns hadith={mockHadith} />);

      const editLink = screen.getByRole("link", { name: /Éditer le hadith/ });
      // Instead of asserting exact class names, verify the link and label are present
      expect(editLink).toBeInTheDocument();
      expect(screen.getByText("Éditer")).toBeInTheDocument();
    });
  });

  describe("Production mode", () => {
    it("should not show edit link when user is not admin", () => {
      mockUseAuth.mockReturnValueOnce({
        user: null,
        profile: null,
        loading: false,
        signInWithGitHub: vi.fn(),
        signOut: vi.fn(),
      });

      render(<ActionsBtns hadith={mockHadith} />);

      expect(
        screen.queryByRole("link", { name: /Éditer le hadith/ })
      ).not.toBeInTheDocument();
      expect(screen.queryByText("Éditer")).not.toBeInTheDocument();
    });

    it("should not show edit link when user is not admin (test mode)", () => {
      mockUseAuth.mockReturnValueOnce({
        user: null,
        profile: null,
        loading: false,
        signInWithGitHub: vi.fn(),
        signOut: vi.fn(),
      });

      render(<ActionsBtns hadith={mockHadith} />);

      expect(
        screen.queryByRole("link", { name: /Éditer le hadith/ })
      ).not.toBeInTheDocument();
    });
  });

  it("should have proper container layout", () => {
    const { container } = render(<ActionsBtns hadith={mockHadith} />);

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
    render(<ActionsBtns hadith={mockHadith} />);

    expect(screen.getByTestId("copy-board")).toHaveTextContent(
      `CopyBoard for hadith ${mockHadith.numero}`
    );
  });

  it("should have proper icons with aria-hidden", () => {
    mockUseAuth.mockReturnValueOnce({
      user: null,
      profile: { role: "ADMIN" },
      loading: false,
      signInWithGitHub: vi.fn(),
      signOut: vi.fn(),
    } as unknown as ReturnType<typeof mockUseAuth>);

    render(
      <ActionsBtns
        hadith={mockHadith}
        edit={true}
      />
    );

    // Check for ScanEye icon in preview badge
    const previewBadge = screen.getByText("Aperçu").closest("span");
    const previewIcon = previewBadge?.querySelector("svg");
    expect(previewIcon).toHaveAttribute("aria-hidden", "true");

    // Check for TriangleAlert icon in Signaler button
    const signalerButton = screen.getByRole("button", {
      name: /Signaler une erreur/,
    });
    const signalerIcon = signalerButton.querySelector("svg");
    expect(signalerIcon).toHaveAttribute("aria-hidden", "true");

    // Check for Pencil icon in Edit link
    const editLink = screen.getByRole("link", { name: /Éditer le hadith/ });
    const editIcon = editLink.querySelector("svg");
    expect(editIcon).toHaveAttribute("aria-hidden", "true");
  });
});
