import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/src/lib/auth/supabase/middleware";
import { createServerClient } from "@supabase/ssr";
import { prisma } from "./prisma/prisma";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";

// Create the intl middleware
const handleI18nRouting = createIntlMiddleware(routing);

export async function middleware(req: NextRequest) {
  // First, handle internationalization routing
  // Await the intl middleware which may return a NextResponse (redirect/rewrite).
  const intlResponse = handleI18nRouting(req);

  // If intl middleware returns a response, return it immediately.
  if (intlResponse) return intlResponse;

  // Then, update the session (refresh tokens if needed)
  const supabaseResponse = await updateSession(req);

  const pathname = req.nextUrl.pathname;
  const isProtectedRoute =
    pathname.endsWith("/add") ||
    pathname.endsWith("/edit") ||
    pathname.endsWith("/admin");

  if (!isProtectedRoute) return supabaseResponse;

  // Create Supabase client for checking user authentication
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

  const unauthUrl = new URL("/unauthorized", req.nextUrl.origin);

  // Check role in Supabase user metadata first (faster, no DB query)
  const rawMetaRole = user?.user_metadata?.role ?? user?.app_metadata?.role;
  const metaRole =
    typeof rawMetaRole === "string" ? rawMetaRole.toUpperCase() : undefined;

  // If metadata indicates ADMIN, allow access
  if (metaRole === "ADMIN") {
    return supabaseResponse;
  }

  // Fallback: check profiles table via Prisma for authoritative role
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    if (profile?.role === "ADMIN") {
      return supabaseResponse;
    }
  } catch {
    // If Prisma fails, deny conservatively
    return NextResponse.redirect(unauthUrl);
  }

  return NextResponse.redirect(unauthUrl);
}

export const config = {
  // Run middleware in Node.js runtime so server-side libraries work properly
  runtime: "nodejs",
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
