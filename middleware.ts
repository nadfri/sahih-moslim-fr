import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { prisma } from "./prisma/prisma";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const isProtectedRoute =
    pathname.endsWith("/add") ||
    pathname.endsWith("/edit") ||
    pathname.endsWith("/admin");

  if (!isProtectedRoute) return NextResponse.next();

  // Create a NextResponse that we will return (so we can attach cookies if needed)
  const supabaseResponse = NextResponse.next({ request: req });

  // Create Supabase client, wiring cookies to the response per docs
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookiesToSet) => {
          // Attach any cookies Supabase wants to set to the response
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

  // Simple, recommended approach for Edge middleware in dev: trust the role
  // provided by Supabase user metadata. This avoids DB access and adapter
  // initialization in the Edge runtime.
  // Check role in Supabase user metadata (case-insensitive). Accept either
  // user_metadata or app_metadata if present. Middleware enforces ADMIN; server-side
  // checks (profiles table) are used as a fallback.
  const rawMetaRole = user?.user_metadata?.role ?? user?.app_metadata?.role;
  const metaRole =
    typeof rawMetaRole === "string" ? rawMetaRole.toUpperCase() : undefined;

  // If metadata indicates ADMIN, allow.
  if (metaRole === "ADMIN") {
    return supabaseResponse;
  }

  // Fallback: check profiles table via Prisma for authoritative role.
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
  // Run middleware in Node.js runtime so server-side libraries (Supabase) work.
  // This avoids Edge-runtime errors for packages that use Node APIs.
  runtime: "nodejs",
  matcher: ["/(.*)/add", "/(.*)/edit", "/admin"],
};
