# Sahih Moslim FR - Codebase Analysis & Architecture Patterns

**Project**: Next.js 15 Hadith Collection (French/English/Arabic)  
**Date**: February 2026  
**Version**: 0.4.0

---

## 1. ARCHITECTURE PATTERNS

### High-Level Feature Organization

```
app/
├── api/                         # API routes for data operations
│   ├── search/                 # Full-text search (word, sahaba, transmitter, numero)
│   ├── admin/set-admin-role/   # Admin role management
│   ├── export/                 # Data export (chapters, hadiths, sahabas, transmitters)
│   ├── import/                 # Data import & batch operations
│   └── full-backup/            # Database backup/restore
│
├── [locale]/                   # Locale-based routing (fr, en, ar)
│   ├── (home)/                 # Home page
│   ├── search/                 # Search interface
│   ├── chapters/               # Browse chapters
│   ├── sahabas/                # Browse companions (sahabas)
│   ├── transmitters/           # Browse transmitters (narrators)
│   ├── hadith/[numero]/        # Single hadith view
│   ├── admin/                  # Admin interface (role-gated)
│   └── auth/                   # Auth pages (signin, callback, error)
│
src/
├── services/                   # Business logic & queries
│   ├── searchServices.ts       # PostgreSQL FTS & caching
│   ├── services.ts             # Data fetching abstractions
│   ├── actions.ts              # Server actions (admin operations)
│   └── hadithSchemaServer.ts   # Hadith validation schemas
│
├── ui/                         # Reusable UI components
│   ├── hadith/                 # Hadith display components
│   ├── forms/                  # Form components with Zod validation
│   ├── Header/Footer/          # Layout components
│   └── FilteredListCardItem/   # Card components with filtering
│
├── hooks/                      # Custom React hooks
│   ├── useSearch.ts            # Search logic with debouncing
│   ├── useAuth.tsx             # Auth context & user state
│   └── useDebounce.ts          # Debounce utility
│
├── utils/                      # Utility functions
│   ├── searchUtils.ts          # Search param building & detection
│   ├── textNormalization.ts    # Arabic/multilingual text handling
│   └── slugify.ts              # URL-safe slug generation
│
├── lib/
│   └── auth/supabase/          # Supabase auth integration
│
├── types/
│   └── types.ts                # Zod schemas & TypeScript types
│
├── i18n/
│   ├── request.ts              # next-intl server config
│   ├── routing.ts              # Locale definitions
│   └── navigation.ts           # i18n Link utilities
│
└── messages/                   # JSON translation files
    ├── fr.json                 # French translations
    ├── en.json                 # English translations
    └── ar.json                 # Arabic translations
```

### Feature Areas

| Feature    | Location                                         | Pattern                               |
| ---------- | ------------------------------------------------ | ------------------------------------- | ------------------------------ |
| **Search** | `app/api/search/` → `services/searchServices.ts` | PostgreSQL FTS with in-memory caching |
| **Browse** | `app/[locale]/chapters/sahabas/transmitters/`    | Server pages + server actions         |
| **Admin**  | `app/[locale]/admin/` + `app/api/import          | export/`                              | Role-gated UI + server actions |
| **Auth**   | `src/lib/auth/supabase/` + `hooks/useAuth.tsx`   | Supabase OAuth + Context API          |
| **Data**   | `src/services/services.ts`                       | Prisma ORM with Zod validation        |

---

## 2. DATA STRUCTURES

### Core Models (Prisma Schema)

```typescript
// Main domain entities with tri-lingual content (FR, AR, EN)
model Hadith {
  id                 String              @id @default(cuid())
  numero             Int                 @unique              // Sequential number
  matn_fr            String              // French text (required)
  matn_ar            String              // Arabic text (required)
  matn_en            String              // English text (optional but provided)
  chapterId          String
  chapter            Chapter             @relation(...)
  hadithTransmitters HadithTransmitter[]
  mentionedSahabas   Sahaba[]            // Companions mentioned in hadith
}

model Chapter {
  id      String   @id @default(cuid())
  index   Int      @unique              // Display order
  slug    String   @unique              // URL-safe identifier
  name_fr String   (FR, AR, EN translations)
  hadiths Hadith[]
}

model Sahaba {  // Companion
  id                 String   @id
  slug               String   @unique
  name_fr            String   (FR, AR, EN translations)
  mentionedInHadiths Hadith[]
}

model Transmitter {  // Narrator in isnad chain
  id                 String              @id
  slug               String              @unique
  name_fr            String              (FR, AR, EN translations)
  hadithTransmitters HadithTransmitter[]
}

model HadithTransmitter {  // Junction: Hadith → Transmitters (ordered chain)
  hadithId      String
  transmitterId String
  order         Int      // Position in isnad chain (1, 2, 3...)
  hadith        Hadith   @relation(...)
  transmitter   Transmitter @relation(...)

  @@unique([hadithId, transmitterId])
  @@unique([hadithId, order])  // Enforce proper chain ordering
}

model Profile {  // Supabase Auth integration
  id    String
  email String?
  role  Role    @default(USER)  // USER | ADMIN
}
```

