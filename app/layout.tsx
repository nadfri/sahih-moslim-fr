import type { Metadata } from "next";

import { amiriFont, geistMono, geistSans } from "@/fonts/fonts";

import "./globals.css";

import { Footer } from "../ui/Footer";
import { Header } from "../ui/Header";

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
        <Header />
        <main className="bg-gradient-to-br from-emerald-50 via-stone-50 to-amber-50 py-12 px-4 sm:px-6 lg:px-8 flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
