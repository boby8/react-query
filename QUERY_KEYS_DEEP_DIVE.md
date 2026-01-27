# Query Keys Deep Dive: `postQueryKeys` Explained

## What Are Query Keys?

Query keys are **unique identifiers** for cached data in React Query. Think of them like:
- **Dictionary keys** - Each key maps to a piece of cached data
- **Database primary keys** - They uniquely identify a cache entry
- **URL paths** - They create a hierarchy of cached data

---

## Understanding `postQueryKeys` Structure

Let's break down the complete structure from `query-keys.ts`:

```typescript
const createQueryKeys = () => {
  const all = ["posts"] as const;
  
  const lists = () => [...all, "list"] as const;
  
  const list = (params?: GetPostsRequestInterface) => {
    return [...lists(), params] as const;
  };
  
  const details = () => [...all, "detail"] as const;
  
  const detail = (id: number | string) => {
    return [...details(), id] as const;
  };
  
  const byRequest = (request?: GetPostsRequestInterface) => {
    return {
      key: [...lists(), request] as const,
    };
  };
  
  return {
    all,
    lists,
    list,
    details,
    detail,
    byRequest,
    sub: { byRequest },
  };
};

export const postQueryKeys = createQueryKeys();
```

---

## The Factory Pattern: `createQueryKeys()`

### Why a Factory Function?

**Benefits:**
1. **Isolation** - Each call creates a fresh scope
2. **Testability** - Can create multiple instances for testing
3. **Closure** - Inner functions can access outer variables
4. **Composability** - Can build complex key structures

**Pattern:**
```typescript
const createQueryKeys = () => {
  // Inner functions that reference each other
  return { /* exported functions */ };
};

export const postQueryKeys = createQueryKeys();
```

---

## Understanding `as const`

### What is `as const`?

TypeScript's `as const` makes values **immutable** and creates **literal types**.

```typescript
const all = ["posts"] as const;
// Type: readonly ["posts"]
// Value: ["posts"] (immutable)
```

**Without `as const`:**
```typescript
const all = ["posts"];
// Type: string[]
// Can be modified: all.push("something") ✅
```

**With `as const`:**
```typescript
const all = ["posts"] as const;
// Type: readonly ["posts"]
// Cannot modify: all.push("something") ❌
```

**Why it matters for query keys:**
- React Query needs **stable, immutable** keys
- `as const` ensures keys don't accidentally change
- Provides better TypeScript type inference

---

## Hierarchical Key Structure

### Level 1: Base Key

```typescript
const all = ["posts"] as const;
// Result: ["posts"]
```

**Purpose:** Root identifier for all posts-related queries

**Used for:**
- Invalidating ALL posts queries at once
- `queryClient.invalidateQueries({ queryKey: postQueryKeys.all })`

---

### Level 2: Lists Base

```typescript
const lists = () => [...all, "list"] as const;
// Result: ["posts", "list"]
```

**Purpose:** Base key for all list queries

**Spreading `...all`:**
- Creates a new array: `["posts", "list"]`
- References the `all` array, maintaining hierarchy
- Creates: `["posts"] + ["list"] = ["posts", "list"]`

**Used for:**
- Invalidating all list queries
- `queryClient.invalidateQueries({ queryKey: postQueryKeys.lists() })`

---

### Level 3: Specific List Query

```typescript
const list = (params?: GetPostsRequestInterface) => {
  return [...lists(), params] as const;
};
```

**What happens:**

**Case 1: No parameters**
```typescript
postQueryKeys.list()
// Result: ["posts", "list", undefined]
// OR with empty object: ["posts", "list", {}]
```

**Case 2: With parameters**
```typescript
postQueryKeys.list({ limit: 10, skip: 0 })
// Result: ["posts", "list", { limit: 10, skip: 0 }]
```

**Why include params?**
- **Different params = Different cache entries**
- `["posts", "list", { limit: 10 }]` ≠ `["posts", "list", { limit: 20 }]`
- Each query with different params gets its own cache

**Visual Example:**
```
Cache:
  ["posts", "list", { limit: 10 }]  →  [Post1, Post2, ..., Post10]
  ["posts", "list", { limit: 20 }]  →  [Post1, Post2, ..., Post20]
  ["posts", "list", {}]              →  [All Posts]
```

---

### Level 2: Details Base

```typescript
const details = () => [...all, "detail"] as const;
// Result: ["posts", "detail"]
```

**Purpose:** Base key for all detail (single post) queries

**Used for:**
- Invalidating all detail queries
- `queryClient.invalidateQueries({ queryKey: postQueryKeys.details() })`

