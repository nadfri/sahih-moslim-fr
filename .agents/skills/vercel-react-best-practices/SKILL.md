---
name: vercel-react-best-practices
description: React and Next.js performance optimization guidelines from Vercel Engineering. This skill should be used when writing, reviewing, or refactoring React/Next.js code to ensure optimal performance patterns. Triggers on tasks involving React components, Next.js pages, data fetching, bundle optimization, or performance improvements.
license: MIT
metadata:
  author: vercel
  version: "1.0.0"
---

# Vercel React Best Practices

Comprehensive performance optimization guide for React and Next.js applications, maintained by Vercel. Contains 57 rules across 8 categories, prioritized by impact to guide automated refactoring and code generation.

## When to Apply

Reference these guidelines when:

- Writing new React components or Next.js pages
- Implementing data fetching (client or server-side)
- Reviewing code for performance issues
- Refactoring existing React/Next.js code
- Optimizing bundle size or load times

## Rule Categories by Priority

| Priority | Category                  | Impact      | Prefix       |
| -------- | ------------------------- | ----------- | ------------ |
| 1        | Eliminating Waterfalls    | CRITICAL    | `async-`     |
| 2        | Bundle Size Optimization  | CRITICAL    | `bundle-`    |
| 3        | Server-Side Performance   | HIGH        | `server-`    |
| 4        | Client-Side Data Fetching | MEDIUM-HIGH | `client-`    |
| 5        | Re-render Optimization    | MEDIUM      | `rerender-`  |
| 6        | Rendering Performance     | MEDIUM      | `rendering-` |
| 7        | JavaScript Performance    | LOW-MEDIUM  | `js-`        |
| 8        | Advanced Patterns         | LOW         | `advanced-`  |

## Quick Reference

### 1. Eliminating Waterfalls (CRITICAL)

- `async-defer-await` - Move await into branches where actually used
- `async-parallel` - Use Promise.all() for independent operations
- `async-dependencies` - Use better-all for partial dependencies
- `async-api-routes` - Start promises early, await late in API routes
- `async-suspense-boundaries` - Use Suspense to stream content

### 2. Bundle Size Optimization (CRITICAL)

- `bundle-barrel-imports` - Import directly, avoid barrel files
- `bundle-dynamic-imports` - Use next/dynamic for heavy components
- `bundle-defer-third-party` - Load analytics/logging after hydration
- `bundle-conditional` - Load modules only when feature is activated
- `bundle-preload` - Preload on hover/focus for perceived speed

### 3. Server-Side Performance (HIGH)

- `server-auth-actions` - Authenticate server actions like API routes
- `server-cache-react` - Use React.cache() for per-request deduplication
- `server-cache-lru` - Use LRU cache for cross-request caching
- `server-dedup-props` - Avoid duplicate serialization in RSC props
- `server-serialization` - Minimize data passed to client components
- `server-parallel-fetching` - Restructure components to parallelize fetches
- `server-after-nonblocking` - Use after() for non-blocking operations

### 4. Client-Side Data Fetching (MEDIUM-HIGH)

- `client-swr-dedup` - Use SWR for automatic request deduplication
- `client-event-listeners` - Deduplicate global event listeners
- `client-passive-event-listeners` - Use passive listeners for scroll
- `client-localstorage-schema` - Version and minimize localStorage data

### 5. Re-render Optimization (MEDIUM)

- `rerender-defer-reads` - Don't subscribe to state only used in callbacks
- `rerender-memo` - Extract expensive work into memoized components
- `rerender-memo-with-default-value` - Hoist default non-primitive props
- `rerender-dependencies` - Use primitive dependencies in effects
- `rerender-derived-state` - Subscribe to derived booleans, not raw values
- `rerender-derived-state-no-effect` - Derive state during render, not effects
- `rerender-functional-setstate` - Use functional setState for stable callbacks
- `rerender-lazy-state-init` - Pass function to useState for expensive values
- `rerender-simple-expression-in-memo` - Avoid memo for simple primitives
- `rerender-move-effect-to-event` - Put interaction logic in event handlers
- `rerender-transitions` - Use startTransition for non-urgent updates
- `rerender-use-ref-transient-values` - Use refs for transient frequent values

### 6. Rendering Performance (MEDIUM)

- `rendering-animate-svg-wrapper` - Animate div wrapper, not SVG element
- `rendering-content-visibility` - Use content-visibility for long lists
- `rendering-hoist-jsx` - Extract static JSX outside components
- `rendering-svg-precision` - Reduce SVG coordinate precision
- `rendering-hydration-no-flicker` - Use inline script for client-only data
- `rendering-hydration-suppress-warning` - Suppress expected mismatches
- `rendering-activity` - Use Activity component for show/hide
- `rendering-conditional-render` - Use ternary, not && for conditionals
- `rendering-usetransition-loading` - Prefer useTransition for loading state

