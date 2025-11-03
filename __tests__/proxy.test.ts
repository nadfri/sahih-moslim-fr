import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Create mocks using vi.hoisted to ensure they're available before imports
const { mockNextResponseRedirect, mockNextResponseNext, mockIntlMiddleware } =
  vi.hoisted(() => {
    return {
      mockNextResponseRedirect: vi.fn(),
      mockNextResponseNext: vi.fn(),
      mockIntlMiddleware: vi.fn(),
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
      next: (init?: ResponseInit) => {
        mockNextResponseNext(init);
        return new originalModule.NextResponse(null, { status: 200, ...init });
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
};

async function getSupabaseMock(): Promise<SupabaseMockModule> {
  return (await import("@supabase/ssr")) as unknown as SupabaseMockModule;
}

vi.mock("@supabase/ssr", () => {
  let getUserResult: GetUserResult = { data: { user: null } };
  let profileResult: ProfileResult = { data: null, error: null };

  const createServerClient = () => ({
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
  });

  return {
    createServerClient,
    __setGetUserResult: (v: GetUserResult) => {
      getUserResult = v;
    },
    __setProfileResult: (v: ProfileResult) => {
      profileResult = v;
    },
    __reset: () => {
      getUserResult = { data: { user: null } };
      profileResult = { data: null, error: null };
    },
  };
});

// Mock Prisma client
type PrismaMockModule = {
  prisma: {
    profile: {
      findUnique: (args: {
        where: { id: string };
        select: { role: boolean };
      }) => Promise<{ role?: string } | null>;
    };
  };
  __reset: () => void;
  __setProfileResult: (v: { role?: string } | null) => void;
};

async function getPrismaMock(): Promise<PrismaMockModule> {
  return (await import("../prisma/prisma")) as unknown as PrismaMockModule;
}

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

// Mock updateSession
vi.mock("@/src/lib/auth/supabase/middleware", () => ({
  updateSession: vi.fn().mockImplementation(() => {
    return new Response(null, { status: 200 });
  }),
}));

describe("Middleware with next-intl", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    mockIntlMiddleware.mockReturnValue(null); // By default, intl doesn't intercept

    const supa = await getSupabaseMock();
    await supa.__reset();

    const prisma = await getPrismaMock();
    await prisma.__reset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("allows intl middleware to handle locale redirects", async () => {
    // Mock intl middleware returning a redirect response
    const intlResponse = new Response(null, {
      status: 302,
      headers: { Location: "/fr/chapters" },
    });
    mockIntlMiddleware.mockReturnValue(intlResponse);

    const req = new NextRequest(new URL("/chapters", "http://localhost:3000"));
    const result = await proxy(req);

    expect(result).toBe(intlResponse);
    expect(mockIntlMiddleware).toHaveBeenCalledWith(req);
  });

  it("allows non-protected routes after intl processing", async () => {
    mockIntlMiddleware.mockReturnValue(null); // No intl redirect needed

    const req = new NextRequest(
      new URL("/fr/chapters", "http://localhost:3000")
    );
    await proxy(req);

    expect(mockNextResponseNext).not.toHaveBeenCalled();
    // The updateSession response is returned directly for non-protected routes
  });

  it("checks authentication BEFORE intl processing for protected routes", async () => {
    // Mock intl middleware to return a redirect (to simulate locale handling)
    const intlResponse = new Response(null, {
      status: 302,
      headers: { Location: "/fr/admin" },
    });
    mockIntlMiddleware.mockReturnValue(intlResponse);

    // No user authenticated
    const supa = await getSupabaseMock();
    await supa.__setGetUserResult({ data: { user: null } });

    const req = new NextRequest(new URL("/admin", "http://localhost:3000"));
    const result = await proxy(req);

    // Should redirect to signin, NOT to intl redirect
    expect(mockNextResponseRedirect).toHaveBeenCalled();
    const redirectUrl = new URL(mockNextResponseRedirect.mock.calls[0][0]);
    expect(redirectUrl.pathname).toBe("/auth/signin");

    // Should NOT return intl response since auth failed first
    expect(result).not.toBe(intlResponse);
  });

  it("allows intl processing after successful authentication for protected routes", async () => {
    // Mock intl middleware to return a redirect (to simulate locale handling)
    const intlResponse = new Response(null, {
      status: 302,
      headers: { Location: "/fr/admin" },
    });
    mockIntlMiddleware.mockReturnValue(intlResponse);

    // User is authenticated and is admin
    const supa = await getSupabaseMock();
    await supa.__setGetUserResult({
      data: {
        user: {
          id: "admin1",
          user_metadata: { role: "admin" },
        },
      },
    });

    const req = new NextRequest(new URL("/admin", "http://localhost:3000"));
    const result = await proxy(req);

    // Should NOT redirect to signin or unauthorized
    expect(mockNextResponseRedirect).not.toHaveBeenCalled();

    // Should return intl response since auth passed
    expect(result).toBe(intlResponse);
    expect(mockIntlMiddleware).toHaveBeenCalledWith(req);
  });

  describe("Protected routes", () => {
    const protectedPaths = ["/fr/admin", "/fr/chapters/add", "/fr/sahabas/add"];

    protectedPaths.forEach((path) => {
      it(`redirects to signin when no user for ${path}`, async () => {
        mockIntlMiddleware.mockReturnValue(null);

        const supa = await getSupabaseMock();
        await supa.__setGetUserResult({ data: { user: null } });

        const req = new NextRequest(new URL(path, "http://localhost:3000"));
        await proxy(req);

        expect(mockNextResponseRedirect).toHaveBeenCalled();
        const redirectUrl = new URL(mockNextResponseRedirect.mock.calls[0][0]);
        expect(redirectUrl.pathname).toBe("/auth/signin");
        expect(redirectUrl.searchParams.get("callbackUrl")).toBe(
          req.nextUrl.href
        );
      });

      it(`redirects to unauthorized when user has no admin role for ${path}`, async () => {
        mockIntlMiddleware.mockReturnValue(null);

        const supa = await getSupabaseMock();
        await supa.__setGetUserResult({
          data: { user: { id: "user1" } },
        });

        const prisma = await getPrismaMock();
        await prisma.__setProfileResult(null); // No role in profile

        const req = new NextRequest(new URL(path, "http://localhost:3000"));
        await proxy(req);

        expect(mockNextResponseRedirect).toHaveBeenCalled();
        const redirectUrl = new URL(mockNextResponseRedirect.mock.calls[0][0]);
        expect(redirectUrl.pathname).toBe("/unauthorized");
      });

      it(`allows access when user has admin role in metadata for ${path}`, async () => {
        mockIntlMiddleware.mockReturnValue(null);

        const supa = await getSupabaseMock();
        await supa.__setGetUserResult({
          data: {
            user: {
              id: "admin1",
              user_metadata: { role: "admin" },
            },
          },
        });

        const req = new NextRequest(new URL(path, "http://localhost:3000"));
        const result = await proxy(req);

        expect(mockNextResponseRedirect).not.toHaveBeenCalled();
        // Should return the supabase response (updateSession result)
        expect(result).toBeDefined();
      });

      it(`allows access when user has ADMIN role in profile for ${path}`, async () => {
        mockIntlMiddleware.mockReturnValue(null);

        const supa = await getSupabaseMock();
        await supa.__setGetUserResult({
          data: { user: { id: "admin2" } },
        });

        const prisma = await getPrismaMock();
        await prisma.__setProfileResult({ role: "ADMIN" });

        const req = new NextRequest(new URL(path, "http://localhost:3000"));
        const result = await proxy(req);

        expect(mockNextResponseRedirect).not.toHaveBeenCalled();
        expect(result).toBeDefined();
      });
    });
  });
});