### Key Design Patterns

1. **Tri-lingual Content**: All text fields named `name_fr`, `name_ar`, `name_en`
2. **Slugs for URLs**: Each entity has a unique `slug` field for routing
3. **Ordered Transmitter Chains**: `HadithTransmitter.order` maintains isnad sequence
4. **Soft Relationships**: Sahabas linked to Hadiths via junction table (`mentionedSahabas`)

### API Type System (Zod Schemas)

```typescript
// Core types with Zod—avoid `any`, use `type` not `interface`
type FilterType = "word" | "sahaba" | "transmitter" | "numero";
type ItemType = {
  // Generic for Chapter, Sahaba, Transmitter
  id: string;
  slug: string;
  name_fr: string;
  name_ar: string | null;
  name_en: string | null;
  index?: number;
  hadithCount?: number;
};

type HadithType = {
  id: string;
  numero: number;
  matn_fr: string;
  matn_ar: string;
  matn_en: string;
  chapter: ItemType;
  mentionedSahabas: ItemType[];
  isnadTransmitters: ItemType[]; // Transmitters in order
};
```

---

## 3. PROJECT LAYOUT & KEY DIRECTORIES

### Root Configuration Files

| File                | Purpose                                                       |
| ------------------- | ------------------------------------------------------------- |
| `package.json`      | Scripts: `dev`, `build`, `test`, `prisma:*`, `lint`, `format` |
| `next.config.ts`    | Next Intl plugin + React Compiler enabled                     |
| `tsconfig.json`     | Path aliases: `@/*`, `@/ui/*`, `@/components/*`, etc.         |
| `talwind.config.ts` | Custom fonts (Amiri for Arabic), dark mode theme              |
| `eslint.config.mjs` | ES/React/Next/A11y linting rules (flat config)                |
| `vitest.config.mts` | Jest-DOM + jsdom environment + global test types              |
| `prisma.config.ts`  | _(probably moved or minimal)_                                 |

### Directory Purposes

**`app/` — Next.js App Router**

- `[locale]/` — Dynamic locale segment (fr/en/ar)
- `api/` — RESTful API routes
- Modern Next.js 15 patterns with async Server Components

**`src/` — Application logic**

- `services/` — Database queries, business logic, Zod parsing
- `ui/` — React components (export function style)
- `hooks/` — Custom hooks (useSearch, useAuth, useDebounce)
- `lib/` — Auth integrations, shared utilities
- `utils/` — Text processing, search building, slugification
- `types/` — Zod schema definitions & inferred TypeScript types

**`prisma/` — Database**

- `schema.prisma` — Entity models, indexes, relations
- `generated/prisma/` — Auto-generated Prisma Client

**`__tests__/` — Testing**

- Mirror src/ structure with `.test.ts(x)` files
- Test mocks in `__tests__/mocks/`
- `test-helpers.ts` — Shared test utilities

**`datas/` — Static seed data**

- `muslim_book0.json` ... `muslim_book56.json` — Pre-loaded hadith collection

**`backups/` — Database management**

- Emergency restore scripts
- Database snapshots for versioning

---

## 4. BUILD, TEST & RUN COMMANDS

### Development

```bash
# Install dependencies
pnpm install

# Start dev server with Turbopack (fast rebuilds)
pnpm dev
# → http://localhost:3000

# Prisma setup
pnpm prisma:migrate      # Create migrations for schema changes
pnpm prisma:generate     # Regenerate Prisma Client
pnpm prisma:studio       # Open Prisma Studio (GUI for data)
```

### Testing

```bash
# Run all tests (watch mode)
pnpm test

# Run with coverage report
pnpm test:coverage

# Test setup (Docker postgres + Prisma for test env)
pnpm test:setup

# Type checking
pnpm tsc
```

