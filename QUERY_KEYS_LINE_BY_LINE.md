# Query Keys Line-by-Line Explanation

## File: `src/pages/posts/api/query-keys.ts`

---

## Line 1: Import Type

```typescript
import type { QueryKey } from "@tanstack/react-query";
```

**What it does:**
- Imports the `QueryKey` type from React Query
- `type` keyword = Type-only import (not a value, only for TypeScript)
- `QueryKey` = TypeScript type for query keys (array of strings/numbers/objects)

**Why needed:**
- Used in line 46 for the return type of `getPostsQueryKey`
- Ensures type safety

**Example:**
```typescript
const key: QueryKey = ["posts", "list", {}]; // ✅ Valid
const key: QueryKey = 123; // ❌ Error - not a QueryKey
```

---

## Line 2: Import Type

```typescript
import type { GetPostsRequestInterface } from "./types";
```

**What it does:**
- Imports the `GetPostsRequestInterface` type from the types file
- Type-only import (TypeScript only, not runtime code)

**What is `GetPostsRequestInterface`?**
```typescript
interface GetPostsRequestInterface {
  limit?: number;
  skip?: number;
}
```

**Why needed:**
- Used in line 10 and 21 as parameter types
- Defines what parameters can be passed to query key functions

---

## Line 4: Comment

```typescript
// Base query keys factory
```

**What it does:**
- Documentation comment explaining the purpose
- Describes that this is a factory function pattern

---

## Line 5: Factory Function Declaration

```typescript
const createQueryKeys = () => {
```

**What it does:**
- Declares a function called `createQueryKeys`
- Arrow function syntax (ES6)
- Takes no parameters: `()`

**Why a factory function?**
- Creates isolated scope for inner functions
- Allows functions to reference each other
- Returns an object with all query key functions
- Better for testing and organization

**Pattern:**
```typescript
const createSomething = () => {
  // Inner functions that can reference each other
  return { /* exported functions */ };
};
```

---

## Line 6: Base Key Constant

```typescript
const all = ["posts"] as const;
```

**What it does:**
- Creates a constant called `all`
- Value: Array with one string `"posts"`
- `as const` = Makes it immutable (readonly) and creates literal type

**Breaking down `as const`:**
- **Without `as const`:** `string[]` (can be modified)
- **With `as const`:** `readonly ["posts"]` (immutable, exact type)

**Why `["posts"]`?**
- Root identifier for all posts-related queries
- Part of the hierarchical key structure

**Result:**
```typescript
all = ["posts"]  // Type: readonly ["posts"]
```

**Usage:**
- Base for building other keys
- Used for invalidating ALL posts queries

---

## Line 8: Lists Base Function

```typescript
const lists = () => [...all, "list"] as const;
```

**What it does:**
- Creates a function called `lists`
- Returns: `["posts", "list"]`
- Uses spread operator `...all` to include the base key

**Breaking down `[...all, "list"]`:**
- `...all` = Spreads `["posts"]` → becomes `"posts"`
- `"list"` = Adds `"list"` to the array
- Result: `["posts", "list"]`

**Visual:**
```typescript
all = ["posts"]
[...all, "list"]
= ["posts", "list"]  // Spreads "posts", adds "list"
```

**Why a function?**
- Returns a new array each time (not a shared reference)
- Can be called multiple times safely

**Result:**
```typescript
lists() = ["posts", "list"]
```

**Usage:**
- Base for list queries
- Used for invalidating all list queries (with any params)

---

## Line 10: List Query Function

```typescript
const list = (params?: GetPostsRequestInterface) => {
```

**What it does:**
- Creates a function called `list`
- Parameter: `params` (optional - the `?` means optional)
- Type: `GetPostsRequestInterface | undefined`

**What can be passed?**
```typescript
list()                    // params = undefined
list({})                  // params = {}
list({ limit: 10 })       // params = { limit: 10 }
list({ limit: 10, skip: 0 }) // params = { limit: 10, skip: 0 }
```

**Why optional?**
- `?` means the parameter can be omitted
- `list()` is valid (no params)
- `list({ limit: 10 })` is also valid (with params)

---

## Line 11: Return Statement

```typescript
return [...lists(), params] as const;
```

**What it does:**
- Returns a query key array
- Spreads `lists()` and adds `params` to the end

**Breaking it down:**

**Step 1: `lists()`**
```typescript
lists() = ["posts", "list"]
```

**Step 2: Spread `[...lists()]`**
```typescript
[...lists()] = ...["posts", "list"] = "posts", "list"
```

**Step 3: Add `params`**
```typescript
[...lists(), params] = ["posts", "list", params]
```

**Examples:**

