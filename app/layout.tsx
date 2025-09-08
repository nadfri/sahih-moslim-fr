import type { Metadata } from "next";

import { amiriFont, geistMono, geistSans } from "@/src/fonts/fonts";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

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
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} ${amiriFont.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="icon"
          href="/favicon.svg"
          type="image/svg+xml"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
      (function() {
        try {
          const stored = localStorage.getItem('theme');
          const theme = stored ? stored : 'dark';
          
          document.documentElement.setAttribute('data-theme', theme);
        } catch (_) {
          document.documentElement.setAttribute('data-theme', 'dark');
        }
      })();
    `,
          }}
        />
      </head>
      <body className="antialiased flex flex-col min-h-screen text-gray-800 dark:text-gray-200 dark:bg-gray-950 transition-colors duration-200">
        <AuthProvider>
          <Header />

          <main className="bg-gradient-to-br from-emerald-50 via-stone-50 to-amber-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 py-4 px-2 md:px-8 flex-1">
            {children}
          </main>

          <Footer />
        </AuthProvider>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          pauseOnHover={false}
          pauseOnFocusLoss={false}
          closeOnClick
          draggable
          theme="colored"
        />
        <ScrollBtns />
      </body>
    </html>
  );
}