### Linting & Formatting

```bash
# Lint (read-only)
pnpm lint

# Lint with fixes
pnpm lint:fix

# Format with Prettier
pnpm format
pnpm format:check
```

### Production

```bash
# Build
pnpm build

# Start prod server
pnpm start
```

### Admin/Data Operations

```bash
# Restore emergency backup
pnpm restore:emergency

# Export data via API (requires auth)
# GET /api/export/{chapters|hadiths|sahabas|transmitters}

# Import data via API (requires admin, file multipart)
# POST /api/import/{chapters|hadiths|sahabas|transmitters}

# Set admin role (dev command)
# POST /api/admin/set-admin-role
```

---

## 5. DATABASE PATTERNS (Prisma)

### Key Features

1. **PostgreSQL with Supabase**
   - Direct connection string: `DATABASE_URL`
   - Connection pooling via `@prisma/adapter-pg`
   - Full-text search (ILIKE queries on matn fields)

2. **Custom Indexes**

   ```prisma
   @@index([chapterId], map: "idx_hadith_chapterid")
   @@index([numero], map: "idx_hadith_numero")
   @@unique([hadithId, order], ...)  // Enforces chain order
   ```

3. **Full-Text Search (FTS)**
   - Implemented via raw SQL ILIKE queries (not Postgres native FTS)
   - Locale-aware: searches in matn_fr + matn_ar (or matn_en + matn_ar)
   - Results cached in memory with `searchCache` singleton

4. **Migrations Pattern**

   ```bash
   # Create migration after schema changes
   pnpm prisma:migrate

   # Deploy in CI/prod
   pnpm prisma migrate deploy
   ```

5. **Zod Validation**
   - Every fetch wrapped in Zod schema parsing
   - Example: `HadithSchema.parse(transformedHadith)`
   - Ensures type safety and runtime validation

### Typical Query Pattern

```typescript
// In services.ts
export async function getHadithByNumero(
  numero: string
): Promise<HadithType | null> {
  const hadith = await prisma.hadith.findUnique({
    where: { numero: parseInt(numero) },
    include: {
      chapter: true,
      mentionedSahabas: true,
      hadithTransmitters: {
        include: { transmitter: true },
        orderBy: { order: "asc" }, // Maintain isnad order
      },
    },
  });

  if (!hadith) return null;

  // Transform & validate with Zod
  const transformed = {
    ...hadith,
    isnadTransmitters: hadith.hadithTransmitters.map((ht) => ht.transmitter),
  };
  return HadithSchema.parse(transformed);
}
```

---

## 6. API PATTERNS

### Route Organization

```
app/api/
├── search/route.ts              # GET /api/search?query=...&locale=fr
├── admin/set-admin-role/route.ts
├── export/
│   ├── chapters/route.ts         # GET (Admin)
│   ├── hadiths/route.ts
│   ├── sahabas/route.ts
│   └── transmitters/route.ts
├── import/
│   ├── chapters/route.ts         # POST multipart (Admin)
│   ├── hadiths/route.ts
│   ├── sahabas/route.ts
│   └── transmitters/route.ts
└── full-backup/route.ts
```

### Search API Pattern

**Endpoint**: `GET /api/search`

**Query Parameters**:

```typescript
// Auto-detected filterMode based on presence:
query?: string          // "word" mode
sahabas?: string[]      // "sahaba" mode
transmitters?: string[] // "transmitter" mode
numero?: string         // "numero" mode
locale?: "fr"|"en"|"ar" // Default: "fr"
limit?: number          // Default: 50
offset?: number         // Default: 0
```

**Response**:

```typescript
{
  success: boolean;
  results: HadithType[];  // Locale-aware content selection
  count: number;
  hasMore: boolean;
  error?: string;
}
```

**Implementation Highlights**:

- Locale-aware: only fetches necessary columns (matn_fr for FR, matn_en for EN, etc.)
- Results cached per query+locale+limit
- Uses raw SQL with ILIKE for substring search
- Full hadith data fetched after FTS narrowing

### Export API Pattern

**Endpoint**: `GET /api/export/{chapters|hadiths|sahabas|transmitters}`  
**Auth**: Admin-only (checked via `requireAdmin()`)  
**Response**: JSON file download

