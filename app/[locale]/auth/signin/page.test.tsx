import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { renderWithI18n } from "@/__tests__/renderWithI18n";

type ServerUser = {
  id: string;
};

const getServerUser = vi.fn<() => Promise<ServerUser | null>>(() =>
  Promise.resolve(null)
);
const locale = "fr" as const;

vi.mock("@/src/lib/auth/supabase/helpers", () => ({
  getServerUser,
}));

const redirectMock = vi.fn();
vi.mock("next/navigation", () => ({
  redirect: (url: string) => redirectMock(url),
}));

vi.mock("next-intl/server", () => ({
  setRequestLocale: vi.fn(),
  getTranslations: vi.fn(async () => (key: string) => key),
}));

vi.mock("@/src/ui/Header/SignButtons/ButtonGithub", () => ({
  ButtonGithub: () => <button type="button">Sign in</button>,
}));

describe("Sign-in page", () => {
  it("renders the sign-in screen when no user is present", async () => {
    const { default: SignInPage } =
      await import("@/app/[locale]/auth/signin/page");

    const ui = await SignInPage({
      params: Promise.resolve({ locale }),
      searchParams: Promise.resolve({}),
    });

    renderWithI18n(ui);

    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
  });

  it("redirects when a user is already signed in", async () => {
    getServerUser.mockResolvedValueOnce({ id: "user-1" });

    const { default: SignInPage } =
      await import("@/app/[locale]/auth/signin/page");

    await SignInPage({
      params: Promise.resolve({ locale }),
      searchParams: Promise.resolve({ callbackUrl: "/admin" }),
    });

    expect(redirectMock).toHaveBeenCalledWith("/admin");
  });
});