---

### Level 3: Specific Detail Query

```typescript
const detail = (id: number | string) => {
  return [...details(), id] as const;
};
```

**What happens:**

```typescript
postQueryKeys.detail(1)
// Result: ["posts", "detail", 1]

postQueryKeys.detail("123")
// Result: ["posts", "detail", "123"]
```

**Visual Example:**
```
Cache:
  ["posts", "detail", 1]  →  { id: 1, title: "Post 1", ... }
  ["posts", "detail", 2]  →  { id: 2, title: "Post 2", ... }
  ["posts", "detail", 3]  →  { id: 3, title: "Post 3", ... }
```

---

## The `byRequest` Pattern

```typescript
const byRequest = (request?: GetPostsRequestInterface) => {
  return {
    key: [...lists(), request] as const,
  };
};
```

**Why return an object with `key` property?**

This pattern allows for **extensibility**:

```typescript
const byRequest = (request?: GetPostsRequestInterface) => {
  return {
    key: [...lists(), request] as const,
    // Could add more properties in the future:
    // filters: request?.filters,
    // metadata: { timestamp: Date.now() },
  };
};
```

**Usage:**
```typescript
postQueryKeys.byRequest({ limit: 10 }).key
// Result: ["posts", "list", { limit: 10 }]
```

**Note:** Currently returns same as `list()`, but pattern allows for future enhancements.

---

## The `sub` Object

```typescript
return {
  all,
  lists,
  list,
  details,
  detail,
  byRequest,
  sub: { byRequest },
};
```

**Purpose:** Provides **nested access** to helper functions

**Usage:**
```typescript
postQueryKeys.sub.byRequest({ limit: 10 }).key
// Same as: postQueryKeys.byRequest({ limit: 10 }).key
```

**Why?**
- **Consistency** - Matches patterns from other libraries
- **Organization** - Groups related helper functions
- **Extensibility** - Can add more sub-functions later

---

## How Query Keys Are Used in Practice

### 1. In Query Hooks

```typescript
export const usePostsQuery = (request: GetPostsRequestInterface = {}) => {
  return useQuery({
    queryKey: postQueryKeys.list(request),  // ← Key identifies cache entry
    queryFn: async (context) => {
      const { data } = await getPosts(request, getApiRequestContext(context));
      return data;
    },
  });
};
```

**What happens:**
1. React Query looks for cache with key: `["posts", "list", request]`
2. If found → returns cached data (if not stale)
3. If not found → runs `queryFn` and caches result with that key

---

### 2. In Mutations (setQueryData)

```typescript
onSuccess: (newPost) => {
  queryClient.setQueryData<Post[]>(
    postQueryKeys.list({}),  // ← Must match query key exactly!
    (oldPosts) => [newPost, ...oldPosts]
  );
}
```

**Critical:** The key **must match** the key used in the query hook!

```typescript
// ✅ MATCHES
usePostsQuery({})  // Uses: ["posts", "list", {}]
setQueryData(postQueryKeys.list({}))  // Uses: ["posts", "list", {}]

// ❌ DOESN'T MATCH
usePostsQuery({ limit: 10 })  // Uses: ["posts", "list", { limit: 10 }]
setQueryData(postQueryKeys.list({}))  // Uses: ["posts", "list", {}]
// Won't update the cache! Different keys!
```

---

### 3. In Cache Invalidation

```typescript
// Invalidate specific query
queryClient.invalidateQueries({
  queryKey: postQueryKeys.detail(1),  // Only invalidates post #1
});

// Invalidate all list queries (with any params)
queryClient.invalidateQueries({
  queryKey: postQueryKeys.lists(),  // Invalidates: ["posts", "list", ...]
});
// Matches: ["posts", "list", {}], ["posts", "list", { limit: 10 }], etc.

// Invalidate ALL posts queries
queryClient.invalidateQueries({
  queryKey: postQueryKeys.all,  // Invalidates: ["posts", ...]
});
// Matches: ["posts", "list", ...], ["posts", "detail", ...], etc.
```

---

## Query Key Matching Rules

React Query uses **prefix matching** for invalidation:

### Exact Match
```typescript
queryKey: ["posts", "list", { limit: 10 }]
// Only matches: ["posts", "list", { limit: 10 }]
```

### Prefix Match (Invalidation)
```typescript
invalidateQueries({ queryKey: ["posts", "list"] })
// Matches:
// ✅ ["posts", "list", {}]
// ✅ ["posts", "list", { limit: 10 }]
// ✅ ["posts", "list", { limit: 20, skip: 0 }]
// ❌ ["posts", "detail", 1]
```

