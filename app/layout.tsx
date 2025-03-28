import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import { Footer } from "./ui/Footer";
import { Header } from "./ui/Header/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen text-gray-800`}
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
