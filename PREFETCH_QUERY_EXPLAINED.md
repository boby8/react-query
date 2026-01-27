# prefetchQuery Explained: Pre-loading Data Before It's Needed

## What is `prefetchQuery`?

`prefetchQuery` is a React Query method that **fetches data and stores it in the cache BEFORE it's actually needed**.

Think of it like:
- **Pre-ordering food** before you arrive at the restaurant
- **Pre-loading a webpage** before you click the link
- **Warming up the car** before you get in

**The Goal:** Make data available instantly when the component actually needs it.

---

## Basic Concept

### Normal Query Flow (Without Prefetch)

```
1. User navigates to page
2. Component mounts
3. useQuery() runs
4. Loading state shown
5. API call happens
6. Data arrives
7. Component renders with data
```

**Problem:** User sees loading spinner while waiting for data.

### With prefetchQuery Flow

```
1. User hovers/clicks link (but hasn't navigated yet)
2. prefetchQuery() runs in background
3. API call happens
4. Data stored in cache
5. User navigates to page
6. Component mounts
7. useQuery() checks cache
8. Data found in cache → Instantly available! ✅
9. Component renders with data (no loading!)
```

**Benefit:** Data is ready when component needs it!

---

## How prefetchQuery Works

### Basic Syntax

```typescript
queryClient.prefetchQuery({
  queryKey: ['posts', 'detail', id],
  queryFn: () => fetchPost(id),
});
```

**What it does:**
1. Fetches data from API
2. Stores it in React Query cache
3. Returns a Promise
4. Doesn't trigger component re-renders
5. Doesn't show loading states

---

## When to Use prefetchQuery

### 1. Prefetch on Hover (Best UX)

**Use Case:** User hovers over a link, prefetch data before they click

```typescript
<Link
  to={`/posts/${post.id}`}
  onMouseEnter={() => {
    // User hovers → Prefetch data
    queryClient.prefetchQuery({
      queryKey: ['posts', 'detail', post.id],
      queryFn: () => fetchPost(post.id),
    });
  }}
>
  View Post
</Link>
```

**Result:**
- User hovers → Data starts loading
- User clicks → Data likely already loaded
- Page loads instantly! ⚡

---

### 2. Prefetch on Route Loader (React Router)

**Use Case:** Prefetch data in route loader before page renders

```typescript
import { createBrowserRouter } from 'react-router-dom';
import { queryClient } from './lib/queryClient';

const router = createBrowserRouter([
  {
    path: '/posts/:id',
    loader: async ({ params }) => {
      // Prefetch before component renders
      await queryClient.prefetchQuery({
        queryKey: ['posts', 'detail', params.id],
        queryFn: () => fetchPost(params.id!),
      });
      return null;
    },
    element: <PostDetail />,
  },
]);
```

**Result:**
- Navigation starts → Loader runs
- Data prefetches → Stored in cache
- Component renders → Data already in cache
- No loading state! ⚡

---

### 3. Prefetch Related Data

**Use Case:** When viewing a post, prefetch comments

```typescript
// In PostDetail component
useEffect(() => {
  if (postId) {
    // Prefetch comments while user reads post
    queryClient.prefetchQuery({
      queryKey: ['posts', postId, 'comments'],
      queryFn: () => fetchComments(postId),
    });
  }
}, [postId]);
```

**Result:**
- User reads post → Comments load in background
- User scrolls to comments → Already loaded! ⚡

---

### 4. Prefetch on List Item

**Use Case:** Prefetch detail data for items in a list

```typescript
function PostListItem({ post }) {
  const handleMouseEnter = () => {
    // Prefetch detail when user hovers list item
    queryClient.prefetchQuery({
      queryKey: ['posts', 'detail', post.id],
      queryFn: () => fetchPost(post.id),
    });
  };

  return (
    <div onMouseEnter={handleMouseEnter}>
      <Link to={`/posts/${post.id}`}>{post.title}</Link>
    </div>
  );
}
```

---

## Complete Example: Prefetch on Hover

### Setup

```typescript
// In your component file
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getPost } from './api/api';
import { postQueryKeys } from './api/query-keys';

function PostList() {
  const queryClient = useQueryClient();

  const handlePostHover = (postId: number) => {
    // Prefetch when user hovers
    queryClient.prefetchQuery({
      queryKey: postQueryKeys.detail(postId),
      queryFn: async () => {
        const { data } = await getPost(postId);
        return data;
      },
    });
  };

  return (
    <div>
      {posts.map(post => (
        <Link
          key={post.id}
          to={`/posts/${post.id}`}
          onMouseEnter={() => handlePostHover(post.id)}
        >
          {post.title}
        </Link>
      ))}
    </div>
  );
}
```

### Detail Page (Uses Prefetched Data)

```typescript
function PostDetail({ id }: { id: number }) {
  // This will use prefetched data if available!
  const { data: post, isLoading } = useQuery({
    queryKey: postQueryKeys.detail(id),
    queryFn: async () => {
      const { data } = await getPost(id);
      return data;
    },
  });

  // isLoading will be false immediately if data was prefetched!
  if (isLoading) return <div>Loading...</div>;

  return <div>{post?.title}</div>;
}
```

