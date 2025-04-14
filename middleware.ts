import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// --- Assurez-vous que NEXTAUTH_SECRET est défini dans vos .env ---
const secret = process.env.AUTH_SECRET;

export async function middleware(req: NextRequest) {
  console.log(`--- AUTH CHECK VIA getToken POUR: ${req.nextUrl.pathname} ---`);

  // Récupère le token JWT SANS utiliser l'adapter Prisma
  const token = await getToken({ req, secret });

  console.log(`   Token récupéré:`, token);

  const pathname = req.nextUrl.pathname;
  const isProtectedRoute =
    pathname.endsWith("/add") || pathname.endsWith("/edit");

  if (isProtectedRoute) {
    if (!token) {
      console.log(
        "   PAS de token trouvé (non connecté). Préparation de la redirection..."
      );
      const signInUrl = new URL("auth/signin", req.nextUrl.origin);
      signInUrl.searchParams.set("callbackUrl", req.nextUrl.href);
      console.log(`   Redirection vers: ${signInUrl.toString()}`);
      return NextResponse.redirect(signInUrl);
    } else {
      console.log("   Token trouvé. Accès autorisé à la route protégée.");
    }
  } else {
    console.log("   Route non protégée.");
  }

  console.log("   Middleware terminé. Passage à next().");
  return NextResponse.next();
}

export const config = {
  matcher: ["/(.*)/add", "/(.*)/edit"],
};