```typescript
list() 
→ [...lists(), undefined]
→ [...["posts", "list"], undefined]
→ ["posts", "list", undefined]

list({ limit: 10 })
→ [...lists(), { limit: 10 }]
→ [...["posts", "list"], { limit: 10 }]
→ ["posts", "list", { limit: 10 }]
```

**Why include `params`?**
- Different params = Different cache entries
- `list({ limit: 10 })` ≠ `list({ limit: 20 })`
- Each gets its own cache

**Result:**
```typescript
list({ limit: 10 }) = ["posts", "list", { limit: 10 }]
```

---

## Line 14: Details Base Function

```typescript
const details = () => [...all, "detail"] as const;
```

**What it does:**
- Creates a function called `details`
- Similar to `lists()` but for detail queries
- Returns: `["posts", "detail"]`

**Breaking it down:**
```typescript
all = ["posts"]
[...all, "detail"]
= [...["posts"], "detail"]
= ["posts", "detail"]
```

**Result:**
```typescript
details() = ["posts", "detail"]
```

**Usage:**
- Base for detail (single post) queries
- Used for invalidating all detail queries

---

## Line 16: Detail Query Function

```typescript
const detail = (id: number | string) => {
```

**What it does:**
- Creates a function called `detail`
- Parameter: `id` (required, not optional - no `?`)
- Type: `number | string` (can be either)

**Why `number | string`?**
- IDs can be numbers: `1`, `2`, `3`
- Or strings: `"1"`, `"abc"`, `"123-456"`
- React Query accepts both

**Examples:**
```typescript
detail(1)        // id = 1 (number)
detail("1")      // id = "1" (string)
detail(123)      // id = 123 (number)
```

---

## Line 17: Return Statement

```typescript
return [...details(), id] as const;
```

**What it does:**
- Returns a query key array with the ID appended
- Spreads `details()` and adds `id`

**Breaking it down:**

**Step 1: `details()`**
```typescript
details() = ["posts", "detail"]
```

**Step 2: Spread and add ID**
```typescript
[...details(), id]
= [...["posts", "detail"], id]
= ["posts", "detail", id]
```

**Examples:**

```typescript
detail(1)
→ [...details(), 1]
→ [...["posts", "detail"], 1]
→ ["posts", "detail", 1]

detail("123")
→ [...details(), "123"]
→ [...["posts", "detail"], "123"]
→ ["posts", "detail", "123"]
```

**Result:**
```typescript
detail(1) = ["posts", "detail", 1]
detail(2) = ["posts", "detail", 2]
```

**Why include `id`?**
- Each post has its own cache entry
- `detail(1)` ≠ `detail(2)`
- Different IDs = Different cache keys

---

## Line 20: Comment

```typescript
// Dynamic query key builder that includes request parameters
```

**What it does:**
- Documentation comment
- Explains what `byRequest` does

---

## Line 21: ByRequest Function

```typescript
const byRequest = (request?: GetPostsRequestInterface) => {
```

**What it does:**
- Creates a function called `byRequest`
- Parameter: `request` (optional)
- Type: `GetPostsRequestInterface | undefined`

**Why this function?**
- Alternative pattern for building query keys
- Returns an object (not just an array)
- Allows for future extensibility

**Examples:**
```typescript
byRequest()                  // request = undefined
byRequest({ limit: 10 })     // request = { limit: 10 }
```

---

## Line 22-24: Return Object

```typescript
return {
  key: [...lists(), request] as const,
};
```

**What it does:**
- Returns an object with a `key` property
- The `key` property contains the actual query key array

**Breaking it down:**
```typescript
lists() = ["posts", "list"]
[...lists(), request]
= [...["posts", "list"], request]
= ["posts", "list", request]
```

**Examples:**

```typescript
byRequest({ limit: 10 })
→ {
    key: [...lists(), { limit: 10 }]
  }
→ {
    key: ["posts", "list", { limit: 10 }]
  }
```

**Why return an object?**
- Allows for future properties:
  ```typescript
  return {
    key: [...lists(), request],
    filters: request?.filters,  // Could add more properties
    metadata: { timestamp: Date.now() }
  };
  ```

**Usage:**
```typescript
byRequest({ limit: 10 }).key
// Returns: ["posts", "list", { limit: 10 }]
```

**Note:** Currently returns the same as `list()`, but pattern is extensible

---

## Line 27-38: Return Object

```typescript
return {
  all,
  lists,
  list,
  details,
  detail,
  byRequest,
  // Sub object for nested queries
  sub: {
    byRequest,
  },
};
```

**What it does:**
- Returns an object with all query key functions
- Exports everything that will be used outside

**Breaking down each property:**

**1. `all`**
```typescript
all = ["posts"]
```
- Base key for all posts queries

**2. `lists`**
```typescript
lists = () => ["posts", "list"]
```
- Function that returns base list key

