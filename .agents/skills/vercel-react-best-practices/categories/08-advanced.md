# 8. Advanced Patterns

**Impact: LOW**

Advanced patterns for specific cases that require careful implementation.

## 8.1 Initialize App Once, Not Per Mount

**Impact: LOW-MEDIUM (avoids duplicate init in development)**

Do not put app-wide initialization that must run once per app load inside `useEffect([])`. Components can remount. Use a module-level guard instead.

**Incorrect: runs twice in dev**

```tsx
function Comp() {
  useEffect(() => {
    loadFromStorage();
    checkAuthToken();
  }, []);
}
```

**Correct: once per app load**

```tsx
let didInit = false;

function Comp() {
  useEffect(() => {
    if (didInit) return;
    didInit = true;
    loadFromStorage();
    checkAuthToken();
  }, []);
}
```

Reference: [Initializing the Application](https://react.dev/learn/you-might-not-need-an-effect#initializing-the-application)

## 8.2 Store Event Handlers in Refs

**Impact: LOW (stable subscriptions)**

Store callbacks in refs when used in effects that shouldn't re-subscribe on callback changes.

**Incorrect: re-subscribes on every render**

```tsx
function useWindowEvent(event: string, handler: (e) => void) {
  useEffect(() => {
    window.addEventListener(event, handler);
    return () => window.removeEventListener(event, handler);
  }, [event, handler]);
}
```

**Correct: stable subscription**

```tsx
import { useEffectEvent } from "react";

function useWindowEvent(event: string, handler: (e) => void) {
  const onEvent = useEffectEvent(handler);

  useEffect(() => {
    window.addEventListener(event, onEvent);
    return () => window.removeEventListener(event, onEvent);
  }, [event]);
}
```

## 8.3 useEffectEvent for Stable Callback Refs

**Impact: LOW (prevents effect re-runs)**

Access latest values in callbacks without adding them to dependency arrays. Prevents effect re-runs while avoiding stale closures.

**Incorrect: effect re-runs on every callback change**

```tsx
function SearchInput({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => onSearch(query), 300);
    return () => clearTimeout(timeout);
  }, [query, onSearch]);
}
```

**Correct: using React's useEffectEvent**

```tsx
import { useEffectEvent } from "react";

function SearchInput({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState("");
  const onSearchEvent = useEffectEvent(onSearch);

  useEffect(() => {
    const timeout = setTimeout(() => onSearchEvent(query), 300);
    return () => clearTimeout(timeout);
  }, [query]);
}
```

---

## References

1. [React Documentation](https://react.dev)
2. [Next.js Documentation](https://nextjs.org)
3. [SWR](https://swr.vercel.app)
4. [better-all](https://github.com/shuding/better-all)
5. [node-lru-cache](https://github.com/isaacs/node-lru-cache)
6. [Package Import Optimization](https://vercel.com/blog/how-we-optimized-package-imports-in-next-js)
7. [Dashboard Performance](https://vercel.com/blog/how-we-made-the-vercel-dashboard-twice-as-fast)
