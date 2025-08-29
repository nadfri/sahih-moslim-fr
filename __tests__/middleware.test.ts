import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { middleware } from "../middleware";

// Mock NextResponse static methods so we can observe redirect/next calls
const mockNextResponseRedirect = vi.fn();
const mockNextResponseNext = vi.fn();

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

// Hoist-safe mock factory for Supabase createServerClient.
// Exposes setters to control auth.getUser() and profiles query results.
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

// Typed accessor for our vi.mock('@supabase/ssr') hoist-safe helpers.
type SupabaseMockModule = {
  __reset: () => void | Promise<void>;
  __setGetUserResult: (v: GetUserResult) => void | Promise<void>;
  __setProfileResult: (v: ProfileResult) => void | Promise<void>;
};

async function getSupabaseMock(): Promise<SupabaseMockModule> {
  return (await import("@supabase/ssr")) as unknown as SupabaseMockModule;
}

// Hoist-safe mock factory for Prisma client used in middleware fallback
type PrismaMockModule = {
  prisma: {
    profile: {
      findUnique: (args: {
        where: { id: string };
        select: { role: boolean };
      }) => Promise<{ role?: string } | null>;
    };
  };
  __reset: () => void | Promise<void>;
  __setProfileResult: (v: { role?: string } | null) => void | Promise<void>;
};

async function getPrismaMock(): Promise<PrismaMockModule> {
  return (await import("../prisma/prisma")) as unknown as PrismaMockModule;
}

vi.mock("@supabase/ssr", () => {
  let getUserResult: GetUserResult = { data: { user: null } };
  let profileResult: ProfileResult = { data: null, error: null };

  const createServerClient = () => {
    return {
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
  };

  return {
    createServerClient,
    // test helpers exported from the mock
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

// Mock the local Prisma client used by middleware (prisma.profile.findUnique)
vi.mock("../prisma/prisma", () => {
  let profileResult: { role?: string } | null = null;

  const prisma = {
    profile: {
      findUnique: async () => {
        // return the configured profileResult (simulates Prisma result)
        return profileResult;
      },
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

const PROTECTED_PATHS = ["/admin", "/chapters/add"];
const NON_PROTECTED_PATH = "/public/some-page";

describe("Middleware (Supabase-based)", () => {
  beforeEach(async () => {
    vi.resetAllMocks();
    vi.spyOn(console, "log").mockImplementation(() => {});
    // Reset mock factory state
    const supa = await getSupabaseMock();
    await supa.__reset();
    const prismaMock = await getPrismaMock();
    await prismaMock.__reset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("allows non-protected routes", async () => {
    const req = new NextRequest(
      new URL(NON_PROTECTED_PATH, "http://localhost:3000")
    );
    await middleware(req);
    expect(mockNextResponseNext).toHaveBeenCalled();
    expect(mockNextResponseRedirect).not.toHaveBeenCalled();
  });

  PROTECTED_PATHS.forEach((path) => {
    it(`redirects to signin when no user for protected route ${path}`, async () => {
      // Ensure no user
      // test-only import
      const supa0 = await getSupabaseMock();
      await supa0.__setGetUserResult({ data: { user: null } });

      const req = new NextRequest(new URL(path, "http://localhost:3000"));
      await middleware(req);

      expect(mockNextResponseRedirect).toHaveBeenCalled();
      const redirectUrl = new URL(mockNextResponseRedirect.mock.calls[0][0]);
      expect(redirectUrl.pathname).toBe("/auth/signin");
      expect(redirectUrl.searchParams.get("callbackUrl")).toBe(
        req.nextUrl.href
      );
    });

    it(`redirects to unauthorized when user is not ADMIN (no metadata and no profile) for ${path}`, async () => {
      // user present but no metadata and profile query returns null
      // test-only import
      const supa1 = await getSupabaseMock();
      await supa1.__setGetUserResult({ data: { user: { id: "u1" } } });
      // profile returns null (no role) via prisma mock
      const prismaMock = await getPrismaMock();
      await prismaMock.__setProfileResult(null);

      const req = new NextRequest(new URL(path, "http://localhost:3000"));
      await middleware(req);

      expect(mockNextResponseRedirect).toHaveBeenCalled();
      const redirectUrl = new URL(mockNextResponseRedirect.mock.calls[0][0]);
      expect(redirectUrl.pathname).toBe("/unauthorized");
    });

    it(`allows access when user metadata contains ADMIN for ${path}`, async () => {
      // user with metadata role
      // test-only import
      const supa2 = await getSupabaseMock();
      await supa2.__setGetUserResult({
        data: { user: { id: "u2", user_metadata: { role: "admin" } } },
      });

      const req = new NextRequest(new URL(path, "http://localhost:3000"));
      await middleware(req);

      expect(mockNextResponseNext).toHaveBeenCalled();
      expect(mockNextResponseRedirect).not.toHaveBeenCalled();
    });

    it(`allows access when profile row has ADMIN role for ${path}`, async () => {
      // user without metadata, but profile query returns role ADMIN
      // test-only import
      const supa3 = await getSupabaseMock();
      await supa3.__setGetUserResult({ data: { user: { id: "u3" } } });
      const prismaMock = await getPrismaMock();
      await prismaMock.__setProfileResult({ role: "ADMIN" });

      const req = new NextRequest(new URL(path, "http://localhost:3000"));
      await middleware(req);

      expect(mockNextResponseNext).toHaveBeenCalled();
      expect(mockNextResponseRedirect).not.toHaveBeenCalled();
    });
  });
});