```typescript
// Example: /api/export/chapters
const chapters = await prisma.chapter.findMany({
  select: {
    index: true,
    name_fr: true,
    name_ar: true,
    name_en: true,
  },
  orderBy: { index: "asc" },
});

return new NextResponse(JSON.stringify(chapters, null, 2), {
  headers: {
    "Content-Disposition": 'attachment; filename="chapters.json"',
  },
});
```

### Import API Pattern

**Endpoint**: `POST /api/import/{chapters|hadiths|sahabas|transmitters}`  
**Auth**: Admin-only  
**Body**: Multipart form-data with `file` field

```typescript
// Parse uploaded JSON
const formData = await request.formData();
const file = formData.get("file");
const text = await (file as Blob).text();
const body = JSON.parse(text);

// Validate with Zod
const chapters = z.array(ChapterSchema).parse(body);

// Upsert (create or update)
for (const chapter of chapters) {
  const slug = slugify(chapter.name_fr);
  await prisma.chapter.upsert({
    where: { slug },
    update: { ...chapter },
    create: { ...chapter, slug },
  });
}

// Revalidate cache
revalidatePath("/admin");
revalidatePath("/chapters");
```

### Admin Authentication Pattern

**Helper Function**:

```typescript
// src/lib/auth/supabase/helpers.ts
export async function requireAdmin(): Promise<true | ActionResponse> {
  const user = await (await auth()).user;
  if (!user) return { success: false, message: "Not authenticated" };

  const profile = await prisma.profile.findUnique({ where: { id: user.id } });
  if (profile?.role !== "ADMIN") {
    return { success: false, message: "Admin access required" };
  }
  return true;
}
```

Used in API routes and server actions for consistent gating.

---

## 7. COMPONENT PATTERNS

### Server vs. Client Components

**Server Components** (default in Next.js 15):

- Layout: `app/[locale]/layout.tsx`
- Pages: `app/[locale]/{chapters,sahabas,transmitters}/page.tsx`
- Admin pages: `app/[locale]/admin/page.tsx`
- Use Prisma directly, server actions

**Client Components** (`"use client"`):

- `src/ui/Header/Header.tsx` → interactive nav
- `src/hooks/useSearch.tsx` → context + hooks
- Form components → React Hook Form + state
- Interactive filters & search

### Component Structure

#### Server Page Example

```typescript
// app/[locale]/chapters/page.tsx
export async function generateMetadata() {
  const t = await getTranslations("chapters");
  return { title: t("title") };
}

export default async function ChaptersPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const chapters = await getAllChapters();
  return <ChaptersList chapters={chapters} />;
}
```

#### Client Hook Example

```typescript
// src/hooks/useSearch.ts
export function useSearch({ filterMode, query, locale }: UseSearchProps) {
  const [results, setResults] = useState<HadithType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      // ... debounced search logic
      const response = await fetch(`/api/search?${params}`);
      const data = await response.json();
      setResults(data.results);
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [filterMode, query, locale]);

  return { results, isLoading };
}
```

#### Context/Provider Pattern

```typescript
// src/hooks/useAuth.tsx
"use client";

const AuthContext = createContext<AuthContextType>();

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Listen to Supabase auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        updateUserAndRole(session?.user ?? null);
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be within AuthProvider");
  return context;
}
```

### Form Component Pattern

```typescript
// src/ui/forms/ItemForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type Props = { variant: VariantType; items: ItemType[] };

export function ItemForm({ variant, items }: Props) {
  const schema = getItemFormSchema(items, variant);
  const form = useForm<ItemFormValues>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: ItemFormValues) {
    const result = await addItem(variant, data);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

### Component Export Convention

```typescript
// ✅ Correct
export function MyComponent() {
  return <div>...</div>;
}

// ❌ Avoid arrow functions for components
const MyComponent = () => { ... };
export default MyComponent;
```

---

## 8. SPECIAL PROJECT CONVENTIONS

### 1. **Tri-lingual by Design**

Every content entity supports FR/AR/EN:

- Database fields: `name_fr`, `name_ar`, `name_en`
- Locale routing: `app/[locale]/` where locale ∈ {fr, en, ar}
- Conditional field selection in queries (performance optimization)
- RTL support for Arabic: `dir={locale === "ar" ? "rtl" : "ltr"}`

### 2. **Quranic/Islamic Decorations**

Files often start with:

```typescript
/*  🕋 بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ 🕋*/
// In the name of Allah, the Most Merciful
```

This is **stylistic only**—not part of the functional convention.

### 3. **English-Only Comments**

```typescript
// ALL CODE COMMENTS MUST BE IN ENGLISH
// No French comments in code, even though the app is French-first
const locale = "fr"; // locale for French
```

### 4. **Locale-Aware Zod Schemas**

```typescript
// src/types/types.ts
export const ItemFormValuesSchema = SchemaItemStructure.omit({
  id: true,
  slug: true,
});

