# 5. Re-render Optimization

**Impact: MEDIUM**

Reducing unnecessary re-renders minimizes wasted computation and improves UI responsiveness.

## 5.1 Calculate Derived State During Rendering

**Impact: MEDIUM (avoids redundant renders and state drift)**

If a value can be computed from current props/state, do not store it in state or update it in an effect. Derive it during render to avoid extra renders and state drift.

**Incorrect: redundant state and effect**

```tsx
function Form() {
  const [firstName, setFirstName] = useState("First");
  const [lastName, setLastName] = useState("Last");
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    setFullName(firstName + " " + lastName);
  }, [firstName, lastName]);

  return <p>{fullName}</p>;
}
```

**Correct: derive during render**

```tsx
function Form() {
  const [firstName, setFirstName] = useState("First");
  const [lastName, setLastName] = useState("Last");
  const fullName = firstName + " " + lastName;

  return <p>{fullName}</p>;
}
```

Reference: [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)

## 5.2 Defer State Reads to Usage Point

**Impact: MEDIUM (avoids unnecessary subscriptions)**

Don't subscribe to dynamic state (searchParams, localStorage) if you only read it inside callbacks.

**Incorrect: subscribes to all searchParams changes**

```tsx
function ShareButton({ chatId }: { chatId: string }) {
  const searchParams = useSearchParams();

  const handleShare = () => {
    const ref = searchParams.get("ref");
    shareChat(chatId, { ref });
  };

  return <button onClick={handleShare}>Share</button>;
}
```

**Correct: reads on demand, no subscription**

```tsx
function ShareButton({ chatId }: { chatId: string }) {
  const handleShare = () => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    shareChat(chatId, { ref });
  };

  return <button onClick={handleShare}>Share</button>;
}
```

## 5.3 Do not wrap a simple expression with a primitive result type in useMemo

**Impact: LOW-MEDIUM (wasted computation on every render)**

When an expression is simple and has a primitive result type, do not wrap it in `useMemo`. Calling `useMemo` may consume more resources than the expression itself.

**Incorrect:**

```tsx
function Header({ user, notifications }: Props) {
  const isLoading = useMemo(() => {
    return user.isLoading || notifications.isLoading;
  }, [user.isLoading, notifications.isLoading]);

  if (isLoading) return <Skeleton />;
}
```

**Correct:**

```tsx
function Header({ user, notifications }: Props) {
  const isLoading = user.isLoading || notifications.isLoading;
  if (isLoading) return <Skeleton />;
}
```

## 5.4 Extract Default Non-primitive Parameter Value from Memoized Component to Constant

**Impact: MEDIUM (restores memoization by using a constant for default value)**

When memoized component has a default value for non-primitive optional parameter, extract the default value into a constant.

**Incorrect: `onClick` has different values on every rerender**

```tsx
const UserAvatar = memo(function UserAvatar({
  onClick = () => {},
}: {
  onClick?: () => void;
}) {
  // ...
});
```

**Correct: stable default value**

```tsx
const NOOP = () => {};

const UserAvatar = memo(function UserAvatar({
  onClick = NOOP,
}: {
  onClick?: () => void;
}) {
  // ...
});
```

## 5.5 Extract to Memoized Components

**Impact: MEDIUM (enables early returns)**

Extract expensive work into memoized components to enable early returns before computation.

**Incorrect: computes avatar even when loading**

```tsx
function Profile({ user, loading }: Props) {
  const avatar = useMemo(() => {
    const id = computeAvatarId(user);
    return <Avatar id={id} />;
  }, [user]);

  if (loading) return <Skeleton />;
  return <div>{avatar}</div>;
}
```

**Correct: skips computation when loading**

```tsx
const UserAvatar = memo(function UserAvatar({ user }: { user: User }) {
  const id = useMemo(() => computeAvatarId(user), [user]);
  return <Avatar id={id} />;
});

function Profile({ user, loading }: Props) {
  if (loading) return <Skeleton />;
  return (
    <div>
      <UserAvatar user={user} />
    </div>
  );
}
```

## 5.6 Narrow Effect Dependencies

**Impact: LOW (minimizes effect re-runs)**

Specify primitive dependencies instead of objects to minimize effect re-runs.

**Incorrect: re-runs on any user field change**

```tsx
useEffect(() => {
  console.log(user.id);
}, [user]);
```

**Correct: re-runs only when id changes**

