# Sahih Moslim FR - Application Next.js avec Supabase

Une application web moderne pour consulter les hadiths de Sahih Moslim en français, construite avec Next.js 15, React 19, et Supabase PostgreSQL.

## 🚀 Technologies Utilisées

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Supabase PostgreSQL, Prisma ORM
- **Authentification**: NextAuth.js avec GitHub OAuth
- **Recherche**: PostgreSQL Full-Text Search optimisé
- **UI**: Composants React personnalisés avec support du mode sombre

## 📋 Table des Matières

1. [Configuration Supabase](#configuration-supabase)
2. [Installation et Configuration du Projet](#installation-et-configuration-du-projet)
3. [Optimisations de Recherche](#optimisations-de-recherche)
4. [Configuration de l'Authentification](#configuration-de-lauthentification)
5. [Scripts Utiles](#scripts-utiles)
6. [Déploiement](#déploiement)

## 🔧 Configuration Supabase

### 1. Créer un Projet Supabase

1. Aller sur [supabase.com](https://supabase.com) et créer un compte
2. Créer un nouveau projet
3. Noter les informations de connexion :
   - Project URL
   - API Keys (anon/public)
   - Database URL

### 2. Configuration de la Base de Données

#### Variables d'Environnement

Créer un fichier `.env.local` avec vos informations Supabase :

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[ANON-KEY]"

# Base de données PostgreSQL (Supabase)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Authentication
AUTH_SECRET="votre-secret-très-long-et-aléatoire"
GITHUB_ID="votre-client-id-github"
GITHUB_SECRET="votre-client-secret-github"

# En production uniquement
# AUTH_URL="https://votre-domaine.com"
```

#### 3. Extensions PostgreSQL Requises

Dans l'éditeur SQL de Supabase, exécuter ces commandes **une seule fois** :

```sql
-- 🔧 Extensions pour la recherche optimisée
CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

#### 4. Index de Performance (OBLIGATOIRES)

**⚠️ Important** : Ces index sont essentiels pour des performances <300ms avec 6000+ hadiths.

Dans l'éditeur SQL de Supabase :

```sql
-- 🚀 Index trigram pour recherche ultra-rapide
CREATE INDEX IF NOT EXISTS hadith_matn_fr_trgm_idx
ON "Hadith" USING GIN (lower(matn_fr) gin_trgm_ops);

CREATE INDEX IF NOT EXISTS hadith_matn_ar_trgm_idx
ON "Hadith" USING GIN (lower(matn_ar) gin_trgm_ops);
```

#### 5. Vérification des Index

Pour vérifier que les index sont bien créés :

```sql
-- Vérifier les extensions
SELECT extname, extversion
FROM pg_extension
WHERE extname IN ('pg_trgm', 'unaccent');

-- Vérifier les index
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'Hadith'
ORDER BY indexname;
```

## 🧪 Configuration des Tests

### Base de Données de Test Locale

Pour éviter d'utiliser Supabase en production pour les tests, nous utilisons une base de données PostgreSQL locale via Docker.

#### 1. Lancer la Base de Données de Test

```bash
# Lancer PostgreSQL en arrière-plan
docker-compose up -d

# Vérifier que le conteneur fonctionne
docker ps
```

#### 2. Appliquer les Migrations à la DB de Test

```bash
# Charger l'environnement de test et appliquer les migrations
DATABASE_URL="postgresql://test_user:test_password@localhost:5432/test_db?schema=public" npx prisma migrate deploy
```

#### 3. Variables d'Environnement pour les Tests

Copier `.env.test.example` vers `.env.test` et ajuster si nécessaire :

```bash
cp .env.test.example .env.test
```

#### 4. Exécuter les Tests

```bash
# Exécuter tous les tests
npm test

# Avec couverture
npm run test:coverage
```

**Note** : Les tests nettoient automatiquement la DB avant chaque exécution pour éviter les interférences.

## 📦 Installation et Configuration du Projet

### 1. Cloner et Installer

```bash
git clone [votre-repo]
cd sahih-moslim-fr
pnpm install
```

### 2. Initialiser la Base de Données

```bash
# Appliquer les migrations Prisma
pnpx prisma migrate deploy

# Générer le client Prisma
pnpx prisma generate

# (Optionnel) Peupler la base avec des données de test
pnpx prisma db seed
```

### 3. Lancer en Développement

```bash
pnpm dev
```

L'application sera disponible sur `http://localhost:3000`

## 🔍 Optimisations de Recherche

### Performance Attendue

- **Recherches avec cache** : <50ms ⚡
- **Nouvelles recherches courtes** : 300-600ms ✅
- **Recherche accent-insensitive** : "priere" → trouve "prière" ✅
- **Recherche multilingue** : Français + Arabe ✅

### Architecture de Recherche

1. **Cache intelligent** : 5 minutes TTL, 100 entrées max
2. **Index trigram** : PostgreSQL GIN pour ILIKE ultra-rapide
3. **Recherche hybride** : Index rapides + fallback accent-insensitive
4. **Limite optimisée** : 25 résultats par défaut

### Test des Performances

```bash
# Lancer les tests de performance
pnpx tsx scripts/test-search-performance.ts

# Valider toutes les optimisations
pnpx tsx scripts/validate-search-optimizations.ts
```

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

````

### Créer un wrapper de session pour le client

Créer le fichier `authentification/SessionWrapper.tsx` :

```typescript
"use client";
## 🔐 Configuration de l'Authentification

### 1. Configuration GitHub OAuth

1. Aller sur [GitHub Settings > Developer Settings > OAuth Apps](https://github.com/settings/developers)
2. Créer une nouvelle OAuth App :
   - **Application name** : `Sahih Moslim FR`
   - **Homepage URL** : `http://localhost:3000` (dev) / `https://votre-domaine.com` (prod)
   - **Authorization callback URL** : `http://localhost:3000/api/auth/callback/github`
3. Noter le `Client ID` et `Client Secret`

### 2. Générer AUTH_SECRET

```bash
# Générer une clé secrète sécurisée
pnpx auth secret
````

### 3. Configuration NextAuth.js

L'authentification est configurée avec :

- **Adaptateur Prisma** pour la persistance en base
- **GitHub OAuth** pour la connexion
- **Gestion des rôles** (user/admin)
- **Middleware de protection** des routes admin

### 4. Routes Protégées

- `/admin/*` - Accès admin uniquement
- `/auth/*` - Pages d'authentification
- Redirection automatique selon l'état de connexion

## 📝 Scripts Utiles

```bash
# Développement
pnpm dev                    # Lancer en mode développement

# Base de données
pnpx prisma migrate dev     # Créer une nouvelle migration
pnpx prisma generate        # Générer le client Prisma
pnpx prisma studio          # Interface graphique de la DB
pnpx prisma db seed         # Peupler la base avec des données

# Tests et Validation
pnpx tsx scripts/test-search-performance.ts    # Tests de performance
pnpx tsx scripts/validate-search-optimizations.ts  # Validation complète

# Vérifier l'état de la DB
pnpx prisma db execute --file scripts/check-db-state.sql --schema prisma/schema.prisma

# Production
pnpm build                  # Build de production
pnpm start                  # Démarrer en production
```

## 🚀 Déploiement

### 1. Préparation

- Configurer les variables d'environnement de production
- Mettre à jour `AUTH_URL` avec votre domaine
- Configurer GitHub OAuth avec l'URL de production

### 2. Migration de la Base de Données

```bash
# En production
pnpx prisma migrate deploy
```

### 3. Vérification Post-Déploiement

- Tester la recherche avec différents termes
- Vérifier les performances (objectif <300ms)
- Valider l'authentification GitHub
- Confirmer que les index PostgreSQL sont actifs

## 📊 Monitoring des Performances

### Métriques Importantes

- **Temps de recherche** : <300ms pour nouveaux termes
- **Cache hit rate** : >80% pour les termes populaires
- **Recherches/seconde** : Optimisé pour 6000+ hadiths
- **Utilisation des index** : Vérifier via `EXPLAIN ANALYZE`

### Optimisations Actives

✅ **Cache en mémoire** (5min TTL, 100 entrées)  
✅ **Index trigram GIN** pour ILIKE ultra-rapide  
✅ **Recherche hybride** (index + fallback accent-insensitive)  
✅ **Limite optimisée** (25 résultats par défaut)  
✅ **Requêtes PostgreSQL optimisées**

## 🛠️ Dépannage

### Problèmes de Performance de Recherche

1. **Vérifier les index** :

```sql
SELECT indexname FROM pg_indexes WHERE tablename = 'Hadith';
```

2. **Recréer les index si nécessaire** :

```sql
-- Dans l'éditeur SQL Supabase
DROP INDEX IF EXISTS hadith_matn_fr_trgm_idx;
DROP INDEX IF EXISTS hadith_matn_ar_trgm_idx;

CREATE INDEX hadith_matn_fr_trgm_idx ON "Hadith" USING GIN (lower(matn_fr) gin_trgm_ops);
CREATE INDEX hadith_matn_ar_trgm_idx ON "Hadith" USING GIN (lower(matn_ar) gin_trgm_ops);
```

### Problèmes d'Authentification

1. **Vérifier les variables d'environnement**
2. **Confirmer la configuration GitHub OAuth**
3. **Vérifier les migrations Prisma** : `pnpx prisma migrate status`

### Problèmes de Base de Données

1. **Vérifier la connexion** : `pnpx prisma db pull`
2. **Recréer le client** : `pnpx prisma generate`
3. **Réinitialiser si nécessaire** : `pnpx prisma migrate reset`

## 📖 Documentation

- [Performance Report](./PERFORMANCE_REPORT.md) - Détails des optimisations
- [Prisma Schema](./prisma/schema.prisma) - Structure de la base
- [Types TypeScript](./src/types/types.ts) - Définitions des types

## 🤝 Contribution

Pour contribuer au projet :

1. Fork le repository
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

</div>
</div>
</div>
);
}

````

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
````

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
