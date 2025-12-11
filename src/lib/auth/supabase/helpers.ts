import prisma from "@/prisma/prisma";
import { redirect } from "next/navigation";
import { createClient } from "./server";

// Get the current user from Supabase auth
export async function getServerUser() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();

  const user = data.user;

  return user;
}

// Check if the current user is an admin (returns true/false or error object)
export async function requireAdmin() {
  const user = await getServerUser();
  if (!user) {
    return { success: false, message: "Connexion requise" };
  }

  // First, check admin role from Supabase metadata (fast path)
  const rawMetaRole = user?.user_metadata?.role ?? user?.app_metadata?.role;
  const metaRole =
    typeof rawMetaRole === "string" ? rawMetaRole.toUpperCase() : undefined;

  if (metaRole === "ADMIN") {
    return true;
  }

  // Fallback: check admin role from database (authoritative source)
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    if (
      profile &&
      typeof profile.role === "string" &&
      profile.role.toUpperCase() === "ADMIN"
    ) {
      return true;
    }
  } catch (error) {
    console.error("[requireAdmin] Database check failed:", error);
  }

  return { success: false, message: "Accès admin requis" };
}

// Enforce admin access at page level - throws redirect if not admin
export async function enforceAdminAccess() {
  const adminCheck = await requireAdmin();
  if (adminCheck !== true) {
    redirect("/unauthorized");
  }
}
