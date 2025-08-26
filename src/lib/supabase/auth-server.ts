import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function getServerAuth() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return { user };
}

export async function requireAdmin() {
  const authData = await getServerAuth();

  if (!authData?.user) {
    return {
      success: false,
      message: "Non autorisé",
      error: "Connexion requise.",
    };
  }

  // Check if user has admin role in profiles table
  const { prisma } = await import("@/prisma/prisma");
  const profile = await prisma.profile.findUnique({
    where: { id: authData.user.id },
    select: { role: true },
  });

  if (!profile || profile.role !== "ADMIN") {
    return {
      success: false,
      message: "Non autorisé",
      error: "Accès administrateur requis.",
    };
  }

  // Accept role values in any case (e.g. 'admin', 'ADMIN')
  if (
    typeof profile.role !== "string" ||
    profile.role.toUpperCase() !== "ADMIN"
  ) {
    return {
      success: false,
      message: "Non autorisé",
      error: "Accès administrateur requis.",
    };
  }

  return true;
}
