import { NextRequest } from "next/server"; // NextResponseInit removed
import { Role } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { middleware } from "../middleware";

// Mock next-auth/jwt
vi.mock("next-auth/jwt", () => ({
  getToken: vi.fn(),
}));

// Mock NextResponse static methods
const mockNextResponseRedirect = vi.fn();
const mockNextResponseNext = vi.fn();

vi.mock("next/server", async (importOriginal) => {
  const originalModule = await importOriginal<typeof import("next/server")>();
  // Only mock the static methods, keep the original constructor
  return {
    ...originalModule,
    NextResponse: Object.assign(originalModule.NextResponse, {
      redirect: (url: URL | string, init?: number | ResponseInit) => {
        mockNextResponseRedirect(url, init);
        return new originalModule.NextResponse(null, {
          status: typeof init === "number" ? init : (init?.status ?? 302),
          headers: {
            Location: url.toString(),
            ...(typeof init === "object" && init !== null && init.headers
              ? init.headers
              : {}),
          },
        });
      },
      next: (init?: ResponseInit) => {
        mockNextResponseNext(init);
        return new originalModule.NextResponse(null, { status: 200, ...init });
      },
    }),
  };
});

const PROTECTED_PATHS = ["/admin", "/chapters/add", "/api/hadiths/some-id"];
const NON_PROTECTED_PATH = "/public/some-page";

describe("Middleware", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Suppress console.log from middleware during tests
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs(); // Restore original environment variables
    vi.restoreAllMocks();
  });

  describe("Production Environment (NODE_ENV=production)", () => {
    beforeEach(() => {
      vi.stubEnv("NODE_ENV", "production"); // Use vi.stubEnv to set NODE_ENV
    });

    PROTECTED_PATHS.forEach((path) => {
      it(`should return 404 for protected route ${path}`, async () => {
        const req = new NextRequest(new URL(path, "http://localhost:3000"));
        const response = await middleware(req);
        expect(response.status).toBe(404);
        // Ensure no redirect or next was called
        expect(mockNextResponseRedirect).not.toHaveBeenCalled();
        expect(mockNextResponseNext).not.toHaveBeenCalled();
      });
    });

    it(`should allow access to non-protected route ${NON_PROTECTED_PATH}`, async () => {
      const req = new NextRequest(
        new URL(NON_PROTECTED_PATH, "http://localhost:3000")
      );
      await middleware(req);
      expect(mockNextResponseNext).toHaveBeenCalled();
      expect(mockNextResponseRedirect).not.toHaveBeenCalled();
    });
  });

  describe("Development Environment (NODE_ENV=development)", () => {
    beforeEach(() => {
      vi.stubEnv("NODE_ENV", "development"); // Use vi.stubEnv to set NODE_ENV
    });

    PROTECTED_PATHS.forEach((path) => {
      it(`should redirect to signin for ${path} if no token`, async () => {
        (getToken as import("vitest").Mock).mockResolvedValue(null); // Use import('vitest').Mock for explicit typing
        const req = new NextRequest(new URL(path, "http://localhost:3000"));
        await middleware(req);

        expect(mockNextResponseRedirect).toHaveBeenCalled();
        const redirectUrl = new URL(mockNextResponseRedirect.mock.calls[0][0]);
        expect(redirectUrl.pathname).toBe("/auth/signin");
        expect(redirectUrl.searchParams.get("callbackUrl")).toBe(
          req.nextUrl.href
        );
        expect(mockNextResponseNext).not.toHaveBeenCalled();
      });

      it(`should redirect to /unauthorized for ${path} if token has no ADMIN role`, async () => {
        (getToken as import("vitest").Mock).mockResolvedValue({
          role: Role.USER,
        }); // Use import('vitest').Mock
        const req = new NextRequest(new URL(path, "http://localhost:3000"));
        await middleware(req);

        expect(mockNextResponseRedirect).toHaveBeenCalled();
        const redirectUrl = new URL(mockNextResponseRedirect.mock.calls[0][0]);
        expect(redirectUrl.pathname).toBe("/unauthorized");
        expect(mockNextResponseNext).not.toHaveBeenCalled();
      });

      it(`should allow access for ${path} if token has ADMIN role`, async () => {
        (getToken as import("vitest").Mock).mockResolvedValue({
          role: Role.ADMIN,
        }); // Use import('vitest').Mock
        const req = new NextRequest(new URL(path, "http://localhost:3000"));
        await middleware(req);

        expect(mockNextResponseNext).toHaveBeenCalled();
        expect(mockNextResponseRedirect).not.toHaveBeenCalled();
      });
    });

    it(`should allow access to non-protected route ${NON_PROTECTED_PATH}`, async () => {
      const req = new NextRequest(
        new URL(NON_PROTECTED_PATH, "http://localhost:3000")
      );
      await middleware(req);
      expect(mockNextResponseNext).toHaveBeenCalled();
      expect(mockNextResponseRedirect).not.toHaveBeenCalled();
    });
  });
});
