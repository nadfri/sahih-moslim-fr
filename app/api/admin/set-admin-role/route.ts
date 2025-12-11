/**
 * POST /api/admin/set-admin-role
 *
 * PROTECTED ROUTE - Admin only
 *
 * Promotes a user to admin by setting their user_metadata.role to "admin" in Supabase.
 *
 * Security:
 * - Requires authentication (401 if not logged in)
 * - Requires admin role (403 if not admin)
 * - Only admins can promote other users
 *
 * Usage:
 * const body = { userId: "user-id-to-promote" };
 * const response = await fetch("/api/admin/set-admin-role", {
 *   method: "POST",
 *   headers: { "Content-Type": "application/json" },
 *   body: JSON.stringify(body),
 * });
 *
 * PowerShell example:
 * $body = @{ userId = "user-id-here" } | ConvertTo-Json
 * Invoke-WebRequest -Uri "http://localhost:3000/api/admin/set-admin-role" `
 *   -Method POST -ContentType "application/json" -Body $body
 *
 * Response:
 * - 200: { success: true, message: "...", user: {...} }
 * - 400: { error: "Missing userId" | "..." }
 * - 401: { error: "Not authenticated" }
 * - 403: { error: "Admin access required" }
 * - 500: { error: "..." }
 */

import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(req: NextRequest) {
  try {
    // Step 1: Verify the user is authenticated
    const supabaseAuth = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => req.cookies.getAll(),
          setAll: () => {},
        },
      }
    );

    const {
      data: { user: currentUser },
    } = await supabaseAuth.auth.getUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Step 2: Verify the user is admin
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", currentUser.id)
      .maybeSingle();

    const isAdmin =
      profile &&
      typeof profile.role === "string" &&
      profile.role.toUpperCase() === "ADMIN";

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Step 3: Get the userId to promote
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Step 4: Update the user's metadata (only admin can do this)
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      {
        user_metadata: { role: "admin" },
      }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { success: true, message: "User role updated to admin", user: data.user },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
