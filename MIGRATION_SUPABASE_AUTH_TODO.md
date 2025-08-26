# 🔄 Migration NextAuth vers Supabase Auth - Plan détaillé

## ✅ ÉTAT D'AVANCEMENT

### ✅ PHASE 1 TERMINÉE - Nettoyage des dépendances
- ✅ Suppression des packages NextAuth du package.json
- ✅ Nettoyage des imports et fichiers obsolètes

### ✅ PHASE 2 TERMINÉE - Migration BDD et RLS  
- ✅ Migration du schéma Prisma (suppression tables NextAuth, ajout table profiles)
- ✅ Activation RLS sur toutes les tables publiques
- ✅ Politiques RLS : lecture publique, écriture admin uniquement

### ✅ PHASE 3 TERMINÉE - Configuration Supabase Auth
- ✅ Configuration clients Supabase (browser/server)
- ✅ Hook useAuth avec React Compiler
- ✅ Route callback OAuth GitHub
- ✅ Pages signin/error refactorisées

### ✅ PHASE 4 EN COURS - Refactorisation composants
- ✅ Migration ButtonSignOut vers useAuth
- ✅ Migration ButtonGithub vers useAuth  
- ✅ Migration Header vers useAuth
- ✅ Suppression SessionWrapper
- ✅ Migration Layout vers AuthProvider

### ✅ PHASE 5 TERMINÉE - Actions serveur et middleware
- ✅ Création auth helper simplifié (`src/lib/auth.ts`)
- ✅ Migration actions serveur vers Supabase Auth
- ✅ Migration middleware vers Supabase Auth (simplifié)
- ✅ Suppression routes API hadiths (utilisation Server Actions)

### 🔄 PHASE 6 EN COURS - Nettoyage final
- ✅ Suppression fichiers NextAuth obsolètes
- ✅ Application compile et démarre
- 🔄 Tests à adapter (reporté)
- 🔄 Formatage code à corriger

### 📋 PHASE 7 À FAIRE - Tests et validation
- ⏳ Tests fonctionnels de l'auth
- ⏳ Tests des composants UI
- ⏳ Tests middleware
- ⏳ Tests actions serveur

## 📍 ARCHITECTURE FINALE SIMPLIFIÉE

### 🔐 Auth System
- **Client** : `src/hooks/useAuth.tsx` (hook unique avec AuthProvider)
- **Server** : `src/lib/auth.ts` (helpers simples getServerUser/requireAdmin)
- **OAuth** : `app/auth/callback/route.ts` (callback GitHub)
- **Protection** : `middleware.ts` (simplifié, direct Supabase + Prisma)

### 🗄️ Base de données
- **Auth** : Supabase auth.users (géré par Supabase)
- **Profiles** : Table profiles liée à auth.users (rôles utilisateur)
- **RLS** : Actif sur toutes les tables (sécurité native)

### 🎯 Avantages obtenus
- ✅ **Simplification** : 1 fichier auth client + 1 fichier auth server
- ✅ **Sécurité** : RLS natif + politique fine granularité  
- ✅ **Performance** : React Compiler + moins de code
- ✅ **Maintenance** : Architecture claire, moins de fichiers éparpillés

---

## 📍 ANALYSE DE L'EXISTANT (historique)

### ✅ Où on a besoin de l'auth ?
- **Pages protégées** : `/admin/*` (middleware)
- **API Routes** : CRUD des hadiths (`/api/hadiths/add`, `/api/hadiths/edit`, `/api/hadiths/delete`)
- **Actions serveur** : `src/services/actions.ts`
- **UI Components** : Header avec bouton de déconnexion

### 📁 Fichiers utilisant l'auth NextAuth (à modifier/supprimer)

#### **🔐 Configuration Auth**
- `src/authentification/auth.ts` - Configuration NextAuth principale
- `src/authentification/SessionWrapper.tsx` - Provider NextAuth
- `next-auth.d.ts` - Types NextAuth
- `app/api/auth/[...nextauth]/route.ts` - Route API NextAuth

#### **🛡️ Protection/Middleware**
- `middleware.ts` - Protection routes admin avec `getToken`
- `__tests__/middleware.test.ts` - Tests middleware

#### **🎨 UI Components**
- `src/ui/connexion/ButtonSignOut.tsx` - Bouton déconnexion (`useSession`, `signOut`)
- `src/ui/connexion/ButtonSignOut.test.tsx` - Tests bouton
- `src/ui/Header/Header.tsx` - Header utilisant ButtonSignOut
- `src/ui/Header/Header.test.tsx` - Tests header

