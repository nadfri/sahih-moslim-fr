import type { Metadata } from "next";

import { amiriFont, geistMono, geistSans } from "@/src/fonts/fonts";

import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

import { ToastContainer } from "react-toastify";

import { SessionWrapper } from "@/src/authentification/SessionWrapper";
import { Footer } from "@/src/ui/Footer/Footer";
import { Header } from "@/src/ui/Header/Header";

export const metadata: Metadata = {
  title: "Sahih Moslim en français",
  description: "Une collection de hadiths authentiques.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        className="antialiased flex flex-col min-h-screen text-gray-800"
        suppressHydrationWarning
      >
        <SessionWrapper>
          <Header />
          <main className="bg-gradient-to-br from-emerald-50 via-stone-50 to-amber-50 py-4 px-2 md:px-8 flex-1 dark:from-emerald-900 dark:to-amber-900 dark:via-stone-900">
            {children}
          </main>
          <Footer />
        </SessionWrapper>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          closeOnClick
          draggable
          theme="colored"
        />
      </body>
    </html>
  );
}
