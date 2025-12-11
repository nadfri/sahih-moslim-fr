import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Type for mock UpdateSession return value - more flexible than actual type
type MockUpdateSessionReturn = {
  supabase: Record<string, unknown> | null;
  response: Response;
  user: {
    id: string;
    user_metadata?: Record<string, unknown>;
    app_metadata?: Record<string, unknown>;
  } | null;
};

// Create mocks using vi.hoisted to ensure they're available before imports
const { mockNextResponseRedirect, mockIntlMiddleware, mockUpdateSession } =
  vi.hoisted(() => {
    return {
      mockNextResponseRedirect: vi.fn(),
      mockIntlMiddleware: vi.fn(),
      mockUpdateSession: vi.fn(
        (): MockUpdateSessionReturn => ({
          supabase: null,
          response: new Response(null, { status: 200 }),
          user: null,
        })
      ),
    };
  });

// Mock NextResponse static methods
vi.mock("next/server", async (importOriginal) => {
  const originalModule = await importOriginal<typeof import("next/server")>();
  return {
    ...originalModule,
    NextResponse: Object.assign(originalModule.NextResponse, {
      redirect: (url: URL | string, init?: number | ResponseInit) => {
        mockNextResponseRedirect(url, init);
        return new originalModule.NextResponse(null, {
          status: typeof init === "number" ? init : (init?.status ?? 302),
          headers: { Location: typeof url === "string" ? url : url.toString() },
        });
      },
    }),
  };
});

// Mock next-intl/middleware
vi.mock("next-intl/middleware", () => {
  return {
    default: () => mockIntlMiddleware,
  };
});

// Import proxy after mocks are set up
import { proxy } from "../proxy";

// Mock Supabase client
type GetUserResult = {
  data: {
    user: null | {
      id: string;
      user_metadata?: Record<string, unknown>;
      app_metadata?: Record<string, unknown>;
    };
  };
};

type ProfileResult = { data: { role?: string } | null; error: unknown };

type SupabaseMockModule = {
  __reset: () => void;
  __setGetUserResult: (v: GetUserResult) => void;
  __setProfileResult: (v: ProfileResult) => void;
  __getCreateServerClient: () => Record<string, unknown>;
};

async function getSupabaseMock(): Promise<SupabaseMockModule> {
  return (await import("@supabase/ssr")) as unknown as SupabaseMockModule;
}

vi.mock("@supabase/ssr", () => {
  let getUserResult: GetUserResult = { data: { user: null } };
  let profileResult: ProfileResult = { data: null, error: null };

  const supabaseClient = {
    auth: {
      getUser: async () => getUserResult,
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => profileResult,
        }),
      }),
    }),
  };

  const createServerClient = () => supabaseClient;

  return {
    createServerClient,
    __setGetUserResult: (v: GetUserResult) => {
      getUserResult = v;
    },
    __setProfileResult: (v: ProfileResult) => {
      profileResult = v;
    },
    __getCreateServerClient: () => createServerClient,
    __reset: () => {
      getUserResult = { data: { user: null } };
      profileResult = { data: null, error: null };
    },
  };
});

// Mock Prisma client - not used by proxy anymore, but kept for testing
vi.mock("../prisma/prisma", () => {
  let profileResult: { role?: string } | null = null;

  const prisma = {
    profile: {
      findUnique: async () => profileResult,
    },
  };

  return {
    prisma,
    __setProfileResult: (v: { role?: string } | null) => {
      profileResult = v;
    },
    __reset: () => {
      profileResult = null;
    },
  };
});

// Mock updateSession (already defined in vi.hoisted above)
vi.mock("@/src/lib/auth/supabase/middleware", () => ({
  updateSession: mockUpdateSession,
}));

