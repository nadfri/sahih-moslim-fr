# 7. JavaScript Performance

**Impact: LOW-MEDIUM**

Micro-optimizations for hot paths can add up to meaningful improvements.

## 7.1 Avoid Layout Thrashing

**Impact: MEDIUM (prevents forced synchronous layouts)**

Avoid interleaving style writes with layout reads. Batch writes together, then read once.

**Incorrect: interleaved reads/writes**

```typescript
function layoutThrashing(element: HTMLElement) {
  element.style.width = "100px";
  const width = element.offsetWidth; // Forces reflow
  element.style.height = "200px";
  const height = element.offsetHeight; // Forces another reflow
}
```

**Correct: batch writes, then read**

```typescript
function updateElementStyles(element: HTMLElement) {
  element.style.width = "100px";
  element.style.height = "200px";

  const { width, height } = element.getBoundingClientRect();
}
```

**Best: use CSS classes**

```tsx
function Box({ isHighlighted }: { isHighlighted: boolean }) {
  return <div className={isHighlighted ? "highlighted-box" : ""}>Content</div>;
}
```

## 7.2 Build Index Maps for Repeated Lookups

**Impact: LOW-MEDIUM (1M ops to 2K ops)**

Multiple `.find()` calls should use a Map (O(1) vs O(n)).

**Incorrect:**

```typescript
function processOrders(orders: Order[], users: User[]) {
  return orders.map((order) => ({
    ...order,
    user: users.find((u) => u.id === order.userId),
  }));
}
```

**Correct:**

```typescript
function processOrders(orders: Order[], users: User[]) {
  const userById = new Map(users.map((u) => [u.id, u]));
  return orders.map((order) => ({
    ...order,
    user: userById.get(order.userId),
  }));
}
```

## 7.3 Cache Property Access in Loops

**Impact: LOW-MEDIUM (reduces lookups)**

**Incorrect:**

```typescript
for (let i = 0; i < arr.length; i++) {
  process(obj.config.settings.value);
}
```

**Correct:**

```typescript
const value = obj.config.settings.value;
const len = arr.length;
for (let i = 0; i < len; i++) {
  process(value);
}
```

## 7.4 Cache Repeated Function Calls

**Impact: MEDIUM (avoid redundant computation)**

Use module-level Map to cache function results.

**Incorrect:**

```typescript
function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div>
      {projects.map(project => {
        const slug = slugify(project.name)  // Called 100+ times
        return <ProjectCard key={project.id} slug={slug} />
      })}
    </div>
  )
}
```

**Correct:**

```typescript
const slugifyCache = new Map<string, string>()

function cachedSlugify(text: string): string {
  if (slugifyCache.has(text)) {
    return slugifyCache.get(text)!
  }
  const result = slugify(text)
  slugifyCache.set(text, result)
  return result
}

function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div>
      {projects.map(project => {
        const slug = cachedSlugify(project.name)
        return <ProjectCard key={project.id} slug={slug} />
      })}
    </div>
  )
}
```

## 7.5 Cache Storage API Calls

**Impact: LOW-MEDIUM (reduces expensive I/O)**

`localStorage`, `sessionStorage`, and `document.cookie` are synchronous and expensive. Cache reads in memory.

**Incorrect:**

```typescript
function getTheme() {
  return localStorage.getItem("theme") ?? "light";
}
// Called 10 times = 10 storage reads
```

**Correct:**

```typescript
const storageCache = new Map<string, string | null>();

function getLocalStorage(key: string) {
  if (!storageCache.has(key)) {
    storageCache.set(key, localStorage.getItem(key));
  }
  return storageCache.get(key);
}

function setLocalStorage(key: string, value: string) {
  localStorage.setItem(key, value);
  storageCache.set(key, value);
}
```

## 7.6 Combine Multiple Array Iterations

**Impact: LOW-MEDIUM (reduces iterations)**

**Incorrect: 3 iterations**

```typescript
const admins = users.filter((u) => u.isAdmin);
const testers = users.filter((u) => u.isTester);
const inactive = users.filter((u) => !u.isActive);
```

**Correct: 1 iteration**

```typescript
const admins: User[] = [];
const testers: User[] = [];
const inactive: User[] = [];

for (const user of users) {
  if (user.isAdmin) admins.push(user);
  if (user.isTester) testers.push(user);
  if (!user.isActive) inactive.push(user);
}
```

