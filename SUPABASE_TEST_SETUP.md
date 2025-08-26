# 🧪 Guide de création d'un projet Supabase de test

## 1. Créer le projet test

1. Va sur https://supabase.com/dashboard
2. Créer un nouveau projet : "sahih-moslim-test"
3. Région : eu-west-3 (même que prod)
4. Mot de passe : `l1tTT5PqHpUF0wm8` (même que prod pour simplicité)

## 2. Configuration GitHub OAuth

- Utiliser les **mêmes credentials** GitHub
- Ajouter l'URL de callback test dans GitHub :
  - `https://YOUR_TEST_PROJECT_REF.supabase.co/auth/v1/callback`

## 3. Récupérer les nouvelles URLs

Remplacer dans .env.test :

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DATABASE_URL`
- `DIRECT_URL`

## 4. Appliquer les migrations

```bash
# Pointer vers la DB test
export DATABASE_URL="postgresql://postgres.TEST_REF:l1tTT5PqHpUF0wm8@aws-1-eu-west-3.pooler.supabase.com:5432/postgres"

# Appliquer les migrations
pnpx prisma migrate deploy

# Ou push du schema
pnpx prisma db push
```

## 5. Avantages

- ✅ Isolation complète des données de test
- ✅ Pas de pollution de la DB de développement
- ✅ Tests parallèles possibles sans conflit
- ✅ Réplication exacte de l'environnement de production
- ✅ RLS et politiques identiques à la prod

## 6. Alternative simple (pour commencer)

Si tu veux commencer rapidement, on peut :

1. **Nettoyer les données** avant chaque test
2. **Utiliser des transactions** pour isoler les tests
3. **Préfixer les données** de test pour éviter les conflits
