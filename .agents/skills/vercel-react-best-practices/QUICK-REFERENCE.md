# Vercel React Best Practices - Quick Reference

**Version 1.0.0** | Vercel Engineering | January 2026

> **Usage:** This is a condensed reference. For detailed examples, read the specific category file in `categories/`.

---

## 1. Eliminating Waterfalls — **CRITICAL IMPACT**

| Rule                               | Problem                                    | Solution                                    | File                                               |
| ---------------------------------- | ------------------------------------------ | ------------------------------------------- | -------------------------------------------------- |
| **1.1** Defer Await                | Awaits block unused code paths             | Move await into branches where needed       | [01-waterfalls.md](categories/01-waterfalls.md#11) |
| **1.2** Dependency Parallelization | Sequential awaits for partial dependencies | Use `better-all` or manual promise chaining | [01-waterfalls.md](categories/01-waterfalls.md#12) |
| **1.3** API Route Waterfalls       | Sequential awaits in API routes            | Start all promises early, await late        | [01-waterfalls.md](categories/01-waterfalls.md#13) |
| **1.4** Promise.all()              | Sequential independent fetches             | Use `Promise.all()` for parallel execution  | [01-waterfalls.md](categories/01-waterfalls.md#14) |
| **1.5** Suspense Boundaries        | Entire page waits for data                 | Use `<Suspense>` to stream components       | [01-waterfalls.md](categories/01-waterfalls.md#15) |

---

## 2. Bundle Size Optimization — **CRITICAL IMPACT**

| Rule                        | Problem                                             | Solution                                   | File                                       |
| --------------------------- | --------------------------------------------------- | ------------------------------------------ | ------------------------------------------ |
| **2.1** Barrel Imports      | Loading 1000s of unused modules (200-800ms)         | Import directly from source files          | [02-bundle.md](categories/02-bundle.md#21) |
| **2.2** Conditional Loading | Large data loads when feature disabled              | Import modules only when feature activates | [02-bundle.md](categories/02-bundle.md#22) |
| **2.3** Third-Party Defer   | Analytics/logging blocks hydration                  | Use `next/dynamic` with `ssr: false`       | [02-bundle.md](categories/02-bundle.md#23) |
| **2.4** Dynamic Imports     | Heavy components in initial bundle (Monaco, charts) | Use `next/dynamic` for code-splitting      | [02-bundle.md](categories/02-bundle.md#24) |
| **2.5** Preload Intent      | Modules load when clicked (perceived latency)       | Preload on hover/focus with `import()`     | [02-bundle.md](categories/02-bundle.md#25) |

---

## 3. Server-Side Performance — **HIGH IMPACT**

| Rule                                  | Problem                                     | Solution                              | File                                       |
| ------------------------------------- | ------------------------------------------- | ------------------------------------- | ------------------------------------------ |
| **3.1** Server Action Auth            | Server Actions are public endpoints         | Always verify auth inside action      | [03-server.md](categories/03-server.md#31) |
| **3.2** RSC Serialization Duplication | `.toSorted()` duplicates array in props     | Pass original, transform in client    | [03-server.md](categories/03-server.md#32) |
| **3.3** LRU Caching                   | Repeated queries across requests            | Use LRU cache (e.g., `lru-cache`)     | [03-server.md](categories/03-server.md#33) |
| **3.4** Minimize RSC Data             | Entire object serialized, only 1 field used | Pass only needed fields to client     | [03-server.md](categories/03-server.md#34) |
| **3.5** Parallel Fetching             | Sequential RSC fetches (Header → Sidebar)   | Compose components, fetch in parallel | [03-server.md](categories/03-server.md#35) |
| **3.6** React.cache()                 | Duplicate queries in one request            | Wrap with `React.cache()`             | [03-server.md](categories/03-server.md#36) |
| **3.7** after()                       | Logging blocks response                     | Use `after()` for non-blocking work   | [03-server.md](categories/03-server.md#37) |

---

## 4. Client-Side Data Fetching — **MEDIUM-HIGH IMPACT**

| Rule                            | Problem                              | Solution                           | File                                       |
| ------------------------------- | ------------------------------------ | ---------------------------------- | ------------------------------------------ |
| **4.1** Event Listener Dedup    | N instances = N global listeners     | Use `useSWRSubscription()`         | [04-client.md](categories/04-client.md#41) |
| **4.2** Passive Listeners       | Touch/wheel events delay scroll      | Add `{ passive: true }` option     | [04-client.md](categories/04-client.md#42) |
| **4.3** SWR Deduplication       | Each instance fetches separately     | Use `useSWR()` for automatic dedup | [04-client.md](categories/04-client.md#43) |
| **4.4** localStorage Versioning | Schema conflicts, large storage size | Version keys, store minimal fields | [04-client.md](categories/04-client.md#44) |

---

## 5. Re-render Optimization — **MEDIUM IMPACT**

| Rule                          | Problem                                 | Solution                               | File                                            |
| ----------------------------- | --------------------------------------- | -------------------------------------- | ----------------------------------------------- |
| **5.1** Derived State         | State + effect for computed value       | Compute during render                  | [05-rerender.md](categories/05-rerender.md#51)  |
| **5.2** Defer State Reads     | Subscribe to params only for callbacks  | Read directly in callback (no hook)    | [05-rerender.md](categories/05-rerender.md#52)  |
| **5.3** Simple Expressions    | `useMemo` for primitive results         | No memo for simple expressions         | [05-rerender.md](categories/05-rerender.md#53)  |
| **5.4** Default Props         | New object/array per render breaks memo | Extract defaults to constants          | [05-rerender.md](categories/05-rerender.md#54)  |
| **5.5** Memoized Components   | Heavy work runs even when loading       | Extract to `memo()` component          | [05-rerender.md](categories/05-rerender.md#55)  |
| **5.6** Narrow Dependencies   | Effect runs on any object change        | Use primitive dependencies             | [05-rerender.md](categories/05-rerender.md#56)  |
| **5.7** Event Handlers        | State + effect for user action          | Put logic in event handler             | [05-rerender.md](categories/05-rerender.md#57)  |
| **5.8** Derived Subscriptions | Re-render on every pixel (width)        | Subscribe to boolean (isMobile)        | [05-rerender.md](categories/05-rerender.md#58)  |
| **5.9** Functional setState   | Stale closures, callback recreations    | Use `setState(curr => ...)`            | [05-rerender.md](categories/05-rerender.md#59)  |
| **5.10** Lazy State Init      | Expensive init runs every render        | Pass function to `useState()`          | [05-rerender.md](categories/05-rerender.md#510) |
| **5.11** Transitions          | Frequent updates block UI               | Use `startTransition()`                | [05-rerender.md](categories/05-rerender.md#511) |
| **5.12** useRef Transient     | Mouse tracking re-renders               | Store in `useRef`, update DOM directly | [05-rerender.md](categories/05-rerender.md#512) |

---

## 6. Rendering Performance — **MEDIUM IMPACT**

| Rule                          | Problem                                   | Solution                                   | File                                             |
| ----------------------------- | ----------------------------------------- | ------------------------------------------ | ------------------------------------------------ |
| **6.1** SVG Animation         | No GPU acceleration on SVG                | Animate wrapper `<div>`                    | [06-rendering.md](categories/06-rendering.md#61) |
| **6.2** content-visibility    | 1000 items = 1000 layouts                 | Use `content-visibility: auto`             | [06-rendering.md](categories/06-rendering.md#62) |
| **6.3** Static JSX Hoisting   | Recreates element every render            | Extract to constant outside component      | [06-rendering.md](categories/06-rendering.md#63) |
| **6.4** SVG Precision         | Large SVG file size                       | Reduce decimal precision with SVGO         | [06-rendering.md](categories/06-rendering.md#64) |
| **6.5** Hydration Flicker     | Theme flashes from default → stored       | Inline script updates DOM before hydration | [06-rendering.md](categories/06-rendering.md#65) |
| **6.6** Hydration Warnings    | Noisy warnings for intentional mismatches | Use `suppressHydrationWarning`             | [06-rendering.md](categories/06-rendering.md#66) |
| **6.7** Activity Component    | Expensive component remounts              | Use `<Activity mode="hidden">`             | [06-rendering.md](categories/06-rendering.md#67) |
| **6.8** Conditional Rendering | Renders "0" instead of nothing            | Use ternary `? :` not `&&`                 | [06-rendering.md](categories/06-rendering.md#68) |
| **6.9** useTransition         | Manual loading state management           | Use `useTransition()` built-in pending     | [06-rendering.md](categories/06-rendering.md#69) |

---

## 7. JavaScript Performance — **LOW-MEDIUM IMPACT**

| Rule                          | Problem                                     | Solution                                   | File                                                |
| ----------------------------- | ------------------------------------------- | ------------------------------------------ | --------------------------------------------------- |
| **7.1** Layout Thrashing      | Interleaved reads/writes force reflows      | Batch writes, then read or use CSS classes | [07-javascript.md](categories/07-javascript.md#71)  |
| **7.2** Index Maps            | Multiple `.find()` calls (O(n) each)        | Build `Map` once (O(1) lookups)            | [07-javascript.md](categories/07-javascript.md#72)  |
| **7.3** Property Access       | Deep property lookup in loop                | Cache in variable outside loop             | [07-javascript.md](categories/07-javascript.md#73)  |
| **7.4** Function Result Cache | Repeated calls with same input              | Module-level Map cache                     | [07-javascript.md](categories/07-javascript.md#74)  |
| **7.5** Storage API Cache     | localStorage read on every call             | Cache reads in module Map                  | [07-javascript.md](categories/07-javascript.md#75)  |
| **7.6** Multiple Iterations   | Chain of `.filter()` + `.map()`             | Combine into single loop                   | [07-javascript.md](categories/07-javascript.md#76)  |
| **7.7** Length Check First    | Expensive comparison for different lengths  | Check `.length` before sorting/comparing   | [07-javascript.md](categories/07-javascript.md#77)  |
| **7.8** Early Return          | Process all items even after finding result | Return immediately when done               | [07-javascript.md](categories/07-javascript.md#78)  |
| **7.9** RegExp Hoisting       | Creates new RegExp every render             | Hoist to module or `useMemo()`             | [07-javascript.md](categories/07-javascript.md#79)  |
| **7.10** Loop for Min/Max     | Sort to find min/max (O(n log n))           | Use loop (O(n))                            | [07-javascript.md](categories/07-javascript.md#710) |
| **7.11** Set/Map Lookups      | `.includes()` on every check (O(n))         | Use `Set.has()` (O(1))                     | [07-javascript.md](categories/07-javascript.md#711) |
| **7.12** toSorted()           | `.sort()` mutates array                     | Use `.toSorted()` for immutability         | [07-javascript.md](categories/07-javascript.md#712) |

---

## 8. Advanced Patterns — **LOW IMPACT**

| Rule                   | Problem                                       | Solution                                 | File                                           |
| ---------------------- | --------------------------------------------- | ---------------------------------------- | ---------------------------------------------- |
| **8.1** Init Once      | `useEffect([])` runs twice in dev, on remount | Module-level guard `let didInit = false` | [08-advanced.md](categories/08-advanced.md#81) |
| **8.2** Handler Refs   | Re-subscribes on every handler change         | Store in ref, stable subscription        | [08-advanced.md](categories/08-advanced.md#82) |
| **8.3** useEffectEvent | Effect depends on callback, re-runs often     | Use `useEffectEvent()` for stable ref    | [08-advanced.md](categories/08-advanced.md#83) |

---

## Priority Guide for Agents

**When optimizing code, follow this order:**

1. **CRITICAL** (1-2): Eliminating waterfalls, bundle size (2-10× improvement, direct user impact)
2. **HIGH** (3): Server-side performance (reduces load time, prevents security issues)
3. **MEDIUM-HIGH** (4): Client-side fetching (automatic deduplication, better UX)
4. **MEDIUM** (5-6): Re-renders and rendering (improves responsiveness, reduces flicker)
5. **LOW-MEDIUM** (7): JavaScript micro-optimizations (cumulative gains in hot paths)
6. **LOW** (8): Advanced patterns (specific edge cases)

---

## References

- Full Details: See `categories/*.md` for code examples
- Original: [AGENTS.md](AGENTS.md) contains all rules with detailed explanations
- Individual Rules: See `rules/*.md` for single-rule reference
