import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/src/lib/auth/supabase/middleware";
import { createServerClient } from "@supabase/ssr";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";

// Create the intl middleware
const handleI18nRouting = createIntlMiddleware(routing);

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const isProtectedRoute =
    pathname.endsWith("/add") ||
    pathname.endsWith("/edit") ||
    pathname.endsWith("/admin");

  // If this is a protected route, check authentication FIRST before intl processing
  if (isProtectedRoute) {
    // Update the session (refresh tokens if needed)
    const supabaseResponse = await updateSession(req);

    // Create Supabase client for checking user authentication and role
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => req.cookies.getAll(),
          setAll: (cookiesToSet) => {
            // Apply any new cookies to the response
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Redirect if not logged in
    if (!user) {
      const signInUrl = new URL("/auth/signin", req.nextUrl.origin);
      signInUrl.searchParams.set("callbackUrl", req.nextUrl.href);
      return NextResponse.redirect(signInUrl);
    }

    // Check admin role from Supabase metadata (fast path, no DB call)
    const rawMetaRole = user?.user_metadata?.role ?? user?.app_metadata?.role;
    const metaRole =
      typeof rawMetaRole === "string" ? rawMetaRole.toUpperCase() : undefined;

    // Redirect to unauthorized if not admin
    if (metaRole !== "ADMIN") {
      const unauthorizedUrl = new URL("/unauthorized", req.nextUrl.origin);
      return NextResponse.redirect(unauthorizedUrl);
    }

    // User is authenticated and has admin role in metadata
    // Pages still perform fallback DB check for authoritative verification
  }

  // Now handle internationalization routing
  const intlResponse = handleI18nRouting(req);

  // If intl middleware returns a response, return it
  if (intlResponse) {
    return intlResponse;
  }

  // For non-protected routes, just update session and continue
  if (!isProtectedRoute) {
    const supabaseResponse = await updateSession(req);
    return supabaseResponse;
  }

  // For protected routes that passed auth check, update session and continue
  const supabaseResponse = await updateSession(req);
  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
