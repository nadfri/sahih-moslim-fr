import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/src/lib/auth/supabase/middleware";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";

// Create the intl middleware
const handleI18nRouting = createIntlMiddleware(routing);

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const isProtectedRoute =
    pathname.endsWith("/add") ||
    pathname.endsWith("/edit") ||
    pathname.includes("/admin");

  // Step 1: Handle internationalization routing first (next-intl pattern)
  let response = handleI18nRouting(req);

  // Step 2: Early return if i18n middleware already handled redirect (307/308)
  if (response && (response.status === 307 || response.status === 308)) {
    return response;
  }

  // Step 3: Update session and get Supabase client + user
  const {
    supabase,
    response: updatedResponse,
    user,
  } = await updateSession(req, response);
  response = updatedResponse;

  // Step 4: Check authentication for protected routes
  if (isProtectedRoute) {
    // Redirect if not logged in
    if (!user) {
      const signInUrl = new URL("/auth/signin", req.nextUrl.origin);
      signInUrl.searchParams.set("callbackUrl", req.nextUrl.href);
      return NextResponse.redirect(signInUrl);
    }

    // Check admin role from metadata (fast path)
    const rawMetaRole = user?.user_metadata?.role ?? user?.app_metadata?.role;
    const metaRole =
      typeof rawMetaRole === "string" ? rawMetaRole.toUpperCase() : undefined;

    let isAdmin = metaRole === "ADMIN";

    // Fallback: check admin role from profiles table if not in metadata
    if (!isAdmin) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (
        profile &&
        typeof profile.role === "string" &&
        profile.role.toUpperCase() === "ADMIN"
      ) {
        isAdmin = true;
      }
    }

    // Redirect to unauthorized if not admin
    if (!isAdmin) {
      const unauthorizedUrl = new URL("/unauthorized", req.nextUrl.origin);
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  // Step 5: Return the response with updated cookies
  return response;
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