// Zod schemas use `.omit()` instead of TypeScript `Omit` utility
// Allows schema-driven validation & precise error messages
```

### 5. **Slug-Based Routing + URL Safety**

All list items (chapters, sahabas, transmitters) have:

- Auto-generated slug from French name
- Example: "Abu Hurairah" → "abu-hurairah"
- Used in display URLs: `/[locale]/chapters/[slug]`

### 6. **Server Actions for Mutations**

```typescript
// src/services/actions.ts - marked "use server"
"use server";

export async function addItem(
  variant: VariantType,
  data: ItemFormValues
): Promise<ActionResponse> {
  // Admin auth checked first
  const adminCheck = await requireAdmin();
  if (adminCheck !== true) return adminCheck;

  // Validation via Zod
  const schema = getItemFormSchema(...);
  const parseResult = schema.safeParse(data);

  // DB operation
  const created = await prisma.chapter.create({ ... });

  // Always revalidate affected paths
  revalidatePath("/chapters");
  revalidatePath("/search");

  return { success: true, data: created };
}
```

Pattern:

1. Validate auth
2. Validate data (Zod)
3. Execute DB operation
4. Revalidate paths
5. Return structured response

### 7. **Caching & Performance**

- **Search results cached** in memory per query+locale
- **Prisma select** only needed columns per locale
- **Debounced search** (300ms) via `useSearch` hook
- **Next.js ISR** for static pages (not all routes are static)

### 8. **Error Handling Pattern**

```typescript
export async function addItem(...): Promise<ActionResponse> {
  try {
    // ... operation
    return { success: true, message: "Success", data };
  } catch (error: unknown) {
    let userMessage = "Erreur inconnue";

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        userMessage = "Cet élément existe déjà";
      }
    }

    console.error("Error:", error instanceof Error ? error : { error });
    return { success: false, message: userMessage };
  }
}
```

Pattern: Catch Prisma errors specifically, provide user-friendly messages, log details.

### 9. **Type Safety Over Any**

```typescript
// ❌ Avoid
const data: any = ...;

// ✅ Use specific types
type SearchResult = {
  id: string;
  numero: number;
  ...
};

// ✅ Use `unknown` when necessary, then narrow
catch (error: unknown) {
  if (error instanceof Error) { ... }
}
```

---

## 9. FILE NAMING & ORGANIZATION

### Naming Conventions

| Item          | Pattern                  | Example                                                  |
| ------------- | ------------------------ | -------------------------------------------------------- |
| Components    | PascalCase               | `Header.tsx`, `ItemForm.tsx`                             |
| Hooks         | camelCase, prefix `use`  | `useSearch.ts`, `useAuth.tsx`                            |
| Utilities     | camelCase                | `slugify.ts`, `searchUtils.ts`                           |
| Types/Schemas | Named exports, CamelCase | `HadithType`, `ItemFormValues`                           |
| Constants     | UPPER_SNAKE_CASE         | `DEBOUNCE_MS = 300`                                      |
| Files         | Lowercase or PascalCase  | `src/utils/searchUtils.ts` or `src/ui/Header/Header.tsx` |

### Directory Organization

**By Feature** (preferred for reusable UI):

```
src/ui/
├── Header/
│   ├── Header.tsx
│   ├── Logo.tsx
│   ├── NavBar.tsx
│   └── HeaderActions.tsx
├── hadith/
│   ├── HadithCard.tsx
│   └── HadithDetail.tsx
└── forms/
```

**By Type** (utilities, hooks, services):

```
src/
├── hooks/          # All custom hooks
├── utils/          # All utilities
├── services/       # All data services
└── lib/            # Shared library code
```

**Test Files Mirror Source**:

```
src/utils/searchUtils.ts     → __tests__/searchUtils.test.ts
src/hooks/useSearch.ts       → __tests__/useSearch.test.tsx
src/services/services.ts     → __tests__/services.test.ts
```

### Path Aliases (tsconfig.json)

```typescript
import { xxx } from "@/src/utils/..."      // ✅ Correct
import { xxx } from "@/src/types/..."      // ✅ Correct
import { xxx } from "@/src/ui/..."         // ✅ Correct
import { xxx } from "../utils/..."         // ❌ Avoid relative paths

