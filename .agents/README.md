# Agents & Skills - Optimisations de contexte

Ce dossier contient les agents et skills optimisés pour **réduire la consommation de contexte de ~90%**.

## 🎯 Problème résolu

Les skills Vercel (notamment `vercel-react-best-practices`) contenaient un fichier `AGENTS.md` massif de **2935 lignes** qui consommait énormément de tokens de contexte quand les agents l'utilisaient.

## ✅ Solution implémentée

### Structure modulaire par catégorie

```
.agents/
├── agents/                          # Agents orchestrant les skills
│   ├── CodeReviewer.agent.md       # Review complet (performance + archi + design)
│   ├── PerformanceOptimizer.agent.md # Focus performance uniquement
│   └── ComponentArchitect.agent.md  # Focus architecture de composants
│
└── skills/
    ├── vercel-react-best-practices/
    │   ├── SKILL.md                 # Index + guide d'utilisation (~150 lignes)
    │   ├── QUICK-REFERENCE.md       # Vue d'ensemble condensée (~200 lignes)
    │   ├── AGENTS.md                # ⚠️ Éviter ! (2935 lignes - legacy)
    │   │
    │   ├── categories/              # 📂 NOUVEAU : Fichiers par catégorie
    │   │   ├── 01-waterfalls.md     # ~287 lignes | CRITICAL
    │   │   ├── 02-bundle.md         # ~150 lignes | CRITICAL
    │   │   ├── 03-server.md         # ~449 lignes | HIGH
    │   │   ├── 04-client.md         # ~241 lignes | MEDIUM-HIGH
    │   │   ├── 05-rerender.md       # ~527 lignes | MEDIUM
    │   │   ├── 06-rendering.md      # ~387 lignes | MEDIUM
    │   │   ├── 07-javascript.md     # ~615 lignes | LOW-MEDIUM
    │   │   └── 08-advanced.md       # ~127 lignes | LOW
    │   │
    │   └── rules/                   # Règles individuelles (détail granulaire)
    │
    ├── vercel-composition-patterns/ # Patterns de composition React
    └── web-design-guidelines/       # Guidelines design & accessibilité
```

## 📊 Réduction de contexte

| Approche                        | Lignes chargées | Économie   |
| ------------------------------- | --------------- | ---------- |
| ❌ Avant : Charger AGENTS.md    | 2935 lignes     | -          |
| ✅ Après : QUICK-REFERENCE.md   | ~200 lignes     | **93%**    |
| ✅ Après : Catégorie spécifique | 150-615 lignes  | **80-95%** |

### Exemple concret

**Problème détecté** : "Le composant se re-render trop souvent"

**Avant** (ancien système) :

```
1. Charger AGENTS.md → 2935 lignes
2. Analyser toutes les catégories
3. Appliquer les règles
```

**Après** (système optimisé) :

```
1. Charger QUICK-REFERENCE.md → 200 lignes
2. Identifier catégorie → Re-render Optimization
3. Charger categories/05-rerender.md → 527 lignes
4. Appliquer les règles pertinentes
```

**Résultat** : 727 lignes au lieu de 2935 = **75% d'économie** de contexte

## 🚀 Comment utiliser

### Pour les agents

Les 3 agents ont été mis à jour pour charger dynamiquement les bonnes catégories :

1. **CodeReviewer** : Charge les catégories pertinentes selon le type d'issue détecté
2. **PerformanceOptimizer** : Commence par QUICK-REFERENCE, puis charge la catégorie spécifique
3. **ComponentArchitect** : Utilise composition-patterns + catégories performance si besoin

### Pour Copilot Chat

Quand vous discutez avec Copilot :

1. **Référence rapide** : Le skill `vercel-react-best-practices` charge automatiquement SKILL.md
2. **Détails sur une catégorie** : Demandez explicitement la catégorie
   ```
   "Montre-moi les best practices pour éliminer les waterfalls"
   → Copilot charge categories/01-waterfalls.md
   ```
3. **Vue d'ensemble** : Demandez QUICK-REFERENCE.md pour un résumé

## 🎨 Stratégie de chargement

### Priorité par impact

| Priorité    | Catégories                 | Impact                        | Quand charger           |
| ----------- | -------------------------- | ----------------------------- | ----------------------- |
| CRITICAL    | 1-2 (Waterfalls, Bundle)   | 2-10× amélioration            | API lentes, bundle >1MB |
| HIGH        | 3 (Server)                 | Temps de chargement, sécurité | SSR, Server Actions     |
| MEDIUM-HIGH | 4 (Client)                 | UX, déduplication             | Fetching client-side    |
| MEDIUM      | 5-6 (Re-render, Rendering) | Réactivité UI                 | Composants lents        |
| LOW-MEDIUM  | 7 (JavaScript)             | Gains cumulatifs              | Boucles, hot paths      |
| LOW         | 8 (Advanced)               | Cas spécifiques               | Patterns avancés        |

### Workflow recommandé

```
1. Analyser le code
2. Identifier le type de problème
3. Charger QUICK-REFERENCE.md
4. Charger UNIQUEMENT la catégorie pertinente
5. Appliquer les règles
```

## 📝 Maintenance

### Ajouter une nouvelle règle

1. Éditer le fichier de catégorie approprié dans `categories/`
2. Ajouter l'entrée dans `QUICK-REFERENCE.md`
3. (Optionnel) Créer un fichier détaillé dans `rules/`

### Modifier une règle existante

1. Éditer directement le fichier de catégorie
2. Mettre à jour QUICK-REFERENCE.md si le titre/description change
3. AGENTS.md peut rester legacy (non utilisé)

## ⚠️ Notes importantes

- **Ne pas charger AGENTS.md** sauf si absolument nécessaire (legacy)
- **Toujours commencer par QUICK-REFERENCE.md** pour identifier la catégorie
- **Les agents chargent automatiquement** les bonnes catégories
- **En cas de doute**, charger une catégorie complète vaut mieux que tout charger

## 🔗 Références

- [SKILL.md](skills/vercel-react-best-practices/SKILL.md) - Guide d'utilisation du skill
- [QUICK-REFERENCE.md](skills/vercel-react-best-practices/QUICK-REFERENCE.md) - Référence rapide
- [categories/](skills/vercel-react-best-practices/categories/) - Fichiers par catégorie

---

**Impact global** : Réduction de ~90% de la consommation de tokens de contexte pour les tâches de performance et architecture React/Next.js.