---

## prefetchQuery vs useQuery

### useQuery

```typescript
const { data, isLoading } = useQuery({
  queryKey: ['posts', id],
  queryFn: fetchPost,
});
```

**Characteristics:**
- ✅ Hook - Must be used in React component
- ✅ Triggers re-renders when data changes
- ✅ Shows loading states
- ✅ Can cause loading spinners
- ✅ Used when you need data in component

### prefetchQuery

```typescript
queryClient.prefetchQuery({
  queryKey: ['posts', id],
  queryFn: fetchPost,
});
```

**Characteristics:**
- ✅ Method - Can be called anywhere
- ✅ Doesn't trigger re-renders
- ✅ No loading states
- ✅ Silent background fetch
- ✅ Used to prepare data before it's needed

---

## prefetchQuery Parameters

### Full Syntax

```typescript
queryClient.prefetchQuery({
  queryKey: ['posts', 'detail', id],  // Cache key
  queryFn: () => fetchPost(id),        // Function to fetch data
  staleTime: 5000,                     // Optional: How long data stays fresh
  gcTime: 300000,                      // Optional: Cache time (formerly cacheTime)
});
```

### Parameters Explained

**1. queryKey (Required)**
```typescript
queryKey: ['posts', 'detail', id]
```
- Identifies the cache entry
- Must match the key used in `useQuery`

**2. queryFn (Required)**
```typescript
queryFn: async () => {
  const { data } = await fetchPost(id);
  return data;
}
```
- Function that fetches the data
- Should return the data (not Axios response)

**3. staleTime (Optional)**
```typescript
staleTime: 5000  // 5 seconds
```
- How long prefetched data stays "fresh"
- If data is fresh, `useQuery` won't refetch
- Default: 0 (data is immediately stale)

**4. gcTime (Optional)**
```typescript
gcTime: 300000  // 5 minutes
```
- How long unused data stays in cache
- Previously called `cacheTime`
- Default: 5 minutes

---

## Important: Matching Query Keys

**Critical Rule:** The `queryKey` in `prefetchQuery` must **exactly match** the `queryKey` in `useQuery`!

### ✅ Correct (Keys Match)

```typescript
// Prefetch
queryClient.prefetchQuery({
  queryKey: ['posts', 'detail', 1],  // Key
  queryFn: () => fetchPost(1),
});

// Use in component
useQuery({
  queryKey: ['posts', 'detail', 1],  // Same key! ✅
  queryFn: () => fetchPost(1),
});
// Result: Uses prefetched data!
```

### ❌ Incorrect (Keys Don't Match)

```typescript
// Prefetch
queryClient.prefetchQuery({
  queryKey: ['posts', 'detail', 1],  // Key
  queryFn: () => fetchPost(1),
});

// Use in component
useQuery({
  queryKey: ['post', 'detail', 1],  // Different key! ❌
  queryFn: () => fetchPost(1),
});
// Result: Won't use prefetched data, will fetch again!
```

---

## Using with Query Key Functions

**Best Practice:** Use your query key functions to ensure matching keys!

```typescript
import { postQueryKeys } from './api/query-keys';

// Prefetch
queryClient.prefetchQuery({
  queryKey: postQueryKeys.detail(1),  // ["posts", "detail", 1]
  queryFn: () => fetchPost(1),
});

// Use in component
useQuery({
  queryKey: postQueryKeys.detail(1),  // Same key! ✅
  queryFn: () => fetchPost(1),
});
```

---

## Return Value

`prefetchQuery` returns a Promise that resolves when data is fetched:

```typescript
// Without await (fire and forget)
queryClient.prefetchQuery({
  queryKey: ['posts', id],
  queryFn: () => fetchPost(id),
});

// With await (wait for prefetch to complete)
await queryClient.prefetchQuery({
  queryKey: ['posts', id],
  queryFn: () => fetchPost(id),
});
// Now data is definitely in cache
```

---

## Error Handling

`prefetchQuery` doesn't throw errors by default - it fails silently:

```typescript
// Silent failure (default)
queryClient.prefetchQuery({
  queryKey: ['posts', id],
  queryFn: () => fetchPost(id),  // If this fails, error is silently ignored
});

// Handle errors explicitly
try {
  await queryClient.prefetchQuery({
    queryKey: ['posts', id],
    queryFn: () => fetchPost(id),
  });
} catch (error) {
  console.error('Prefetch failed:', error);
  // Handle error (maybe show toast, log, etc.)
}
```

---

## Real-World Example: Post List with Prefetch

### Complete Implementation

