import { NextResponse } from "next/server";

import { createClient } from "@/src/lib/auth/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.session) {
      // Ensure next is a relative path (not absolute URL) for security
      let redirectPath = next;
      if (next.startsWith("http")) {
        try {
          const nextUrl = new URL(next);
          // Only allow redirects to the same origin for security
          if (nextUrl.origin === origin) {
            redirectPath = nextUrl.pathname + nextUrl.search;
          } else {
            redirectPath = "/";
          }
        } catch {
          // Invalid URL, fallback to home
          redirectPath = "/";
        }
      }

      return NextResponse.redirect(`${origin}${redirectPath}`);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/error`);
}
