import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { prisma } from "@/prisma/prisma";

// Simple server auth helper
export async function getServerUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookies) => {
          try {
            cookies.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server component - ignore
          }
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// Simple admin check for actions/API
export async function requireAdmin() {
  const user = await getServerUser();
  if (!user) {
    return { success: false, message: "Connexion requise" };
  }

  // Check admin role from database
  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  if (profile?.role !== "ADMIN") {
    return { success: false, message: "Accès admin requis" };
  }

  return true;
}