```typescript
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getPosts, getPost } from './api/api';
import { postQueryKeys } from './api/query-keys';

function PostList() {
  const queryClient = useQueryClient();

  // Fetch posts list
  const { data: posts } = useQuery({
    queryKey: postQueryKeys.list(),
    queryFn: async () => {
      const { data } = await getPosts();
      return data;
    },
  });

  // Prefetch function
  const prefetchPost = (postId: number) => {
    queryClient.prefetchQuery({
      queryKey: postQueryKeys.detail(postId),
      queryFn: async () => {
        const { data } = await getPost(postId);
        return data;
      },
      staleTime: 5000,  // Data stays fresh for 5 seconds
    });
  };

  return (
    <div>
      <h1>Posts</h1>
      {posts?.map(post => (
        <div key={post.id}>
          <Link
            to={`/posts/${post.id}`}
            onMouseEnter={() => prefetchPost(post.id)}  // Prefetch on hover
          >
            {post.title}
          </Link>
        </div>
      ))}
    </div>
  );
}
```

### Detail Page Component

```typescript
function PostDetail({ id }: { id: number }) {
  // If data was prefetched, this will be instant!
  const { data: post, isLoading } = useQuery({
    queryKey: postQueryKeys.detail(id),  // Same key as prefetch
    queryFn: async () => {
      const { data } = await getPost(id);
      return data;
    },
  });

  // If prefetched, isLoading will be false immediately
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{post?.title}</h1>
      <p>{post?.body}</p>
    </div>
  );
}
```

---

## Performance Benefits

### Without Prefetch

```
User clicks link
  ↓
Navigation starts (200ms)
  ↓
Component mounts
  ↓
useQuery runs
  ↓
API call starts
  ↓
Loading state shown
  ↓
Wait for API (500ms)
  ↓
Data arrives
  ↓
Render component
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total: ~700ms + loading spinner
```

### With Prefetch

```
User hovers link
  ↓
prefetchQuery runs (background)
  ↓
API call starts
  ↓
Data arrives (500ms)
  ↓
Data stored in cache
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
User clicks link
  ↓
Navigation starts (200ms)
  ↓
Component mounts
  ↓
useQuery checks cache
  ↓
Data found! ✅
  ↓
Render component (instant)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total: ~200ms, no loading spinner!
```

**Improvement:** 500ms faster, no loading state! ⚡

---

## Best Practices

### ✅ DO

1. **Use query key functions** - Ensures keys match
   ```typescript
   queryKey: postQueryKeys.detail(id)
   ```

2. **Prefetch on user intent** - Hover, click, route loader
   ```typescript
   onMouseEnter={() => prefetchPost(id)}
   ```

3. **Set appropriate staleTime** - Prevent unnecessary refetches
   ```typescript
   staleTime: 5000  // 5 seconds
   ```

4. **Handle errors** - Prefetch can fail
   ```typescript
   try {
     await queryClient.prefetchQuery(...);
   } catch (error) {
     // Handle
   }
   ```

### ❌ DON'T

1. **Don't prefetch everything** - Only prefetch what user likely needs
   ```typescript
   // ❌ Bad: Prefetch all posts
   posts.forEach(post => prefetchPost(post.id));
   
   // ✅ Good: Prefetch only on hover
   onMouseEnter={() => prefetchPost(post.id)}
   ```

2. **Don't forget to match keys** - Keys must match exactly
   ```typescript
   // ❌ Different keys
   prefetch: ['posts', id]
   useQuery: ['post', id]
   ```

3. **Don't rely on prefetch** - Always handle loading state
   ```typescript
   // Prefetch might fail or not run
   // Always handle loading in component
   if (isLoading) return <Loader />;
   ```

---

## Common Patterns

### Pattern 1: Prefetch on Hover (Most Common)

```typescript
<Link
  to={`/posts/${id}`}
  onMouseEnter={() => {
    queryClient.prefetchQuery({
      queryKey: postQueryKeys.detail(id),
      queryFn: () => getPost(id),
    });
  }}
>
  View Post
</Link>
```

### Pattern 2: Prefetch in Route Loader

```typescript
{
  path: '/posts/:id',
  loader: async ({ params }) => {
    await queryClient.prefetchQuery({
      queryKey: postQueryKeys.detail(params.id!),
      queryFn: () => getPost(params.id!),
    });
  },
}
```

### Pattern 3: Prefetch Related Data

```typescript
useEffect(() => {
  if (postId) {
    // Prefetch comments while user reads post
    queryClient.prefetchQuery({
      queryKey: ['posts', postId, 'comments'],
      queryFn: () => getComments(postId),
    });
  }
}, [postId]);
```

---

## Summary

**What is prefetchQuery?**
- Method to fetch and cache data before it's needed
- Makes data available instantly when component loads

**When to use:**
- Prefetch on hover (links, buttons)
- Prefetch in route loaders
- Prefetch related data

**Key Points:**
1. Query keys must match exactly
2. Doesn't trigger re-renders
3. Silent background fetch
4. Returns Promise
5. Data stored in cache for instant access

**Benefit:**
- Faster page loads
- Better user experience
- No loading spinners
- Feels instant!

**Remember:**
- Always match query keys
- Handle errors
- Don't over-prefetch
- Still handle loading states in components