// Configured aliases:
"@/app/*": ["./app/*"],
"@/ui/*": ["./src/ui/*"],
"@/components/*": ["./src/components/*"],
"@/hooks/*": ["./src/hooks/*"],
"@/utils/*": ["./src/utils/*"],
"@/i18n/*": ["./src/i18n/*"],
"@/src/*": ["./src/*"],
```

---

## 10. INTERNATIONALIZATION (i18n) PATTERNS

### Setup

**Library**: `next-intl` v4.5.8

**Locale Definition**:

```typescript
// src/i18n/routing.ts
export const routing = defineRouting({
  locales: ["fr", "en", "ar"],
  defaultLocale: "fr",
  localeDetection: true, // Auto-detect from headers
});
```

**Supported Locales**: French (default), English, Arabic (RTL)

### Message Files

```json
// src/messages/fr.json
{
  "chapters": {
    "title": "Liste des Chapitres",
    "notFound": "Chapitre non trouvé"
  },
  "hadith": {
    "from": "D'après ",
    "mentioned-sahabas": "{count, plural, =1 {Sahaba mentionné} other {Sahabas mentionnés}}"
  }
}
```

ICU message format supported for plurals.

### Configuration

```typescript
// src/i18n/request.ts
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

### Server-Side Usage

```typescript
// In Server Components / Server Actions
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function Page(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations("chapters");
  return <h1>{t("title")}</h1>;
}

export async function generateMetadata() {
  const t = await getTranslations("layout");
  return {
    title: t("title"),
    description: t("description"),
  };
}
```

### Client-Side Usage

```typescript
"use client";

import { useTranslations } from "next-intl";

export function MyComponent() {
  const t = useTranslations("hadith");
  return <p>{t("from")}</p>;
}
```

### Locale in URLs

```typescript
// Automatic via [locale] segment:
/fr/chapters/        // French
/en/chapters/        // English
/ar/chapters/        // Arabic (served RTL)

// Locale routing in Next.js:
<html dir={locale === "ar" ? "rtl" : "ltr"} lang={locale}>
```

### Tri-Lingual Data Handling

All API responses include tri-lingual fields. Client can:

1. **Fetch all three** (simplest)
2. **Fetch only needed** (optimized in search API)
3. **Use locale-aware utility**:

```typescript
// src/utils/getLocalizedMatn.ts
export function getLocalizedMatn(hadith: HadithType, locale: string): string {
  if (locale === "ar") return hadith.matn_ar;
  if (locale === "en") return hadith.matn_en;
  return hadith.matn_fr;
}
```

### Message Namespacing

```typescript
const t = await getTranslations("chapters");
t("title"); // → chapters.title from JSON

const t = await getTranslations("hadith");
t("from"); // → hadith.from from JSON
```

---

## SUMMARY: KEY TAKEAWAYS

| Aspect           | Pattern                                                                     |
| ---------------- | --------------------------------------------------------------------------- |
| **Architecture** | Feature-based routing + Service layer + Component library                   |
| **Data**         | Prisma ORM + Zod validation + PostgreSQL FTS                                |
| **API**          | RESTful routes with Admin gating + Zod parsing                              |
| **Components**   | Server-first (async) with Client islands for interactivity                  |
| **Hooks**        | Custom hooks for search/auth with debouncing                                |
| **Auth**         | Supabase JWT + Context API (useAuth) + Server action guards                 |
| **Forms**        | React Hook Form + Zod schemas + Toast feedback                              |
| **i18n**         | next-intl with FR/EN/AR routing + JSON messages                             |
| **Testing**      | Vitest + @testing-library + User Event                                      |
| **Build**        | Next.js 15 + Turbopack + React Compiler                                     |
| **Code Style**   | Export functions (not arrow), English comments only, `type` not `interface` |

---

## OBSERVED DEVIATIONS FROM STANDARD NEXT.JS

1. **Custom FTS via ILIKE** (not native Postgres FTS)
2. **In-memory search caching** (singleton pattern, not standard)
3. **Hardcoded schema per locale** (search columns selected by locale in API)
4. **No Next.js Cache API used** (manual revalidatePath for data updates)
5. **Server actions over Route handlers** for mutations (preferred pattern)

---

**Document Version**: 1.0  
**Last Reviewed**: Codebase state as of Feb 2026
