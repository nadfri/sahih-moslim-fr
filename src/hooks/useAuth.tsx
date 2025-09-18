"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/src/lib/auth/supabase/client";

type AuthContextType = {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// The Supabase client is created only once at the module level.
const supabase = createClient();

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  console.log({ isAdmin });

  useEffect(() => {
    // A single function to update user and role, avoiding code duplication.
    const updateUserAndRole = async (user: User | null) => {
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        setIsAdmin(data?.role === "ADMIN");
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    };

    // Immediately fetch the initial user.
    supabase.auth.getUser().then(({ data: { user } }) => {
      updateUserAndRole(user);
    });

    // Listen for auth state changes.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      updateUserAndRole(session?.user ?? null);
    });

    // Cleanup subscription on unmount.
    return () => {
      subscription.unsubscribe();
    };
  }, []); // The effect runs only once on mount.

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