```tsx
useEffect(() => {
  console.log(user.id);
}, [user.id]);
```

## 5.7 Put Interaction Logic in Event Handlers

**Impact: MEDIUM (avoids effect re-runs and duplicate side effects)**

If a side effect is triggered by a specific user action, run it in that event handler.

**Incorrect: event modeled as state + effect**

```tsx
function Form() {
  const [submitted, setSubmitted] = useState(false);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (submitted) {
      post("/api/register");
      showToast("Registered", theme);
    }
  }, [submitted, theme]);

  return <button onClick={() => setSubmitted(true)}>Submit</button>;
}
```

**Correct: do it in the handler**

```tsx
function Form() {
  const theme = useContext(ThemeContext);

  function handleSubmit() {
    post("/api/register");
    showToast("Registered", theme);
  }

  return <button onClick={handleSubmit}>Submit</button>;
}
```

## 5.8 Subscribe to Derived State

**Impact: MEDIUM (reduces re-render frequency)**

Subscribe to derived boolean state instead of continuous values to reduce re-render frequency.

**Incorrect: re-renders on every pixel change**

```tsx
function Sidebar() {
  const width = useWindowWidth(); // updates continuously
  const isMobile = width < 768;
  return <nav className={isMobile ? "mobile" : "desktop"} />;
}
```

**Correct: re-renders only when boolean changes**

```tsx
function Sidebar() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  return <nav className={isMobile ? "mobile" : "desktop"} />;
}
```

## 5.9 Use Functional setState Updates

**Impact: MEDIUM (prevents stale closures and unnecessary callback recreations)**

When updating state based on current state, use functional update form.

**Incorrect: requires state as dependency**

```tsx
function TodoList() {
  const [items, setItems] = useState(initialItems);

  const addItems = useCallback(
    (newItems: Item[]) => {
      setItems([...items, ...newItems]);
    },
    [items]
  ); // ❌ items dependency causes recreations

  return (
    <ItemsEditor
      items={items}
      onAdd={addItems}
    />
  );
}
```

**Correct: stable callbacks, no stale closures**

```tsx
function TodoList() {
  const [items, setItems] = useState(initialItems);

  const addItems = useCallback((newItems: Item[]) => {
    setItems((curr) => [...curr, ...newItems]);
  }, []); // ✅ No dependencies needed

  return (
    <ItemsEditor
      items={items}
      onAdd={addItems}
    />
  );
}
```

## 5.10 Use Lazy State Initialization

**Impact: MEDIUM (wasted computation on every render)**

Pass a function to `useState` for expensive initial values.

**Incorrect: runs on every render**

```tsx
function FilteredList({ items }: { items: Item[] }) {
  const [searchIndex, setSearchIndex] = useState(buildSearchIndex(items));
  const [query, setQuery] = useState("");

  return (
    <SearchResults
      index={searchIndex}
      query={query}
    />
  );
}
```

**Correct: runs only once**

```tsx
function FilteredList({ items }: { items: Item[] }) {
  const [searchIndex, setSearchIndex] = useState(() => buildSearchIndex(items));
  const [query, setQuery] = useState("");

  return (
    <SearchResults
      index={searchIndex}
      query={query}
    />
  );
}
```

## 5.11 Use Transitions for Non-Urgent Updates

**Impact: MEDIUM (maintains UI responsiveness)**

Mark frequent, non-urgent state updates as transitions to maintain UI responsiveness.

**Incorrect: blocks UI on every scroll**

```tsx
function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
}
```

**Correct: non-blocking updates**

```tsx
import { startTransition } from "react";

function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handler = () => {
      startTransition(() => setScrollY(window.scrollY));
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
}
```

## 5.12 Use useRef for Transient Values

**Impact: MEDIUM (avoids unnecessary re-renders on frequent updates)**

When a value changes frequently and you don't want a re-render on every update, store it in `useRef` instead of `useState`.

**Incorrect: renders every update**

```tsx
function Tracker() {
  const [lastX, setLastX] = useState(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => setLastX(e.clientX);
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return <div style={{ left: lastX }} />;
}
```

**Correct: no re-render for tracking**

```tsx
function Tracker() {
  const lastXRef = useRef(0);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      lastXRef.current = e.clientX;
      const node = dotRef.current;
      if (node) {
        node.style.transform = `translateX(${e.clientX}px)`;
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={dotRef}
      style={{ transform: "translateX(0px)" }}
    />
  );
}
```
