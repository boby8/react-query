// Centralized query keys factory for type-safe query key management
export const queryKeys = {
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    list: (params?: { limit?: number; skip?: number }) =>
      [...queryKeys.users.lists(), params] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: number | string) =>
      [...queryKeys.users.details(), id] as const,
  },
} as const;
