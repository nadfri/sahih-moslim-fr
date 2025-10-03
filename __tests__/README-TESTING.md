# Guide pour les Tests Next.js 15 avec next-intl

Ce guide explique comment créer des tests pour les composants Next.js 15 Server Components avec next-intl.

## Pattern Standard pour les Tests de Server Components

Utilisez ce template pour vos tests de Server Components qui utilisent `use()` et next-intl :

```typescript
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Locale } from "next-intl";
import { renderWithI18n } from "@/__tests__/renderWithI18n";

// Create mocks using vi.hoisted to ensure they're available before imports
const mockUse = vi.hoisted(() => vi.fn());

// Mock React.use hook
vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return {
    ...actual,
    use: mockUse,
  };
});

// Mock next-intl/server
vi.mock("next-intl/server", () => ({
  setRequestLocale: vi.fn(),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  })),
  usePathname: vi.fn(() => "/"),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  redirect: vi.fn(),
  permanentRedirect: vi.fn(),
  notFound: vi.fn(),
}));

// Import after mocks are set up
import YourComponent from "./YourComponent";

describe("YourComponent", () => {
  it("should render", () => {
    // Configure the use mock to return the resolved params
    mockUse.mockReturnValue({ locale: "fr" as Locale });

    const params = Promise.resolve({ locale: "fr" as Locale });

    renderWithI18n(<YourComponent {...params} />);

    expect(screen.getByText(/your expected text/i)).toBeInTheDocument();
  });
});
```

## Pourquoi ce Pattern ?

1. **vi.hoisted()** : Assure que les mocks sont créés avant les imports
2. **Mock React.use** : Nécessaire pour Next.js 15 Server Components qui utilisent le hook `use()`
3. **Mock next-intl/server** : Mock `setRequestLocale` et autres fonctions server
4. **Mock next/navigation** : Mock toutes les fonctions de navigation Next.js
5. **Import après les mocks** : Assure que le composant utilise les mocks configurés

## Exemple Concret

Voir `app/[locale]/unauthorized/page.test.tsx` pour un exemple complet fonctionnel.

## Utilities Disponibles

- `renderWithI18n()` : Function helper pour render avec NextIntlClientProvider
- `fr.json` : Fichier de messages de traduction pour les tests

## Conseils

- Toujours importer le composant APRÈS avoir configuré les mocks
- Utiliser `vi.hoisted()` pour éviter les problèmes de hoisting
- Configurer `mockUse.mockReturnValue()` avec les params attendus
- Utiliser `renderWithI18n()` au lieu de `render()` pour les composants i18n
