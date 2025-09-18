import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import type { User } from "@supabase/supabase-js";

// Mock Supabase client with inline mocks
const mockGetUser = vi.fn();
const mockOnAuthStateChange = vi.fn();
const mockFrom = vi.fn();

vi.mock("@/src/lib/auth/supabase/client", () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: mockGetUser,
      onAuthStateChange: mockOnAuthStateChange,
    },
    from: mockFrom,
  })),
}));

// Mock Next.js navigation to avoid conflicts with global setup
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => ({
    get: () => null,
  }),
  useParams: () => ({}),
}));

describe("useAuth / AuthProvider", () => {
  let AuthProvider: React.ComponentType<{ children: React.ReactNode }>;
  let useAuth: () => { user: User | null; isAdmin: boolean; loading: boolean };

  beforeAll(async () => {
    // Import the hook after mocks are set up
    const authModule = await import("@/src/hooks/useAuth");
    AuthProvider = authModule.AuthProvider;
    useAuth = authModule.useAuth;
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws when used outside of AuthProvider", () => {
    function Consumer() {
      useAuth();
      return <div>ok</div>;
    }

    expect(() => render(<Consumer />)).toThrow(
      /useAuth must be used within an AuthProvider/
    );
  });

  it("provides context with user, isAdmin, and loading states", async () => {
    // Mock getUser to return a user
    const mockUser = { id: "123", email: "test@example.com" };
    mockGetUser.mockResolvedValue({ data: { user: mockUser } });

    // Mock onAuthStateChange
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });

    // Mock profiles query for admin role
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: { role: "ADMIN" } }),
        }),
      }),
    });

    function Consumer() {
      const auth = useAuth();
      return (
        <div>
          <span data-testid="loading">{String(auth.loading)}</span>
          <span data-testid="user">
            {auth.user ? auth.user.email : "no user"}
          </span>
          <span data-testid="isAdmin">{String(auth.isAdmin)}</span>
        </div>
      );
    }

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    // Initially loading
    expect(screen.getByTestId("loading").textContent).toBe("true");

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });

    // Check user and admin status
    expect(screen.getByTestId("user").textContent).toBe("test@example.com");
    expect(screen.getByTestId("isAdmin").textContent).toBe("true");
  });

  it("sets isAdmin to false when user has no admin role", async () => {
    const mockUser = { id: "123", email: "test@example.com" };
    mockGetUser.mockResolvedValue({ data: { user: mockUser } });
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });

    // Mock profiles query for non-admin role
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: { role: "USER" } }),
        }),
      }),
    });

    function Consumer() {
      const auth = useAuth();
      return (
        <div>
          <span data-testid="isAdmin">{String(auth.isAdmin)}</span>
        </div>
      );
    }

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("isAdmin").textContent).toBe("false");
    });
  });

  it("sets isAdmin to false when no user", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });

    function Consumer() {
      const auth = useAuth();
      return (
        <div>
          <span data-testid="isAdmin">{String(auth.isAdmin)}</span>
        </div>
      );
    }

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("isAdmin").textContent).toBe("false");
    });
  });
});
