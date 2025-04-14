# Implémentation de l'authentification avec AuthJS, GitHub et middleware dans Next.js 15

Ce guide explique pas à pas comment mettre en place un système d'authentification complet dans une application Next.js 15 avec React 19, en utilisant AuthJS (anciennement NextAuth), l'authentification GitHub et un middleware pour protéger les routes.

## Table des matières

1. [Installation des dépendances](#installation-des-dépendances)
2. [Configuration de la base de données avec Prisma](#configuration-de-la-base-de-données-avec-prisma)
3. [Configuration du fournisseur GitHub](#configuration-du-fournisseur-github)
4. [Mise en place d'AuthJS](#mise-en-place-dauthjs)
5. [Création du middleware de protection](#création-du-middleware-de-protection)
6. [Création des composants d'interface utilisateur](#création-des-composants-dinterface-utilisateur)
7. [Gestion des sessions et des rôles utilisateur](#gestion-des-sessions-et-des-rôles-utilisateur)
8. [Dépannage courant](#dépannage-courant)

## Installation des dépendances

Pour commencer, installer les packages nécessaires :

```bash
pnpm add @auth/core @auth/prisma-adapter
pnpm add -D prisma
```

## Configuration de la base de données avec Prisma

### Initialiser Prisma

```bash
pnpx prisma init
```

### Configurer le schéma Prisma pour AuthJS

Ajouter les modèles requis par AuthJS dans votre fichier `prisma/schema.prisma` :

```prisma
// This is your Prisma schema file
datasource db {
  provider = "sqlite" // ou "postgresql", "mysql", etc.
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Account {
  id                 String  @id @default(cuid())
  userId             String
  type               String
  provider           String
  providerAccountId  String
  refresh_token      String?
  access_token       String?
  expires_at         Int?
  token_type         String?
  scope              String?
  id_token           String?
  session_state      String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  role          String?   @default("user")
  accounts      Account[]
  sessions      Session[]
}

model VerificationToken {
  identifier String
  token      String
  expires    DateTime

  @@unique([identifier, token])
}
```

### Générer le client Prisma et appliquer les migrations

```bash
pnpx prisma migrate dev --name init
pnpx prisma generate
```

### Créer un client Prisma pour l'application

Créer un fichier `prisma/prisma.ts` :

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
```

## Configuration du fournisseur GitHub

1. Aller sur GitHub et naviguer vers [Settings > Developer Settings > OAuth Apps](https://github.com/settings/developers)
2. Cliquer sur "New OAuth App"
3. Remplir les informations :
   - Application name: `Nom de votre application`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Enregistrer et noter les valeurs `Client ID` et `Client Secret`

## Mise en place d'AuthJS

### Créer les variables d'environnement

Créer ou modifier le fichier `.env` :

```
# Base de données
DATABASE_URL="file:./dev.db"

# Authentication
AUTH_SECRET="votre-secret-très-long-et-aléatoire"
GITHUB_ID="votre-client-id-github"
GITHUB_SECRET="votre-client-secret-github"

# En production
# AUTH_URL="https://votre-domaine.com"
```

Générer une valeur aléatoire pour AUTH_SECRET :

```bash
npx auth secret
```

### Configurer l'API route pour AuthJS

Créer le fichier `app/api/auth/[...nextauth]/route.ts` :

```typescript
import { handlers } from "@/authentification/auth";

export const { GET, POST } = handlers;
```

### Configurer AuthJS

Créer le fichier `authentification/auth.ts` :

```typescript
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import type { DefaultSession, NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";

import prisma from "@/prisma/prisma";

// Extension des types pour inclure les rôles utilisateur
declare module "next-auth" {
  interface User {
    role?: string | null;
  }
  interface Session {
    user: {
      id: string;
      role?: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string | null;
  }
}

// Configuration de NextAuth
export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [GitHub],
  callbacks: {
    async jwt({ token }) {
      if (!token.sub) return token;

      const dbUser = await prisma.user.findUnique({
        where: { id: token.sub },
        select: { role: true },
      });

      if (dbUser) {
        token.role = dbUser.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
```

### Créer un wrapper de session pour le client

Créer le fichier `authentification/SessionWrapper.tsx` :

```typescript
"use client";

import { SessionProvider } from "next-auth/react";

export function SessionWrapper({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

### Mettre à jour le layout racine

Modifier `app/layout.tsx` pour inclure le SessionWrapper :

```typescript
import { SessionWrapper } from "@/authentification/SessionWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}
```

## Création du middleware de protection

Créer ou modifier le fichier `middleware.ts` à la racine du projet :

```typescript
import { NextRequest, NextResponse } from "next/server";

import { auth } from "./authentification/auth";

// Routes qui requièrent un rôle admin
const ADMIN_ROUTES = ["/hadiths/add", "/hadiths/edit"];

// Routes d'authentification qui ne doivent pas être protégées
const AUTH_ROUTES = ["/auth/signin", "/auth/error"];

export async function middleware(request: NextRequest) {
  console.log("[Middleware Entry] Accessing:", request.nextUrl.pathname);

  // Récupérer la session utilisateur
  const session = await auth();
  console.log("[Middleware] Token retrieved:", session ? "exists" : "null");

  // Vérifier si le chemin actuel est une route d'admin
  const isAdminRoute = ADMIN_ROUTES.some((route) => {
    return (
      request.nextUrl.pathname === route ||
      request.nextUrl.pathname.startsWith(route)
    );
  });

  // Vérifier si c'est une page d'authentification
  const isAuthPage = AUTH_ROUTES.includes(request.nextUrl.pathname);

  // Déterminer si l'utilisateur est connecté et son rôle
  const hasSession = !!session;
  const userRole = session?.user?.role || "N/A";

  console.log(
    "[Middleware Check] Path:",
    request.nextUrl.pathname,
    "isAdminRoute:",
    isAdminRoute,
    "isAuthPage:",
    isAuthPage,
    "hasSession:",
    hasSession,
    "Role:",
    userRole
  );

  // Si c'est une route admin et que l'utilisateur n'est pas admin
  if (isAdminRoute && (!session || session.user.role !== "admin")) {
    console.log("[Middleware Blocked] Admin route access denied");

    // Rediriger vers la page de connexion si non connecté
    if (!session) {
      const signInUrl = new URL("/auth/signin", request.url);
      signInUrl.searchParams.set("callbackUrl", request.url);
      return NextResponse.redirect(signInUrl);
    }

    // Rediriger vers une page non autorisée si connecté mais pas admin
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // Si l'utilisateur est connecté et essaie d'accéder à une page d'authentification
  if (hasSession && isAuthPage) {
    console.log("[Middleware Redirect] Auth page redirected for logged user");
    return NextResponse.redirect(new URL("/", request.url));
  }

  console.log("[Middleware Allowed] Path", request.nextUrl.pathname);
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Correspond à tous les chemins sauf:
     * 1. /api/auth (routes d'authentification gérées par AuthJS)
     * 2. /_next (fichiers internes de Next.js)
     * 3. Les fichiers statiques (favicon.ico, images, etc.)
     */
    "/((?!api/auth|_next|.*\\..*).*)",
  ],
};
```

## Création des composants d'interface utilisateur

### Bouton de connexion GitHub

Créer le fichier `ui/buttons/ButtonGithub.tsx` :

```typescript
"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export function ButtonGithub() {
  const searchParams = useSearchParams();

  const handleSignIn = () => {
    // Récupérer l'URL de rappel ou utiliser une valeur par défaut
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    signIn("github", {
      callbackUrl,
      redirect: true,
    });
  };

  return (
    <button
      onClick={handleSignIn}
      className="flex items-center justify-center gap-2 w-full rounded-md bg-gray-800 px-4 py-3 text-white hover:bg-gray-700 transition-colors"
    >
      <span>Connexion avec GitHub</span>
    </button>
  );
}
```

### Bouton de déconnexion

Créer le fichier `ui/buttons/ButtonSignOut.tsx` :

```typescript
"use client";

import { signOut } from "next-auth/react";

export function ButtonSignOut() {
  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <button
      onClick={handleSignOut}
      type="button"
      className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-red-600 bg-white hover:bg-red-50 border border-red-200 shadow-sm transition-colors"
    >
      <span>Déconnexion</span>
    </button>
  );
}
```

### Page de connexion

Créer le fichier `app/auth/signin/page.tsx` :

```typescript
import { ButtonGithub } from "@/ui/buttons/ButtonGithub";

export default function SignInPage() {
  return (
    <div className="flex min-h-[70vh] flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
          Se connecter à votre compte
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-4">
            <ButtonGithub />
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Page d'erreur d'authentification

Créer le fichier `app/auth/error/page.tsx` :

```typescript
"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

// Messages d'erreur personnalisés
const errorMessages: Record<string, string> = {
  Configuration: "Une erreur de configuration du serveur s'est produite. Contactez l'administrateur.",
  AccessDenied: "Vous n'avez pas l'autorisation d'accéder à cette ressource.",
  Default: "Une erreur s'est produite lors de l'authentification.",
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "Default";

  // Récupérer le message d'erreur personnalisé ou utiliser le message par défaut
  const errorMessage = errorMessages[error] || errorMessages.Default;

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Erreur d'authentification
        </h1>
        <p className="mb-6 text-gray-600">{errorMessage}</p>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
```

### Page non autorisée

Créer le fichier `app/unauthorized/page.tsx` :

```typescript
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Accès non autorisé
        </h1>
        <p className="mb-6 text-gray-600">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          Seuls les administrateurs peuvent y accéder.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
```

## Gestion des sessions et des rôles utilisateur

### Composant de vérification d'administrateur

Créer le fichier `components/AdminCheck.tsx` :

```typescript
"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export function AdminCheck({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  // Si chargement en cours, afficher un indicateur
  if (status === "loading") {
    return <div className="p-8 flex justify-center">Chargement...</div>;
  }

  // Si non connecté, rediriger vers la page de connexion
  if (status === "unauthenticated") {
    redirect("/auth/signin");
  }

  // Si connecté mais pas admin, rediriger vers page non autorisée
  if (session && session.user.role !== "admin") {
    redirect("/unauthorized");
  }

  // Si admin, rendre le contenu enfant
  return <>{children}</>;
}
```

### Utilisation du composant AdminCheck

Dans les pages protégées, comme `app/hadiths/add/page.tsx` :

```typescript
import { AdminCheck } from "@/components/AdminCheck";
import { AddHadithForm } from "@/ui/hadith/AddHadithForm";

export default function AddHadithPage() {
  return (
    <AdminCheck>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Ajouter un hadith</h1>
        <AddHadithForm />
      </div>
    </AdminCheck>
  );
}
```

## Dépannage courant

### Problème de schéma Prisma

Si vous rencontrez une erreur comme `Unknown argument 'provider_providerAccountId'`, vérifiez que votre schéma Prisma correspond exactement à ce qui est attendu par l'adaptateur Prisma d'AuthJS. Assurez-vous que les noms de champs et les relations sont corrects.

### Erreur de session

Si les sessions ne fonctionnent pas correctement, vérifiez :

1. Que la variable d'environnement `AUTH_SECRET` est correctement définie
2. Que le client Prisma est correctement configuré
3. Que le callback `session` renvoie bien l'ID et le rôle utilisateur

### Erreur d'authentification GitHub

En cas de problème avec GitHub :

1. Vérifiez que les variables `GITHUB_ID` et `GITHUB_SECRET` sont correctes
2. Vérifiez que l'URL de callback dans les paramètres GitHub correspond exactement à votre URL d'application + `/api/auth/callback/github`

### Middleware ne s'exécute pas

Si le middleware ne semble pas fonctionner :

1. Vérifiez la configuration du matcher dans `middleware.ts`
2. Ajoutez des logs pour déboguer le flux d'exécution
3. Assurez-vous que le middleware est bien à la racine du projet

---

Avec cette configuration, vous disposez d'un système d'authentification complet avec :

- Connexion via GitHub
- Protection des routes basée sur les rôles
- Sessions utilisateurs persistantes
- Interface utilisateur adaptée à l'état d'authentification

Pour ajouter d'autres fournisseurs d'authentification, consultez la documentation d'AuthJS.
