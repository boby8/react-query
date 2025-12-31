// Global API endpoints constants
export const ENDPOINTS = {
  USERS: {
    BASE: "/users",
    LIST: "/users",
    DETAIL: (id: number | string) => `/users/${id}`,
    ADD: "/users/add",
    UPDATE: (id: number | string) => `/users/${id}`,
    DELETE: (id: number | string) => `/users/${id}`,
  },
  POSTS: {
    BASE: "/posts",
    LIST: "/posts",
    DETAIL: (id: number | string) => `/posts/${id}`,
    UPDATE: (id: number | string) => `/posts/${id}`,
    DELETE: (id: number | string) => `/posts/${id}`,
    COMMENTS: (postId: number | string) => `/posts/${postId}/comments`,
  },
  COMMENTS: {
    BASE: "/comments",
    LIST: "/comments",
    DETAIL: (id: number | string) => `/comments/${id}`,
  },
  ALBUMS: {
    BASE: "/albums",
    LIST: "/albums",
    DETAIL: (id: number | string) => `/albums/${id}`,
  },
  PHOTOS: {
    BASE: "/photos",
    LIST: "/photos",
    DETAIL: (id: number | string) => `/photos/${id}`,
  },
  TODOS: {
    BASE: "/todos",
    LIST: "/todos",
    DETAIL: (id: number | string) => `/todos/${id}`,
  },
} as const;