### 7. JavaScript Performance (LOW-MEDIUM)

- `js-batch-dom-css` - Group CSS changes via classes or cssText
- `js-index-maps` - Build Map for repeated lookups
- `js-cache-property-access` - Cache object properties in loops
- `js-cache-function-results` - Cache function results in module-level Map
- `js-cache-storage` - Cache localStorage/sessionStorage reads
- `js-combine-iterations` - Combine multiple filter/map into one loop
- `js-length-check-first` - Check array length before expensive comparison
- `js-early-exit` - Return early from functions
- `js-hoist-regexp` - Hoist RegExp creation outside loops
- `js-min-max-loop` - Use loop for min/max instead of sort
- `js-set-map-lookups` - Use Set/Map for O(1) lookups
- `js-tosorted-immutable` - Use toSorted() for immutability

### 8. Advanced Patterns (LOW)

- `advanced-event-handler-refs` - Store event handlers in refs
- `advanced-init-once` - Initialize app once per app load
- `advanced-use-latest` - useLatest for stable callback refs

## How to Use This Skill

**⚠️ IMPORTANT: DO NOT load AGENTS.md (2935 lines) - it consumes too much context!**

Instead, use this efficient loading strategy:

### 1. Start with Quick Reference (~200 lines)

For overview and quick lookup:

```
QUICK-REFERENCE.md
```

### 2. Load Only Relevant Category (~200-600 lines)

Based on the issue type, load the specific category file:

| Issue Type                         | File to Load                  | Lines | Impact      |
| ---------------------------------- | ----------------------------- | ----- | ----------- |
| Slow data fetching, waterfalls     | `categories/01-waterfalls.md` | ~287  | CRITICAL    |
| Large bundle size, slow imports    | `categories/02-bundle.md`     | ~150  | CRITICAL    |
| Server-side performance, auth      | `categories/03-server.md`     | ~449  | HIGH        |
| Client-side fetching, events       | `categories/04-client.md`     | ~241  | MEDIUM-HIGH |
| Re-render issues, state management | `categories/05-rerender.md`   | ~527  | MEDIUM      |
| Rendering performance, hydration   | `categories/06-rendering.md`  | ~387  | MEDIUM      |
| JavaScript micro-optimizations     | `categories/07-javascript.md` | ~615  | LOW-MEDIUM  |
| Advanced patterns, edge cases      | `categories/08-advanced.md`   | ~127  | LOW         |

### 3. Load Individual Rules (Optional)

For specific guidance, read individual rule files:

```
rules/async-parallel.md
rules/bundle-barrel-imports.md
```

### Workflow for Agents

```
1. Identify issue category (e.g., "component re-renders too often")
2. Load QUICK-REFERENCE.md to confirm category (→ Re-render Optimization)
3. Load categories/05-rerender.md (~527 lines vs 2935 for full AGENTS.md)
4. Apply relevant rules
5. (Optional) Load specific rule file if more detail needed
```

**Context savings: ~90% reduction** (300-600 lines vs 2935 lines)

## File Structure

```
vercel-react-best-practices/
├── SKILL.md                 # This file (index + usage guide)
├── QUICK-REFERENCE.md       # Condensed overview (~200 lines)
├── AGENTS.md                # Full document (⚠️ 2935 lines - avoid loading!)
├── categories/              # Category-specific files
│   ├── 01-waterfalls.md     # Eliminating Waterfalls (CRITICAL)
│   ├── 02-bundle.md         # Bundle Size Optimization (CRITICAL)
│   ├── 03-server.md         # Server-Side Performance (HIGH)
│   ├── 04-client.md         # Client-Side Data Fetching (MEDIUM-HIGH)
│   ├── 05-rerender.md       # Re-render Optimization (MEDIUM)
│   ├── 06-rendering.md      # Rendering Performance (MEDIUM)
│   ├── 07-javascript.md     # JavaScript Performance (LOW-MEDIUM)
│   └── 08-advanced.md       # Advanced Patterns (LOW)
└── rules/                   # Individual rule files (granular detail)
```

## Priority Guide

When optimizing code, follow this order:

1. **CRITICAL** (categories 1-2): Waterfalls, bundle size → 2-10× improvement
2. **HIGH** (category 3): Server-side performance → reduces load time, security
3. **MEDIUM-HIGH** (category 4): Client-side fetching → better UX
4. **MEDIUM** (categories 5-6): Re-renders, rendering → improves responsiveness
5. **LOW-MEDIUM** (category 7): JavaScript optimizations → cumulative gains
6. **LOW** (category 8): Advanced patterns → specific edge cases
