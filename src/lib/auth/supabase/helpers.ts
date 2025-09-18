import { prisma } from "@/prisma/prisma";
import { createClient } from "./server";

// Get the current user from Supabase auth
export async function getServerUser() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();

  const user = data.user;

  return user;
}

// Check if the current user is an admin
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

  if (
    !profile ||
    typeof profile.role !== "string" ||
    profile.role.toUpperCase() !== "ADMIN"
  ) {
    return { success: false, message: "Accès admin requis" };
  }

  return true;
}
