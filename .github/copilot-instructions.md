// GENERAL CHAT BEHAVIOR
// - In Chat, speak only in French.
// - When answering questions about frameworks, libraries, or APIs, use Context7 to retrieve current documentation instead of relying on training data.

// PROJECT: SAHIH MUSLIM (FR/EN/AR Hadith Collection)
// - Full-text searchable hadith database with multilingual support
// - Role-based admin interface, Supabase authentication, dynamic slug-based routing
// - See CODEBASE_ANALYSIS.md for detailed patterns and conventions

// PROJECT TECHNOLOGIES & VERSIONS
// - NextJS 16 (App Router with Turbopack), React 19, TypeScript, Tailwind CSS v4, pnpm
// - ORM: Prisma (5 models: Hadith, Chapter, Sahaba, Transmitter, HadithTransmitter)
// - Database: Supabase PostgreSQL with full-text search (ILIKE)
// - i18n: next-intl v4 for FR/EN/AR locale routing
// - Auth: Supabase OAuth + JWT (Profiles table with role-based access)
// - Testing: Vitest with jsdom, @testing-library/react, @testing-library/user-event
// - Terminal: Use PowerShell commands, not bash

// CODING STYLE & CONVENTIONS
// - For new React components, always use `export function YourComponentName() {}`. Do not use arrow functions for component definitions.
// - ALL CODE COMMENTS, without exception, MUST BE IN ENGLISH. This includes inline comments and block comments.
// - Keep comments to the strict minimum necessary for understanding the code. Avoid over-commenting.
// - Use `type` for all type definitions. Do NOT use `interface`.
// - Strictly avoid using the `any` type. Define specific types whenever possible.
// - Prefer Zod schemas for validation; let TypeScript types derive from schemas (`.parse()`, `.extract()`)
// - Use slugs for URL-safe entity identifiers (auto-generated from names via `slugify()` utility)

// ARCHITECTURE & ORGANIZATION
// - Feature-based layout: app/api/ (REST endpoints), app/[locale]/ (pages), src/services/ (business logic)
// - Server Components by default (fetch data in layouts/pages); Client Components only for interactivity ("use client")
// - Server actions in actions.ts for mutations (preferred over POST endpoints for internal operations)
// - src/ui/ for reusable components, src/hooks/ for custom hooks, src/utils/ for utilities
// - API routes: GET /search (4 modes: word/sahaba/transmitter/numero), admin CRUD endpoints in /admin/
// - Path aliases: @/ → root, @/ui → src/ui/, @/hooks → src/hooks/, @/utils → src/utils/, @/i18n → src/i18n/

// DATABASE & MODELS
// - Hadith model: core entity with tri-lingual fields (matn_fr, matn_en, matn_ar), chapter_id, number, slug
// - HadithTransmitter: Join table with .order property to maintain isnad (transmission chain) sequence
// - Unique slugs per locale + entity type preventing route conflicts
// - Always fetch locale-specific columns only (e.g., search: include matn_fr + matn_ar for FR user, not matn_en)

// SEARCH & PERFORMANCE
// - Full-text search via PostgreSQL ILIKE (case-insensitive contains)
// - In-memory cache by (query, locale, limit) key in SearchService
// - 4 search modes: word search, by sahaba (companion), by transmitter, by hadith number
// - Cache invalidation on create/update/delete hadiths
// - See src/services/searchServices.ts for implementation patterns

// INTERNATIONALIZATION (i18n)
// - next-intl v4: Automatic locale routing [locale]/...
// - 3 languages: FR (default), EN, AR (RTL handled via dir prop in layouts)
// - All entity names: name_fr, name_ar, name_en in database schema
// - Messages JSON in src/i18n/messages/ organized by namespace (chapters, hadith, etc.)
// - API: Always return the 3 versions; client selects based on locale

// AUTHENTICATION & AUTHORIZATION
// - Supabase OAuth for login → stored in Profiles table with role (USER/ADMIN)
// - useAuth() hook provides current user from Context API
// - Server actions: requireAdmin() function enforces admin checks
// - Protected admin routes: server-side verification + redirect to /login if unauthorized

// UI/UX DESIGN
// - Ensure UI design is consistent with the existing project's style (see src/ui/ components)
// - All UI components and pages MUST fully support dark mode
// - Arabic text (RTL) layout automatically handled by next-intl when locale=ar

// TESTING
// - For tests, use Vitest as the test runner.
// - Use `vi` for mocking and spying.
// - Use `@testing-library/user-event` for simulating user interactions.
// - Use for mock hadith data: `import { mockHadith } from '@/__mocks__/';`
// - Test file structure mirrors src/ (e.g., src/utils/slugify.ts → **tests**/slugify.test.ts)

// BUILD & RUN COMMANDS
// - Dev: `pnpm dev` (Turbopack enabled, runs on localhost:3000)
// - Test: `pnpm test` (watch mode), `pnpm test:coverage` (coverage report)
// - Prisma: `pnpm prisma:migrate` (apply migrations), `pnpm prisma:studio` (Prisma Studio GUI)
// - Format: `pnpm format` (Prettier), Lint: `pnpm lint` (ESLint flat config)
// - Build: `pnpm build`, Production: `pnpm start`

// AGENT SKILLS (Vercel Labs)
// Skills are available in .agents/skills/ and configured for automatic use
// - vercel-react-best-practices: 57 rules for React/Next.js perf optimization (waterfalls, bundle size, caching)
// - vercel-composition-patterns: React composition patterns (compound components, context providers, React 19 APIs)
// - web-design-guidelines: Audit UI code against Web Interface Guidelines (accessibility, design best practices)

// CUSTOM AGENTS (Orchestrating Skills)
// Custom agents in .agents/agents/ for specialized workflows
// - CodeReviewer: Comprehensive review using all 3 skills (performance + architecture + design)
// - PerformanceOptimizer: Focused on vercel-react-best-practices (waterfalls, bundle, caching, re-renders)
// - ComponentArchitect: Focused on composition patterns (compound components, API design, React 19)

// FORMATTING & ERROR HANDLING
// - If code formatting fails after 2-3 attempts, abandon the formatting fixes and proceed with functional changes only.
// - Code formatting issues should be handled manually by the user via prettier if needed.
// - Do not run prettier commands automatically unless specifically requested.
// - Do not run `pnpm dev` or similar development commands to test code unless specifically requested, as the project may already be running.
// - When mutations happen, revalidate paths: `revalidatePath('/admin/hadiths')` to clear Next.js cache.

// NEXT.JS 16 SPECIFICS (PARAMS & SEARCHPARAMS as PROMISES)
// - Params and searchParams are Promises in Next.js 16 Route Handlers and Server Components
// - Always await them: const params = await props.params; const searchParams = await props.searchParams;
// - Use `use()` hook in Client Components to unwrap Promise props
// - Locale param always included in route: params.locale (FR/EN/AR)
// - Use generateStaticParams() for static generation of dynamic routes based on locale + slug
