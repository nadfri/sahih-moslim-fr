import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock NextResponse
const mockRedirect = vi.fn();
vi.mock("next/server", () => ({
  NextResponse: {
    redirect: mockRedirect,
  },
}));

// Mock createClient
const mockExchangeCodeForSession = vi.fn();
vi.mock("@/src/lib/auth/supabase/server", () => ({
  createClient: () => ({
    auth: {
      exchangeCodeForSession: mockExchangeCodeForSession,
    },
  }),
}));

describe("Auth Callback Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should redirect to the correct path after successful authentication", async () => {
    // Mock successful session exchange
    mockExchangeCodeForSession.mockResolvedValue({
      data: { session: { user: { id: "123" } } },
      error: null,
    });

    // Import the route handler after mocks are set up
    const { GET } = await import("@/app/auth/callback/route");

    // Create a mock request with next parameter
    const mockRequest = {
      url: "http://localhost:3000/auth/callback?code=test-code&next=%2Fadmin",
      nextUrl: new URL(
        "http://localhost:3000/auth/callback?code=test-code&next=%2Fadmin"
      ),
    } as unknown as Request;

    await GET(mockRequest);

    // Verify that redirect was called with the correct path
    expect(mockRedirect).toHaveBeenCalledWith("http://localhost:3000/admin");
  });
});
