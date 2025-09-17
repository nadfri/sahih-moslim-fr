"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/src/lib/auth/supabase/client";

type Profile = {
  id: string;
  email: string | null;
  name: string | null;
  image: string | null;
  role: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
};

type AuthContextType = {
  user: User | null;
  isAdmin: boolean;
  profile: Profile | null;
  loading: boolean;
  signInWithGitHub: (callbackUrl?: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  // Sync session on client: mount, wake from sleep, auth event
  useEffect(() => {
    let isMounted = true; // to avoid state update if unmounted

    const fetchOrCreateProfile = async (userId: string) => {
      if (!isMounted) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .maybeSingle();

        if (!isMounted) return;

        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }

        if (!data) {
          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert({ id: userId, role: "USER" }) // minimal profile
            .select()
            .maybeSingle();

          if (!isMounted) return;

          if (createError) {
            console.error("Error creating profile:", createError);
            return;
          }
          setProfile(newProfile ?? null);
        } else {
          setProfile(data ?? null);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Unexpected profile error:", err);
        }
      }
    };

    const syncSession = async () => {
      setLoading(true);
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (!isMounted) return;

        if (error) {
          // Only log unexpected errors, not AuthSessionMissingError (normal when not logged in)
          if (
            !error.message ||
            !error.message.includes("Auth session missing")
          ) {
            console.error("Error syncing session:", error);
          }
          setUser(null);
          setProfile(null);
        } else {
          setUser(user ?? null);
          if (user) {
            await fetchOrCreateProfile(user.id);
          } else {
            setProfile(null);
          }
        }
      } catch (err) {
        console.error("Unexpected error syncing session:", err);
        setUser(null);
        setProfile(null);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    syncSession(); // au montage

    // Update on Supabase auth state change
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchOrCreateProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    // Manual refresh on wake from sleep or tab focus
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        syncSession();
      }
    };
    window.addEventListener("visibilitychange", handleVisibility);

    return () => {
      isMounted = false;
      window.removeEventListener("visibilitychange", handleVisibility);
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signInWithGitHub = async (callbackUrl?: string) => {
    try {
      const nextParam = callbackUrl
        ? new URL(callbackUrl).pathname + new URL(callbackUrl).search
        : "/";
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextParam)}`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: { redirectTo },
      });
      if (error) {
        console.error("Error signing in with GitHub:", error);
      }
    } catch (error) {
      console.error("Error signing in with GitHub:", error);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
        return;
      }
      setUser(null);
      setProfile(null);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const isAdmin = profile?.role === "ADMIN";

  const value = {
    user,
    isAdmin,
    profile,
    loading,
    signInWithGitHub,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
