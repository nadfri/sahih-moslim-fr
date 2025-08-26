# 🎯 Plan CRUD Complet - Sahih Muslim FR

## 📊 État actuel (Analyse)

### ✅ Déjà implémenté :

- **Formulaires UI** : `AddHadithForm.tsx`, `EditHadithForm.tsx`
- **Pages** : `/add`, `/hadiths/[numero]/edit`
- **Actions serveur** : `src/services/actions.ts` (items: chapters, narrators, sahabas, transmitters)
- **Anciens API routes** : Supprimés pendant migration (remplacés par Server Actions)

### ❌ Manquant (à migrer vers Server Actions) :

- **Actions serveur pour hadiths** : add, edit, delete
- **Tests complets** : Toutes les actions CRUD
- **Validation côté serveur** : Schemas et vérifications
- **Gestion d'erreurs** : Rollback, transactions

---

## 🏗️ Plan d'implémentation par étapes

### **ÉTAPE 1 : Actions Serveur Hadiths** ⭐

**Objectif** : Remplacer les API routes par des Server Actions

#### 1.1 Créer les actions serveur hadiths

- `src/services/hadith-actions.ts`
  - `addHadith(data)`
  - `editHadith(id, data)`
  - `deleteHadith(id)`

#### 1.2 Tests des actions hadiths

- `__tests__/hadith-actions.test.ts`
  - Tests unitaires pour chaque action
  - Tests d'intégration avec DB
  - Tests de validation et erreurs

#### 1.3 Migration des formulaires

- Remplacer `fetch("/api/hadiths/...")` par les nouvelles actions
- `AddHadithForm.tsx` → `addHadith()`
- `EditHadithForm.tsx` → `editHadith()`, `deleteHadith()`

---

### **ÉTAPE 2 : Amélioration des actions existantes** ⭐

**Objectif** : Optimiser les actions items existantes + tests

#### 2.1 Tests des actions items existantes

- `__tests__/item-actions.test.ts`
  - `addItem()`, `editItem()`, `deleteItem()`
  - Tests pour chapters, narrators, sahabas, transmitters

#### 2.2 Optimisations des actions items

- Améliorer gestion d'erreurs
- Ajouter transactions si nécessaire
- Optimiser les requêtes DB

---

### **ÉTAPE 3 : Pages et formulaires avancés** ⭐

**Objectif** : Pages de gestion complètes

#### 3.1 Page d'administration

- `/admin` - Dashboard CRUD complet
- Listes avec pagination
- Actions en masse

#### 3.2 Formulaires optimisés

- Auto-save (brouillons)
- Validation temps réel
- Upload d'images (futur)

#### 3.3 Tests UI/UX

- Tests des formulaires avec `@testing-library`
- Tests d'intégration E2E avec Playwright (futur)

---

### **ÉTAPE 4 : Features avancées** ⭐

**Objectif** : Fonctionnalités métier spécifiques

#### 4.1 Import/Export

- Import en masse de hadiths
- Export JSON/CSV
- Validation des données importées

#### 4.2 Historique et audit

- Log des modifications
- Versioning des hadiths
- Rollback manuel

#### 4.3 Optimisations performance

- Cache des données fréquentes
- Optimisation des requêtes
- Lazy loading

---

## 🧪 Stratégie de tests

### Tests unitaires (Vitest)

```typescript
// Exemple structure de test
describe("addHadith", () => {
  it("should create hadith with valid data");
  it("should reject duplicate numero");
  it("should validate required fields");
  it("should handle database errors");
});
```

### Tests d'intégration

```typescript
// Exemple test complet
describe("Hadith CRUD Integration", () => {
  it("should complete full CRUD cycle");
  it("should maintain data consistency");
  it("should respect RLS policies");
});
```

### Tests UI (future)

```typescript
// Exemple test formulaire
describe("AddHadithForm", () => {
  it("should submit valid form");
  it("should show validation errors");
  it("should preview hadith correctly");
});
```

---

## 📋 Checklist d'avancement

### ✅ Prérequis (Terminé)

- [x] Migration NextAuth → Supabase Auth
- [x] RLS activé et politiques configurées
- [x] Helpers de test et nettoyage DB
- [x] Configuration vitest fonctionnelle

### 🔄 À faire (Par ordre de priorité)

#### Phase 1 - Actions Serveur Hadiths

- [ ] Créer `src/services/hadith-actions.ts`
- [ ] Tests `__tests__/hadith-actions.test.ts`
- [ ] Migrer `AddHadithForm.tsx`
- [ ] Migrer `EditHadithForm.tsx`
- [ ] Tests formulaires

#### Phase 2 - Optimisation Actions Items

- [ ] Tests `__tests__/item-actions.test.ts`
- [ ] Optimiser actions existantes
- [ ] Améliorer gestion d'erreurs

#### Phase 3 - Pages Administration

- [ ] Page `/admin` complète
- [ ] Dashboard avec statistiques
- [ ] Pagination et filtres

#### Phase 4 - Features Avancées

- [ ] Import/Export de données
- [ ] Historique des modifications
- [ ] Optimisations performance

---

## 🎯 Prochaine étape

**Commencer par l'ÉTAPE 1.1** : Créer les actions serveur pour les hadiths

### Fichiers à créer en premier :

1. `src/services/hadith-actions.ts` - Actions serveur principales
2. `__tests__/hadith-actions.test.ts` - Tests des actions
3. Migration des formulaires existants

Prêt à commencer ? 🚀