#### **📄 Pages Auth**
- `app/auth/signin/page.tsx` - Page de connexion (`auth()`)
- `app/auth/error/page.tsx` - Page d'erreur auth
- `app/auth/error/page.test.tsx` - Tests page erreur

#### **🔧 Services/Actions**
- `src/services/actions.ts` - Actions serveur (`auth()`)

#### **🌐 API Routes**
- `app/api/hadiths/add/route.ts` - Ajout hadith (`auth()`)
- `app/api/hadiths/edit/[id]/route.ts` - Édition hadith (`auth()`)
- `app/api/hadiths/delete/[id]/route.ts` - Suppression hadith (`auth()`)

#### **📦 Dependencies**
- `package.json` - Dépendances NextAuth à supprimer
- `app/layout.tsx` - SessionWrapper à remplacer

## 🗄️ CHANGEMENTS BASE DE DONNÉES

### ❌ Tables NextAuth à supprimer (avec RLS)
```sql
-- Ces tables seront remplacées par le système auth Supabase
- User (partiellement - garder le champ role et id)
- Account (à supprimer)
- Session (à supprimer) 
- VerificationToken (à supprimer)
- Authenticator (à supprimer)
```

### ✅ Nouveau schéma Auth Supabase
- Utiliser `auth.users` natif Supabase
- Créer table `profiles` pour les données métier (role, etc.)
- Activer RLS sur toutes les tables

## 🔄 PLAN D'EXECUTION

### **Phase 1 : Préparation et nettoyage**
1. ✅ Faire une sauvegarde complète de la DB
2. ✅ Créer une branche de migration
3. ✅ Supprimer les dépendances NextAuth du package.json
4. ✅ Installer les dépendances Supabase

### **Phase 2 : Modification du schéma de base**
5. ✅ Créer nouvelle migration Prisma pour :
   - Supprimer les tables NextAuth (Account, Session, etc.)
   - Créer table `profiles` liée à `auth.users`
   - Activer RLS sur toutes les tables
6. ✅ Mettre à jour `prisma/schema.prisma`

### **Phase 3 : Configuration Supabase Auth**
7. ✅ Configurer les variables d'environnement Supabase
8. ✅ Créer `src/lib/supabase.ts` (client/serveur)
9. ✅ Configurer les providers OAuth (GitHub)
10. ✅ Créer les politiques RLS

### **Phase 4 : Refactorisation du code**
11. ✅ Remplacer `SessionWrapper` par Supabase AuthProvider
12. ✅ Refactoriser `middleware.ts` pour Supabase
13. ✅ Créer nouveaux hooks auth (`useUser`, `useAuth`)
14. ✅ Refactoriser les API routes
15. ✅ Refactoriser les actions serveur
16. ✅ Refactoriser les composants UI

### **Phase 5 : Pages Auth**
17. ✅ Créer nouvelles pages auth Supabase
18. ✅ Supprimer anciennes pages NextAuth

### **Phase 6 : Tests et nettoyage**
19. ✅ Mettre à jour tous les tests
20. ✅ Supprimer fichiers NextAuth obsolètes
21. ✅ Tester la migration complète
22. ✅ Vérifier RLS et sécurité

### **Phase 7 : Migration des données**
23. ✅ Script de migration des utilisateurs existants
24. ✅ Validation des données migrées

## 🚀 AVANTAGES ATTENDUS

- ✅ **Sécurité** : RLS activé automatiquement
- ✅ **Simplicité** : Moins de configuration
- ✅ **Performance** : Moins de requêtes DB
- ✅ **Maintenance** : Un seul système d'auth
- ✅ **Fonctionnalités** : Email, réinitialisation mot de passe, etc.

## ⚠️ POINTS D'ATTENTION

- Migration des utilisateurs existants
- Gestion des rôles (admin/user)
- Tests complets avant mise en production
- Backup de sécurité obligatoire

## 🔧 TODO POST-MIGRATION (Warnings Supabase à corriger plus tard)

### **Function Search Path Mutable** (WARN - Sécurité)
- `search_hadiths_fr()` - Ajouter `SET search_path = public`
- `search_hadiths_ar()` - Ajouter `SET search_path = public`  
- `search_hadiths_combined()` - Ajouter `SET search_path = public`

### **Extension in Public** (WARN - Sécurité)
- Déplacer extension `unaccent` vers un schéma dédié (ex: `extensions`)
- Déplacer extension `pg_trgm` vers un schéma dédié (ex: `extensions`)

**Note** : Ces corrections peuvent être faites après la migration auth pour ne pas impacter la recherche existante.

---
**Prêt à commencer ? On démarre par quelle phase ?**
