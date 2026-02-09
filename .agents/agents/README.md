# 🤖 Custom Agents for Sahih Muslim Project

This directory contains custom agents that orchestrate Vercel Labs skills for specialized development workflows.

## Available Agents

### 1. **CodeReviewer** 🔍

**Full-scope code review combining all Vercel best practices**

Use when you need comprehensive feedback on:

- Performance (waterfalls, bundle size, caching)
- Component architecture (composition patterns, props design)
- Design & accessibility (UX, WCAG, Dark mode, RTL)

**How to invoke:**

```
Chat: Select agent → CodeReviewer
→ Provide files or describe what to review
```

**Example:**

```
@CodeReviewer Review src/ui/ for overall quality improvements
→ Agent loads all 3 Vercel skills + project context
→ Returns structured feedback on all 3 dimensions
```

---

### 2. **PerformanceOptimizer** ⚡

**Performance-focused optimization using Vercel React best practices**

Use when optimizing:

- Load time and Core Web Vitals
- Data fetching waterfalls
- JavaScript bundle size
- Server-side caching strategies
- Re-render patterns

Critical for Sahih Muslim:

- SearchService caching layer
- Hadith list rendering (large datasets → virtualization)
- Locale-aware data fetching efficiency

**How to invoke:**

```
Chat: Select agent → PerformanceOptimizer
→ Point to specific files or performance concerns
```

**Example:**

```
@PerformanceOptimizer Analyze src/services/searchServices.ts for fetch waterfalls
→ Agent applies 57 Vercel rules
→ Shows exact lines with opportunities (e.g., "parallelize queries")
→ Provides implementation code
```

---

### 3. **ComponentArchitect** 🏗️

**Component design and refactoring using composition patterns**

Use when:

- Designing new component APIs
- Refactoring components with many boolean props
- Building reusable component libraries
- Implementing React 19 patterns
- Planning complex UI structures

Critical for Sahih Muslim:

- `src/ui/` components: Reduce boolean props
- Admin forms: Compound patterns
- Search results: Flexible layout composition
- Hadith cards: Multiple display variants → single flexible component

**How to invoke:**

```
Chat: Select agent → ComponentArchitect
→ Provide component file or describe desired structure
```

**Example:**

```
@ComponentArchitect Refactor src/ui/HadithCard.tsx - it has too many props
→ Agent analyzes current structure
→ Proposes compound component pattern
→ Shows before/after code with benefits
→ Estimates refactoring effort
```

---

## Workflow Examples

### Full Code Review Sprint

```
1. @CodeReviewer Audit src/ui/ and src/services/
   ↓ Get overview of all issues across all dimensions

2. @PerformanceOptimizer Focus on searchServices.ts
   ↓ Deep dive into performance optimizations

3. @ComponentArchitect Design new SearchFilters component
   ↓ Build improved component architecture
```

### Feature Implementation

```
1. @ComponentArchitect Design the component API first
   ↓ Ensure flexible, composable structure

2. Implement the component

3. @PerformanceOptimizer Run performance check
   ↓ Optimize before merge

4. @CodeReviewer Final comprehensive review
   ↓ Catch any remaining issues
```

### PR Review

```
Pull request with multiple component changes?
→ @CodeReviewer src/ui/* src/services/*
→ Get complete feedback from all Vercel skill perspectives
```

---

## Project Context (Pre-Loaded)

These agents understand your Sahih Muslim project:

**Stack:**

- Next.js 16 (App Router, Turbopack)
- React 19 (supports new APIs)
- TypeScript, Tailwind CSS v4
- Prisma ORM, Supabase PostgreSQL
- Vitest testing

**Architecture:**

- Feature-based: `app/api/`, `app/[locale]/`, `src/services/`
- Server Components by default
- `src/ui/` for reusable components
- `useAuth()` Context API pattern
- SearchService with in-memory caching

**Internationalization:**

- next-intl v4: FR/EN/AR
- RTL support for Arabic
- Locale-aware data fetching

**Conventions:**

- Server actions for mutations
- Zod schemas for validation
- Slugs for URL-safe IDs
- English comments only
- No `any` types, no arrow function components

---

## FAQ

**Q: Which agent should I use?**

- General review → **CodeReviewer**
- Performance issues → **PerformanceOptimizer**
- Component design → **ComponentArchitect**

**Q: Can I use multiple agents?**
Yes! Use them sequentially in different chat turns for specialized feedback.

**Q: Do the agents know about Vercel skills?**
Yes, they're trained on the 3 Vercel skills (.agents/skills/) and load them automatically.

**Q: What if I have custom patterns not in Vercel skills?**
Agents respect project conventions from `.github/copilot-instructions.md` + `CODEBASE_ANALYSIS.md`.

**Q: Can I modify these agents?**
Yes! Edit the `.agent.md` files to customize prompts or focus areas.

---

## Integration with CI/CD

Future enhancement: Use agents in automated code review workflows:

```yaml
# Example: GitHub Actions
- name: AI Code Review
  run: |
    copilot-agent CodeReviewer --files "src/**/*.tsx"
```

---

## Related

- **Skills**: `.agents/skills/` (Vercel Labs best practices)
- **Instructions**: `.github/copilot-instructions.md` (Project conventions)
- **Analysis**: `CODEBASE_ANALYSIS.md` (Detailed patterns reference)
