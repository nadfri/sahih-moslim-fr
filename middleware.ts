import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Role } from "@prisma/client";
import { getToken } from "next-auth/jwt";

const secret = process.env.AUTH_SECRET;

export async function middleware(req: NextRequest) {
  console.log(`--- AUTH CHECK VIA getToken POUR: ${req.nextUrl.pathname} ---`);

  const token = await getToken({ req, secret });
  // console.log(`   Token récupéré:`, token);

  const pathname = req.nextUrl.pathname;
  const isProtectedRoute =
    pathname.endsWith("/add") ||
    pathname.endsWith("/edit") ||
    pathname.endsWith("/admin") ||
    pathname.includes("/api/hadiths"); // This covers /api/hadiths/add, etc.

  // In production, block access to protected routes and return 404
  if (process.env.NODE_ENV === "production") {
    if (isProtectedRoute) {
      console.log(
        `   [PROD] Accès bloqué à la route protégée: ${pathname}. Rewrite vers /404.`
      );
      // Rewrite vers la page 404 de Next.js (affiche la vraie page 404 custom)
      return NextResponse.rewrite(new URL("/404", req.nextUrl.origin), {
        status: 404,
      });
    }
  } else {
    // In development or other environments, apply existing auth logic
    if (isProtectedRoute) {
      if (!token) {
        console.log(
          "   PAS de token trouvé (non connecté). Préparation de la redirection vers signin..."
        );
        const signInUrl = new URL("/auth/signin", req.nextUrl.origin);
        signInUrl.searchParams.set("callbackUrl", req.nextUrl.href);
        console.log(`   Redirection vers: ${signInUrl.toString()}`);
        return NextResponse.redirect(signInUrl);
      } else {
        if (token.role !== Role.ADMIN) {
          console.log(
            `   Token trouvé mais rôle insuffisant (${token.role}). Redirection vers la page non autorisée.`
          );
          const unauthorizedUrl = new URL("/unauthorized", req.nextUrl.origin);
          return NextResponse.redirect(unauthorizedUrl);
        }
        console.log(
          "   [DEV] Token trouvé et rôle ADMIN confirmé. Accès autorisé."
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/(.*)/add", "/(.*)/edit", "/admin", "/api/hadiths/:path*"],
};