**3. `list`**
```typescript
list = (params?) => ["posts", "list", params]
```
- Function that returns list key with params

**4. `details`**
```typescript
details = () => ["posts", "detail"]
```
- Function that returns base detail key

**5. `detail`**
```typescript
detail = (id) => ["posts", "detail", id]
```
- Function that returns detail key with ID

**6. `byRequest`**
```typescript
byRequest = (request?) => { key: ["posts", "list", request] }
```
- Function that returns object with key property

**7. `sub: { byRequest }`**
```typescript
sub = {
  byRequest: (request?) => { key: ["posts", "list", request] }
}
```
- Nested object with `byRequest` again
- Provides alternative access pattern

**Why export all these?**
- Different use cases need different keys
- `all` for invalidating everything
- `lists()` for invalidating all lists
- `list(params)` for specific list queries
- `detail(id)` for specific post queries

---

## Line 41: Export Instance

```typescript
export const postQueryKeys = createQueryKeys();
```

**What it does:**
- Calls `createQueryKeys()` function
- Stores the returned object in `postQueryKeys`
- Exports it so other files can use it

**What is `postQueryKeys`?**
```typescript
postQueryKeys = {
  all: ["posts"],
  lists: () => ["posts", "list"],
  list: (params?) => ["posts", "list", params],
  details: () => ["posts", "detail"],
  detail: (id) => ["posts", "detail", id],
  byRequest: (request?) => { key: ["posts", "list", request] },
  sub: {
    byRequest: (request?) => { key: ["posts", "list", request] }
  }
}
```

**Usage in other files:**
```typescript
import { postQueryKeys } from "./query-keys";

postQueryKeys.list({ limit: 10 })  // ["posts", "list", { limit: 10 }]
postQueryKeys.detail(1)             // ["posts", "detail", 1]
```

---

## Line 43: Comment

```typescript
// Helper to get query key with request params
```

**What it does:**
- Documentation comment
- Explains the helper function

---

## Line 44-48: Helper Function

```typescript
export const getPostsQueryKey = (
  request?: GetPostsRequestInterface
): QueryKey => {
  return postQueryKeys.list(request);
};
```

**What it does:**
- Exports a helper function
- Parameter: `request` (optional)
- Return type: `QueryKey` (TypeScript type)
- Returns: The same as `postQueryKeys.list(request)`

**Breaking it down:**

**Line 44-46: Function Declaration**
```typescript
export const getPostsQueryKey = (request?: GetPostsRequestInterface): QueryKey => {
```
- `export` = Makes it available to other files
- `const getPostsQueryKey` = Function name
- `(request?: GetPostsRequestInterface)` = Optional parameter
- `: QueryKey` = Return type annotation
- `=>` = Arrow function

**Line 47: Return Statement**
```typescript
return postQueryKeys.list(request);
```
- Calls `postQueryKeys.list(request)`
- Returns the query key array

**Why this helper?**
- Convenience function
- Shorter name: `getPostsQueryKey()` vs `postQueryKeys.list()`
- Can add additional logic here if needed
- Explicit return type for TypeScript

**Usage:**
```typescript
import { getPostsQueryKey } from "./query-keys";

const key = getPostsQueryKey({ limit: 10 });
// Returns: ["posts", "list", { limit: 10 }]
```

**Note:** This is optional - you can also use `postQueryKeys.list()` directly

---

## Complete Flow Example

Let's trace through a complete example:

```typescript
// User calls:
postQueryKeys.list({ limit: 10, skip: 0 })

// Step 1: list() function receives params
list({ limit: 10, skip: 0 })

// Step 2: calls lists()
lists() → [...all, "list"]

// Step 3: all = ["posts"]
[...["posts"], "list"] → ["posts", "list"]

// Step 4: spreads lists() and adds params
[...["posts", "list"], { limit: 10, skip: 0 }]

// Step 5: Final result
["posts", "list", { limit: 10, skip: 0 }]
```

---

## Summary

**Key Concepts:**

1. **Factory Pattern** - `createQueryKeys()` creates isolated scope
2. **Hierarchical Keys** - Build keys from base to specific
3. **Spread Operator** - `...array` spreads array elements
4. **`as const`** - Makes arrays immutable and literal typed
5. **Optional Parameters** - `?` makes parameters optional
6. **Union Types** - `number | string` accepts either type
7. **Return Objects** - Functions return objects with properties
8. **Type Safety** - TypeScript ensures correctness

**Structure:**
```
Base: ["posts"]
  ├── Lists: ["posts", "list"]
  │   └── With params: ["posts", "list", { limit: 10 }]
  └── Details: ["posts", "detail"]
      └── With ID: ["posts", "detail", 1]
```

This code creates a type-safe, hierarchical system for managing React Query cache keys!

