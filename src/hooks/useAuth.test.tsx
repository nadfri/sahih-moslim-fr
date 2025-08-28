import { describe, expect, it, vi } from "vitest";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";

// Hoist-safe mock for the Supabase client used by AuthProvider
vi.mock("@/src/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      getSession: async () => ({ data: { session: null } }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
      signInWithOAuth: async () => ({ error: null }),
      signOut: async () => ({ error: null }),
    },
  }),
}));

// Mock the Next.js router used inside AuthProvider
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: () => {} }),
}));

import { AuthProvider, useAuth } from "@/src/hooks/useAuth";

describe("useAuth / AuthProvider (smoke)", () => {
  it("throws when used outside of AuthProvider", () => {
    // Component that uses the hook directly
    function Consumer() {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore need to call hook to verify throw
      useAuth();
      return React.createElement("div", null, "ok");
    }

    expect(() => render(React.createElement(Consumer))).toThrow(
      /useAuth must be used within an AuthProvider/
    );
  });

  it("provides context with basic API when wrapped by AuthProvider", async () => {
    function Consumer() {
      const auth = useAuth();
      // Render something predictable so we can assert later
      return (
        <div>
          <span data-testid="loading">{String(auth.loading)}</span>
          <button onClick={() => auth.signOut()}>signout</button>
        </div>
      );
    }

    render(
      React.createElement(AuthProvider, null, React.createElement(Consumer))
    );

    // wait for the provider effect to run and set loading -> false
    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });
  });
});
