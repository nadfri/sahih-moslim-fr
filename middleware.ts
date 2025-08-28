import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const isProtectedRoute =
    pathname.endsWith("/add") ||
    pathname.endsWith("/edit") ||
    pathname.endsWith("/admin");

  if (!isProtectedRoute) return NextResponse.next();

  // Create Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: () => {}, // Read-only in middleware
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
    return NextResponse.next();
  }

  // Fallback: metadata didn't provide ADMIN. Query the public `profiles`
  // table via Supabase (PostgREST) to determine the user's application role.
  // This avoids importing Prisma in the Edge runtime and is safe here.
  try {
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      // Can't validate role — treat as unauthorized
      return NextResponse.redirect(unauthUrl);
    }

    if (
      typeof profileData?.role === "string" &&
      profileData.role.toUpperCase() === "ADMIN"
    ) {
      return NextResponse.next();
    }
  } catch {
    // Any unexpected error — deny access conservatively
    return NextResponse.redirect(unauthUrl);
  }

  return NextResponse.redirect(unauthUrl);
}

export const config = {
  matcher: ["/(.*)/add", "/(.*)/edit", "/admin"],
};
