# API Usage Documentation

## Base API
**Service:** JSONPlaceholder  
**Base URL:** `https://jsonplaceholder.typicode.com`  
**Type:** Fake REST API for testing (data doesn't persist)

---

## Currently Active Page: **Posts** (`/posts`)

### Posts API Endpoints

| Operation | HTTP Method | Endpoint | Function | Purpose |
|-----------|------------|----------|----------|---------|
| **Read (List)** | GET | `/posts` | `getPosts()` | Fetch all posts |
| **Read (Single)** | GET | `/posts/:id` | `getPost(id)` | Fetch a single post by ID |
| **Create** | POST | `/posts` | `createPost(request)` | Create a new post |
| **Update (Full)** | PUT | `/posts/:id` | `updatePost(id, request)` | Full update of a post |
| **Update (Partial)** | PATCH | `/posts/:id` | `patchPost(id, request)` | Partial update of a post |
| **Delete** | DELETE | `/posts/:id` | `deletePost(id)` | Delete a post by ID |

### Posts Data Structure
```typescript
interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}
```

### Posts Usage in Code
- **Page:** `src/pages/posts/index.tsx`
- **API Functions:** `src/pages/posts/api/api.ts`
- **React Query Hooks:** `src/pages/posts/api/queries.ts`
- **Types:** `src/pages/posts/api/types.ts`
- **Query Keys:** `src/pages/posts/api/query-keys.ts`

---

## Available but Not Currently Used: **Customers** (`/customers`)

### Users API Endpoints

| Operation | HTTP Method | Endpoint | Function | Purpose |
|-----------|------------|----------|----------|---------|
| **Read (List)** | GET | `/users` | `getUsers()` | Fetch all users/customers |

### Users Data Structure
```typescript
interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: { ... };
  phone: string;
  website: string;
  company: { ... };
}
```

### Customers Usage in Code
- **Page:** `src/pages/customers/index.tsx` (not currently shown)
- **API Functions:** `src/pages/customers/api/api.ts`
- **React Query Hooks:** `src/pages/customers/api/queries.ts`
- **Types:** `src/pages/customers/api/types.ts`
- **Query Keys:** `src/pages/customers/api/query-keys.ts`

---

## Other Available Endpoints (Not Currently Used)

The following endpoints are defined in `src/constants/endpoints.ts` but not implemented:

1. **Comments**
   - GET `/comments`
   - GET `/comments/:id`
   - GET `/posts/:postId/comments`

2. **Albums**
   - GET `/albums`
   - GET `/albums/:id`

3. **Photos**
   - GET `/photos`
   - GET `/photos/:id`

4. **Todos**
   - GET `/todos`
   - GET `/todos/:id`

---

## Summary

**Currently Active:**
- ✅ **Posts** - Full CRUD operations (Create, Read, Update, Delete)

**Available but Inactive:**
- ⚠️ **Customers/Users** - Read-only (list view)

**Not Implemented:**
- ❌ Comments, Albums, Photos, Todos

---

## Important Notes

1. **JSONPlaceholder Limitations:**
   - ⚠️ **Data doesn't persist (changes are simulated)**
   - ⚠️ **POST/PUT/DELETE return success but don't save data**
   - ⚠️ **On page refresh, all changes disappear** (server returns original data)
   - This is a FAKE/MOCK API for testing purposes only
   - Solution: Using optimistic updates to update React Query cache immediately

2. **Current Implementation:**
   - Posts page uses optimistic updates for instant UI updates
   - All mutations update the cache directly using `setQueryData`
   - Changes appear immediately but are lost on page refresh
   - When you refresh, React Query refetches from server (returns original 100 posts)

3. **Why Data Disappears on Refresh:**
   - JSONPlaceholder doesn't have a database - it's just a mock service
   - All your create/update/delete operations are simulated
   - React Query cache is cleared on page reload
   - Fresh fetch from server returns the original data (no your changes)

4. **To Make Data Persist:**
   - Use a real backend API with a database (e.g., your own API, Firebase, Supabase)
   - Or implement localStorage persistence (only works locally in browser)

