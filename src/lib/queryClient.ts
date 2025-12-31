import { QueryClient } from "@tanstack/react-query";

// Create a query client with default options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // Data is immediately stale (will refetch on mount/window focus)
      retry: 1, // Retry failed requests once
      refetchOnWindowFocus: true, // Refetch when window regains focus
    },
    mutations: {
      retry: 1,
    },
  },
});
