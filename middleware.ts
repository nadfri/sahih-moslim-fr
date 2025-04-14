import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Role } from "@prisma/client"; // Import Role enum from Prisma
import { getToken } from "next-auth/jwt";

// --- Assurez-vous que NEXTAUTH_SECRET est défini dans vos .env ---
const secret = process.env.AUTH_SECRET;

export async function middleware(req: NextRequest) {
  console.log(`--- AUTH CHECK VIA getToken POUR: ${req.nextUrl.pathname} ---`);

  // Récupère le token JWT SANS utiliser l'adapter Prisma
  // The token might contain user details including the role if configured in callbacks
  const token = await getToken({ req, secret });

  console.log(`   Token récupéré:`, token);

  const pathname = req.nextUrl.pathname;
  const isProtectedRoute =
    pathname.endsWith("/add") || pathname.endsWith("/edit");

  if (isProtectedRoute) {
    if (!token) {
      console.log(
        "   PAS de token trouvé (non connecté). Préparation de la redirection vers signin..."
      );
      const signInUrl = new URL("/auth/signin", req.nextUrl.origin); // Use standard signin path
      signInUrl.searchParams.set("callbackUrl", req.nextUrl.href);
      console.log(`   Redirection vers: ${signInUrl.toString()}`);
      return NextResponse.redirect(signInUrl);
    } else {
      // Check if the user has the ADMIN role
      // Note: Ensure the 'role' is included in the JWT token via callbacks in auth.ts
      if (token.role !== Role.ADMIN) {
        console.log(
          `   Token trouvé mais rôle insuffisant (${token.role}). Redirection vers la page d'accueil.`
        );
        const homeUrl = new URL("/unauthorized", req.nextUrl.origin);
        // Optionally add an error query parameter for the home page to display a message
        // homeUrl.searchParams.set("error", "unauthorized");
        return NextResponse.redirect(homeUrl); // Redirect to home or an unauthorized page
      }
      console.log("   Token trouvé et rôle ADMIN confirmé. Accès autorisé.");
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
