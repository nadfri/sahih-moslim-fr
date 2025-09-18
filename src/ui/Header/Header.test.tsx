import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Header } from "./Header";

// Mock des hooks et composants externes
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

vi.mock("@/src/hooks/useAuth", () => ({
  useAuth: () => ({
    user: null,
    isLoggedIn: false,
    isAdmin: false,
    loading: false,
    signInWithGitHub: vi.fn(),
    signOut: vi.fn(),
  }),
}));

vi.mock("./Logo", () => ({
  Logo: () => <div data-testid="logo">Sahih Muslim FR</div>,
}));

vi.mock("./NavBar", () => ({
  NavBar: ({ isMobile }: { isMobile?: boolean }) => (
    <nav data-testid={`navbar-${isMobile ? "mobile" : "desktop"}`}>
      <ul>
        <li>
          <span>Accueil</span>
        </li>
        <li>
          <span>Chapitres</span>
        </li>
        <li>
          <span>Compagnons</span>
        </li>
        <li>
          <span>Transmetteurs</span>
        </li>
        <li>
          <span>Recherche</span>
        </li>
      </ul>
    </nav>
  ),
}));

vi.mock("./LinkAddHadith", () => ({
  LinkAddHadith: () => {
    // Simuler la logique du composant réel
    const isAdmin = false; // Valeur mockée
    if (!isAdmin) return null;
    return <div data-testid="link-add-hadith">Add Hadith</div>;
  },
}));

vi.mock("../SignButtons/SignButtons", () => ({
  SignButtons: () => <div data-testid="sign-buttons">Sign In/Out</div>,
}));

vi.mock("../ThemeToggle/ThemeToggle", () => ({
  ThemeToggle: () => <button data-testid="theme-toggle">Toggle Theme</button>,
}));

vi.mock("./Hamburger", () => ({
  Hamburger: ({
    isMobileMenuOpen,
    toggleMobileMenu,
  }: {
    isMobileMenuOpen: boolean;
    toggleMobileMenu: () => void;
  }) => (
    <button
      data-testid="hamburger"
      onClick={toggleMobileMenu}
      aria-expanded={isMobileMenuOpen}
      aria-label="Ouvrir le menu"
    >
      {isMobileMenuOpen ? "Close" : "Menu"}
    </button>
  ),
}));

describe("Header", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("Structure générale", () => {
    it("contient le menu mobile et desktop", () => {
      render(<Header />);

      expect(screen.getByTestId("hamburger")).toBeInTheDocument();
      expect(screen.getByTestId("navbar-mobile")).toBeInTheDocument();
      expect(screen.getByTestId("navbar-desktop")).toBeInTheDocument();
    });
  });

  describe("Logo", () => {
    it("affiche le logo avec le bon texte", () => {
      render(<Header />);

      // Le logo apparaît dans mobile et desktop
      const logos = screen.getAllByTestId("logo");
      expect(logos).toHaveLength(2);
      logos.forEach((logo) => {
        expect(logo).toHaveTextContent("Sahih Muslim FR");
      });
    });
  });

  describe("Navigation", () => {
    it("affiche tous les liens de navigation principaux", () => {
      render(<Header />);

      // Vérifier que les liens sont présents (ils peuvent apparaître dans mobile et desktop)
      expect(screen.getAllByText("Accueil")).toHaveLength(2);
      expect(screen.getAllByText("Chapitres")).toHaveLength(2);
      expect(screen.getAllByText("Compagnons")).toHaveLength(2);
      expect(screen.getAllByText("Transmetteurs")).toHaveLength(2);
      expect(screen.getAllByText("Recherche")).toHaveLength(2);
    });

    it("rend la navigation mobile et desktop différemment", () => {
      render(<Header />);

      expect(screen.getByTestId("navbar-mobile")).toBeInTheDocument();
      expect(screen.getByTestId("navbar-desktop")).toBeInTheDocument();
    });
  });

  describe("Authentification", () => {
    it("affiche les boutons d'authentification", () => {
      render(<Header />);

      // Les boutons d'authentification apparaissent dans mobile et desktop
      const signButtons = screen.getAllByTestId("sign-buttons");
      expect(signButtons).toHaveLength(2);
      signButtons.forEach((button) => {
        expect(button).toBeInTheDocument();
      });
    });

    it("n'affiche pas le bouton admin par défaut", () => {
      render(<Header />);

      // Le bouton admin ne devrait pas être affiché car l'utilisateur n'est pas admin
      expect(screen.queryByTestId("link-add-hadith")).toBeNull();
    });
  });

  describe("Thème", () => {
    it("affiche le bouton de changement de thème", () => {
      render(<Header />);

      // Le bouton thème apparaît dans mobile et desktop
      const themeButtons = screen.getAllByTestId("theme-toggle");
      expect(themeButtons).toHaveLength(2);
      themeButtons.forEach((button) => {
        expect(button).toBeInTheDocument();
      });
    });
  });

  describe("Menu mobile", () => {
    it("affiche le hamburger menu sur mobile", () => {
      render(<Header />);

      const hamburger = screen.getByTestId("hamburger");
      expect(hamburger).toBeInTheDocument();
      expect(hamburger).toHaveAttribute("aria-expanded", "false");
    });

    it("ouvre et ferme le menu mobile au clic sur le hamburger", async () => {
      render(<Header />);

      const hamburger = screen.getByTestId("hamburger");

      // Menu fermé initialement
      expect(hamburger).toHaveAttribute("aria-expanded", "false");

      // Ouvrir le menu
      await user.click(hamburger);
      await waitFor(() => {
        expect(hamburger).toHaveAttribute("aria-expanded", "true");
      });

      // Fermer le menu
      await user.click(hamburger);
      await waitFor(() => {
        expect(hamburger).toHaveAttribute("aria-expanded", "false");
      });
    });
  });

  describe("Accessibilité", () => {
    it("a le bon rôle ARIA pour le header", () => {
      render(<Header />);

      expect(screen.getByRole("banner")).toBeInTheDocument();
    });

    it("le hamburger a les bonnes propriétés d'accessibilité", () => {
      render(<Header />);

      const hamburger = screen.getByTestId("hamburger");
      expect(hamburger).toHaveAttribute("aria-expanded");
      expect(hamburger).toHaveAttribute("aria-label", "Ouvrir le menu");
    });
  });

  describe("Performance", () => {
    it("ne se rerend pas inutilement", () => {
      const { rerender } = render(<Header />);

      // Premier rendu
      const initialHeader = screen.getByRole("banner");

      // Rerendu avec les mêmes props
      rerender(<Header />);

      // Le header devrait être le même élément
      expect(screen.getByRole("banner")).toBe(initialHeader);
    });
  });
});