---

## Type Safety Benefits

### TypeScript Inference

```typescript
const key = postQueryKeys.list({ limit: 10 });
// Type: readonly ["posts", "list", { limit: number; skip?: number } | undefined]
```

**Benefits:**
- Autocomplete in IDE
- Type checking catches errors
- Refactoring is safer

### Generic Type Parameter

```typescript
queryClient.setQueryData<Post[]>(postQueryKeys.list({}), ...)
//                                                ^^^^^^^^
//                                                Tells TypeScript what data type is cached
```

**What this does:**
- TypeScript knows `oldPosts` is `Post[] | undefined`
- Provides autocomplete for `Post` properties
- Catches type errors at compile time

---

## Complete Key Hierarchy Tree

```
postQueryKeys
│
├── all  →  ["posts"]
│   │
│   ├── lists()  →  ["posts", "list"]
│   │   │
│   │   ├── list()  →  ["posts", "list", undefined]
│   │   ├── list({ limit: 10 })  →  ["posts", "list", { limit: 10 }]
│   │   └── list({ limit: 20, skip: 0 })  →  ["posts", "list", { limit: 20, skip: 0 }]
│   │
│   └── details()  →  ["posts", "detail"]
│       │
│       └── detail(1)  →  ["posts", "detail", 1]
│       └── detail(2)  →  ["posts", "detail", 2]
│       └── detail("123")  →  ["posts", "detail", "123"]
│
├── byRequest({ limit: 10 })  →  { key: ["posts", "list", { limit: 10 }] }
│
└── sub
    └── byRequest({ limit: 10 })  →  { key: ["posts", "list", { limit: 10 }] }
```

---

## Real-World Usage Examples

### Example 1: Creating a Post

```typescript
const createMutation = useCreatePostMutation();

createMutation.mutate({
  title: "New Post",
  body: "Content",
  userId: 1,
});

// onSuccess runs:
queryClient.setQueryData(
  postQueryKeys.list({}),  // ← Updates cache for all posts list
  (oldPosts) => [newPost, ...oldPosts]
);
```

---

### Example 2: Updating a Post

```typescript
const updateMutation = useUpdatePostMutation();

updateMutation.mutate({
  id: 5,
  request: { title: "Updated Title" },
});

// onSuccess runs:
queryClient.setQueryData(
  postQueryKeys.list({}),  // ← Updates post in list
  (oldPosts) => oldPosts.map(p => p.id === 5 ? updated : p)
);

queryClient.setQueryData(
  postQueryKeys.detail(5),  // ← Updates single post cache
  updatedPost
);
```

---

### Example 3: Deleting a Post

```typescript
const deleteMutation = useDeletePostMutation();

deleteMutation.mutate(5);

// onSuccess runs:
queryClient.setQueryData(
  postQueryKeys.list({}),  // ← Removes from list
  (oldPosts) => oldPosts.filter(p => p.id !== 5)
);

queryClient.removeQueries({
  queryKey: postQueryKeys.detail(5),  // ← Removes single post cache
});
```

---

### Example 4: Invalidate After Mutations

```typescript
// After creating, updating, or deleting:
queryClient.invalidateQueries({
  queryKey: postQueryKeys.lists(),  // ← Refetches all list queries
});

// Or more specific:
queryClient.invalidateQueries({
  queryKey: postQueryKeys.detail(5),  // ← Refetches only post #5
});
```

---

## Best Practices

### ✅ DO:

1. **Use consistent keys** - Same structure throughout app
2. **Include all parameters** - Different params = different keys
3. **Use hierarchical structure** - Easy to invalidate groups
4. **Use `as const`** - Ensures immutability
5. **Match keys exactly** - When using `setQueryData`, key must match query key

### ❌ DON'T:

1. **Don't use random values** - Keys must be stable
2. **Don't forget params** - `list({ limit: 10 })` ≠ `list({})`
3. **Don't mutate keys** - Keep them immutable
4. **Don't hardcode strings** - Use the query key functions

---

## Summary

**`postQueryKeys` is a structured system for:**

1. **Creating consistent cache keys** - Same format everywhere
2. **Hierarchical organization** - Easy to group related queries
3. **Type safety** - TypeScript knows the structure
4. **Easy invalidation** - Can invalidate groups or specific queries
5. **Maintainability** - Change structure in one place

**Key Concepts:**
- Query keys = Cache identifiers
- Hierarchy = `["posts", "list", params]` structure
- Matching = Keys must match exactly for `setQueryData`
- Prefix matching = Used for invalidation
- Type safety = TypeScript ensures correctness