describe("Middleware with next-intl", () => {
  beforeEach(async () => {
    // Reset all mocks
    mockIntlMiddleware.mockReturnValue(null);
    mockNextResponseRedirect.mockReset();
    mockUpdateSession.mockReset();

    const supa = await getSupabaseMock();
    supa.__reset();

    // Setup default updateSession mock with empty user
    mockUpdateSession.mockImplementation(
      (): MockUpdateSessionReturn => ({
        supabase: null,
        response: new Response(null, { status: 200 }),
        user: null,
      })
    );
  });

  afterEach(() => {
    mockIntlMiddleware.mockReset();
    mockNextResponseRedirect.mockReset();
    mockUpdateSession.mockReset();
  });

  it("allows intl middleware to handle locale redirects", async () => {
    // Mock intl middleware returning a redirect response
    const intlResponse = new Response(null, {
      status: 307,
      headers: { Location: "/fr/chapters" },
    });
    mockIntlMiddleware.mockReturnValue(intlResponse);

    mockUpdateSession.mockImplementation(() => ({
      supabase: null,
      response: intlResponse,
      user: null,
    }));

    const req = new NextRequest(new URL("/chapters", "http://localhost:3000"));
    const result = await proxy(req);

    // Should return the intl redirect (307/308) early
    expect(result).toBe(intlResponse);
    expect(mockIntlMiddleware).toHaveBeenCalledWith(req);
  });

  it("allows non-protected routes after intl processing", async () => {
    mockIntlMiddleware.mockReturnValue(null); // No intl redirect needed

    mockUpdateSession.mockImplementation(() => ({
      supabase: null,
      response: new Response(null, { status: 200 }),
      user: null,
    }));

    const req = new NextRequest(
      new URL("/fr/chapters", "http://localhost:3000")
    );
    const result = await proxy(req);

    // Should return the updateSession response for non-protected routes
    expect(result).toBeDefined();
    expect(result.status).toBe(200);
  });

  it("checks authentication for protected routes - redirects to signin when no user", async () => {
    // Mock intl middleware returning null (no redirect needed)
    mockIntlMiddleware.mockReturnValue(null);

    // No user authenticated
    mockUpdateSession.mockImplementation(
      (): MockUpdateSessionReturn => ({
        supabase: null,
        response: new Response(null, { status: 200 }),
        user: null,
      })
    );

    const req = new NextRequest(new URL("/admin", "http://localhost:3000"));
    await proxy(req);

    // Should redirect to signin
    expect(mockNextResponseRedirect).toHaveBeenCalled();
    const redirectUrl = new URL(mockNextResponseRedirect.mock.calls[0][0]);
    expect(redirectUrl.pathname).toBe("/auth/signin");
  });

  it("allows intl processing after successful authentication for protected routes", async () => {
    // Mock intl middleware to return a normal response (no 307/308 redirect)
    const normalResponse = new Response(null, {
      status: 200,
    });
    mockIntlMiddleware.mockReturnValue(normalResponse);

    // User is authenticated AND has ADMIN role in metadata
    const mockSupabaseClient = {
      auth: { getUser: async () => ({}) },
      from: () => ({
        select: () => ({
          eq: () => ({ maybeSingle: async () => ({ data: null }) }),
        }),
      }),
    };

    mockUpdateSession.mockImplementation(() => ({
      supabase: mockSupabaseClient,
      response: normalResponse,
      user: {
        id: "user1",
        user_metadata: { role: "admin" },
      },
    }));

    const req = new NextRequest(new URL("/admin", "http://localhost:3000"));
    await proxy(req);

    // Should NOT redirect to signin or unauthorized
    expect(mockNextResponseRedirect).not.toHaveBeenCalled();
  });

  describe("Protected routes - 3 main cases", () => {
    const protectedPaths = ["/fr/admin", "/fr/chapters/add", "/fr/sahabas/add"];

    protectedPaths.forEach((path) => {
      describe(`For path: ${path}`, () => {
        it("Case 1: Not authenticated - redirects to signin", async () => {
          mockIntlMiddleware.mockReturnValue(null);
          mockNextResponseRedirect.mockClear();

          // No user
          mockUpdateSession.mockImplementation(() => ({
            supabase: null,
            response: new Response(null, { status: 200 }),
            user: null,
          }));

          const req = new NextRequest(new URL(path, "http://localhost:3000"));
          await proxy(req);

          expect(mockNextResponseRedirect).toHaveBeenCalled();
          const redirectUrl = new URL(
            mockNextResponseRedirect.mock.calls[0][0]
          );
          expect(redirectUrl.pathname).toBe("/auth/signin");
        });

        it("Case 2: Authenticated but NOT admin - redirects to unauthorized", async () => {
          mockIntlMiddleware.mockReturnValue(null);
          mockNextResponseRedirect.mockClear();

          // User exists but no admin role
          const mockSupabaseClient = {
            auth: { getUser: async () => ({}) },
            from: () => ({
              select: () => ({
                eq: () => ({
                  maybeSingle: async () => ({ data: null }),
                }),
              }),
            }),
          };

          mockUpdateSession.mockImplementation(() => ({
            supabase: mockSupabaseClient,
            response: new Response(null, { status: 200 }),
            user: {
              id: "user1",
              user_metadata: {},
            },
          }));

          const req = new NextRequest(new URL(path, "http://localhost:3000"));
          await proxy(req);

          expect(mockNextResponseRedirect).toHaveBeenCalled();
          const redirectUrl = new URL(
            mockNextResponseRedirect.mock.calls[0][0]
          );
          expect(redirectUrl.pathname).toBe("/unauthorized");
        });

        it("Case 3: Authenticated AND admin (metadata) - allows access", async () => {
          mockIntlMiddleware.mockReturnValue(null);
          mockNextResponseRedirect.mockClear();

          // User is admin with metadata
          const mockSupabaseClient = {
            auth: { getUser: async () => ({}) },
            from: () => ({
              select: () => ({
                eq: () => ({
                  maybeSingle: async () => ({ data: null }),
                }),
              }),
            }),
          };

          mockUpdateSession.mockImplementation(() => ({
            supabase: mockSupabaseClient,
            response: new Response(null, { status: 200 }),
            user: {
              id: "admin1",
              user_metadata: { role: "admin" },
            },
          }));

          const req = new NextRequest(new URL(path, "http://localhost:3000"));
          const result = await proxy(req);

          // Should not redirect to unauthorized
          const unauthorizedCalls = mockNextResponseRedirect.mock.calls.filter(
            (call) => String(call[0]).includes("/unauthorized")
          );
          expect(unauthorizedCalls).toHaveLength(0);
          expect(result).toBeDefined();
        });

        it("Case 3b: Authenticated AND admin (app_metadata) - allows access", async () => {
          mockIntlMiddleware.mockReturnValue(null);
          mockNextResponseRedirect.mockClear();

          // User is admin with app_metadata
          const mockSupabaseClient = {
            auth: { getUser: async () => ({}) },
            from: () => ({
              select: () => ({
                eq: () => ({
                  maybeSingle: async () => ({ data: null }),
                }),
              }),
            }),
          };

          mockUpdateSession.mockImplementation(() => ({
            supabase: mockSupabaseClient,
            response: new Response(null, { status: 200 }),
            user: {
              id: "admin2",
              app_metadata: { role: "ADMIN" },
            },
          }));

          const req = new NextRequest(new URL(path, "http://localhost:3000"));
          const result = await proxy(req);

          // Should not redirect to unauthorized
          const unauthorizedCalls = mockNextResponseRedirect.mock.calls.filter(
            (call) => String(call[0]).includes("/unauthorized")
          );
          expect(unauthorizedCalls).toHaveLength(0);
          expect(result).toBeDefined();
        });

        it("Case 3c: Authenticated AND admin (profiles DB) - allows access", async () => {
          mockIntlMiddleware.mockReturnValue(null);
          mockNextResponseRedirect.mockClear();

          // User is admin via database fallback
          const mockSupabaseClient = {
            auth: { getUser: async () => ({}) },
            from: () => ({
              select: () => ({
                eq: () => ({
                  maybeSingle: async () => ({ data: { role: "admin" } }),
                }),
              }),
            }),
          };

          mockUpdateSession.mockImplementation(() => ({
            supabase: mockSupabaseClient,
            response: new Response(null, { status: 200 }),
            user: {
              id: "admin3",
              user_metadata: {},
            },
          }));

          const req = new NextRequest(new URL(path, "http://localhost:3000"));
          const result = await proxy(req);

          // Should not redirect to unauthorized
          const unauthorizedCalls = mockNextResponseRedirect.mock.calls.filter(
            (call) => String(call[0]).includes("/unauthorized")
          );
          expect(unauthorizedCalls).toHaveLength(0);
          expect(result).toBeDefined();
        });
      });
    });
  });
});
