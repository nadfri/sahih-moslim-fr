import type { Metadata } from "next";

import { amiriFont, geistMono, geistSans } from "@/src/fonts/fonts";

import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

import { cookies } from "next/headers";
import { ToastContainer } from "react-toastify";

import { AuthProvider } from "@/src/hooks/useAuth";
import { Footer } from "@/src/ui/Footer/Footer";
import { Header } from "@/src/ui/Header/Header";
import { ScrollBtns } from "@/src/ui/ScrollBtns/ScrollBtns";

export const metadata: Metadata = {
  title: "Sahih Moslim en français",
  description: "Une collection de hadiths authentiques.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value || "dark";

  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} ${amiriFont.variable}`}
    >
      <head>
        <link
          rel="icon"
          href="/favicon.svg"
          type="image/svg+xml"
        />
      </head>

      <body
        className="antialiased flex flex-col min-h-screen text-gray-800 dark:text-gray-200 dark:bg-gray-950 transition-colors duration-200"
        suppressHydrationWarning
        data-theme={theme}
      >
        <AuthProvider>
          <Header />
          <main className="bg-gradient-to-br from-emerald-50 via-stone-50 to-amber-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 py-4 px-2 md:px-8 flex-1">
            {children}
          </main>
          <Footer />{" "}
        </AuthProvider>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          closeOnClick
          draggable
          theme="colored"
        />

        <ScrollBtns />
      </body>
    </html>
  );
}
