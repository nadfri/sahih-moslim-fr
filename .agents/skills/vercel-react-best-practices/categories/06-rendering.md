# 6. Rendering Performance

**Impact: MEDIUM**

Optimizing the rendering process reduces the work the browser needs to do.

## 6.1 Animate SVG Wrapper Instead of SVG Element

**Impact: LOW (enables hardware acceleration)**

Many browsers don't have hardware acceleration for CSS3 animations on SVG elements. Wrap SVG in a `<div>` and animate the wrapper instead.

**Incorrect: animating SVG directly**

```tsx
function LoadingSpinner() {
  return (
    <svg
      className="animate-spin"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
      />
    </svg>
  );
}
```

**Correct: animating wrapper div**

```tsx
function LoadingSpinner() {
  return (
    <div className="animate-spin">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
        />
      </svg>
    </div>
  );
}
```

## 6.2 CSS content-visibility for Long Lists

**Impact: HIGH (faster initial render)**

Apply `content-visibility: auto` to defer off-screen rendering.

**CSS:**

```css
.message-item {
  content-visibility: auto;
  contain-intrinsic-size: 0 80px;
}
```

**Example:**

```tsx
function MessageList({ messages }: { messages: Message[] }) {
  return (
    <div className="overflow-y-auto h-screen">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className="message-item"
        >
          <Avatar user={msg.author} />
          <div>{msg.content}</div>
        </div>
      ))}
    </div>
  );
}
```

For 1000 messages, browser skips layout/paint for ~990 off-screen items (10× faster initial render).

## 6.3 Hoist Static JSX Elements

**Impact: LOW (avoids re-creation)**

Extract static JSX outside components to avoid re-creation.

**Incorrect: recreates element every render**

```tsx
function LoadingSkeleton() {
  return <div className="animate-pulse h-20 bg-gray-200" />;
}

function Container() {
  return <div>{loading && <LoadingSkeleton />}</div>;
}
```

**Correct: reuses same element**

```tsx
const loadingSkeleton = <div className="animate-pulse h-20 bg-gray-200" />;

function Container() {
  return <div>{loading && loadingSkeleton}</div>;
}
```

## 6.4 Optimize SVG Precision

**Impact: LOW (reduces file size)**

Reduce SVG coordinate precision to decrease file size.

**Incorrect: excessive precision**

```svg
<path d="M 10.293847 20.847362 L 30.938472 40.192837" />
```

**Correct: 1 decimal place**

```svg
<path d="M 10.3 20.8 L 30.9 40.2" />
```

**Automate with SVGO:**

```bash
npx svgo --precision=1 --multipass icon.svg
```

## 6.5 Prevent Hydration Mismatch Without Flickering

**Impact: MEDIUM (avoids visual flicker and hydration errors)**

When rendering content that depends on client-side storage, inject a synchronous script that updates the DOM before React hydrates.

**Incorrect: breaks SSR**

```tsx
function ThemeWrapper({ children }: { children: ReactNode }) {
  const theme = localStorage.getItem("theme") || "light";
  return <div className={theme}>{children}</div>;
}
```

**Incorrect: visual flickering**

```tsx
function ThemeWrapper({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored) setTheme(stored);
  }, []);

  return <div className={theme}>{children}</div>;
}
```

**Correct: no flicker, no hydration mismatch**

```tsx
function ThemeWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      <div id="theme-wrapper">{children}</div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var theme = localStorage.getItem('theme') || 'light';
                var el = document.getElementById('theme-wrapper');
                if (el) el.className = theme;
              } catch (e) {}
            })();
          `,
        }}
      />
    </>
  );
}
```

## 6.6 Suppress Expected Hydration Mismatches

**Impact: LOW-MEDIUM (avoids noisy hydration warnings for known differences)**

For expected mismatches (random IDs, dates, locale formatting), use `suppressHydrationWarning`.

**Incorrect: known mismatch warnings**

```tsx
function Timestamp() {
  return <span>{new Date().toLocaleString()}</span>;
}
```

**Correct: suppress expected mismatch only**

```tsx
function Timestamp() {
  return <span suppressHydrationWarning>{new Date().toLocaleString()}</span>;
}
```

## 6.7 Use Activity Component for Show/Hide

**Impact: MEDIUM (preserves state/DOM)**

Use React's `<Activity>` to preserve state/DOM for expensive components that frequently toggle visibility.

**Usage:**

```tsx
import { Activity } from "react";

function Dropdown({ isOpen }: Props) {
  return (
    <Activity mode={isOpen ? "visible" : "hidden"}>
      <ExpensiveMenu />
    </Activity>
  );
}
```

## 6.8 Use Explicit Conditional Rendering

**Impact: LOW (prevents rendering 0 or NaN)**

Use explicit ternary operators instead of `&&` for conditional rendering.

**Incorrect: renders "0" when count is 0**

```tsx
function Badge({ count }: { count: number }) {
  return <div>{count && <span className="badge">{count}</span>}</div>;
}
```

**Correct: renders nothing when count is 0**

```tsx
function Badge({ count }: { count: number }) {
  return <div>{count > 0 ? <span className="badge">{count}</span> : null}</div>;
}
```

## 6.9 Use useTransition Over Manual Loading States

**Impact: LOW (reduces re-renders and improves code clarity)**

Use `useTransition` instead of manual `useState` for loading states.

**Incorrect: manual loading state**

```tsx
function SearchResults() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (value: string) => {
    setIsLoading(true);
    setQuery(value);
    const data = await fetchResults(value);
    setResults(data);
    setIsLoading(false);
  };

  return (
    <>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {isLoading && <Spinner />}
      <ResultsList results={results} />
    </>
  );
}
```

**Correct: useTransition with built-in pending state**

```tsx
import { useTransition, useState } from "react";

function SearchResults() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (value: string) => {
    setQuery(value);

    startTransition(async () => {
      const data = await fetchResults(value);
      setResults(data);
    });
  };

  return (
    <>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {isPending && <Spinner />}
      <ResultsList results={results} />
    </>
  );
}
```

Reference: [useTransition Documentation](https://react.dev/reference/react/useTransition)