## 7.7 Early Length Check for Array Comparisons

**Impact: MEDIUM-HIGH (avoids expensive operations)**

Check lengths first before expensive comparisons.

**Incorrect:**

```typescript
function hasChanges(current: string[], original: string[]) {
  return current.sort().join() !== original.sort().join();
}
```

**Correct:**

```typescript
function hasChanges(current: string[], original: string[]) {
  if (current.length !== original.length) {
    return true;
  }
  const currentSorted = current.toSorted();
  const originalSorted = original.toSorted();
  for (let i = 0; i < currentSorted.length; i++) {
    if (currentSorted[i] !== originalSorted[i]) {
      return true;
    }
  }
  return false;
}
```

## 7.8 Early Return from Functions

**Impact: LOW-MEDIUM (avoids unnecessary computation)**

**Incorrect:**

```typescript
function validateUsers(users: User[]) {
  let hasError = false;
  let errorMessage = "";

  for (const user of users) {
    if (!user.email) {
      hasError = true;
      errorMessage = "Email required";
    }
  }

  return hasError ? { valid: false, error: errorMessage } : { valid: true };
}
```

**Correct:**

```typescript
function validateUsers(users: User[]) {
  for (const user of users) {
    if (!user.email) {
      return { valid: false, error: "Email required" };
    }
    if (!user.name) {
      return { valid: false, error: "Name required" };
    }
  }
  return { valid: true };
}
```

## 7.9 Hoist RegExp Creation

**Impact: LOW-MEDIUM (avoids recreation)**

**Incorrect:**

```tsx
function Highlighter({ text, query }: Props) {
  const regex = new RegExp(`(${query})`, 'gi')
  const parts = text.split(regex)
  return <>{parts.map((part, i) => ...)}</>
}
```

**Correct:**

```tsx
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Highlighter({ text, query }: Props) {
  const regex = useMemo(
    () => new RegExp(`(${escapeRegex(query)})`, 'gi'),
    [query]
  )
  const parts = text.split(regex)
  return <>{parts.map((part, i) => ...)}</>
}
```

## 7.10 Use Loop for Min/Max Instead of Sort

**Impact: LOW (O(n) instead of O(n log n))**

**Incorrect:**

```typescript
function getLatestProject(projects: Project[]) {
  const sorted = [...projects].sort((a, b) => b.updatedAt - a.updatedAt);
  return sorted[0];
}
```

**Correct:**

```typescript
function getLatestProject(projects: Project[]) {
  if (projects.length === 0) return null;

  let latest = projects[0];
  for (let i = 1; i < projects.length; i++) {
    if (projects[i].updatedAt > latest.updatedAt) {
      latest = projects[i];
    }
  }
  return latest;
}
```

## 7.11 Use Set/Map for O(1) Lookups

**Impact: LOW-MEDIUM (O(n) to O(1))**

**Incorrect:**

```typescript
const allowedIds = ['a', 'b', 'c', ...]
items.filter(item => allowedIds.includes(item.id))
```

**Correct:**

```typescript
const allowedIds = new Set(['a', 'b', 'c', ...])
items.filter(item => allowedIds.has(item.id))
```

## 7.12 Use toSorted() Instead of sort() for Immutability

**Impact: MEDIUM-HIGH (prevents mutation bugs)**

`.sort()` mutates the array. Use `.toSorted()` for immutability.

**Incorrect:**

```typescript
function UserList({ users }: { users: User[] }) {
  const sorted = useMemo(
    () => users.sort((a, b) => a.name.localeCompare(b.name)),
    [users]
  )
  return <div>{sorted.map(renderUser)}</div>
}
```

**Correct:**

```typescript
function UserList({ users }: { users: User[] }) {
  const sorted = useMemo(
    () => users.toSorted((a, b) => a.name.localeCompare(b.name)),
    [users]
  )
  return <div>{sorted.map(renderUser)}</div>
}
```

**Fallback for older browsers:**

```typescript
const sorted = [...items].sort((a, b) => a.value - b.value);
```

**Other immutable array methods:**

- `.toSorted()` - immutable sort
- `.toReversed()` - immutable reverse
- `.toSpliced()` - immutable splice
- `.with()` - immutable element replacement
