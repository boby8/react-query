import type { QueryKey } from "@tanstack/react-query";
import type { GetUsersRequestInterface } from "./types";

// Base query keys factory
const createQueryKeys = () => {
  const all = ["customers"] as const;

  const lists = () => [...all, "list"] as const;

  const list = (params?: GetUsersRequestInterface) => {
    return [...lists(), params] as const;
  };

  const details = () => [...all, "detail"] as const;

  const detail = (id: number | string) => {
    return [...details(), id] as const;
  };

  // Dynamic query key builder that includes request parameters
  const byRequest = (request?: GetUsersRequestInterface) => {
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
    // Sub object for nested queries
    sub: {
      byRequest,
    },
  };
};

export const customerQueryKeys = createQueryKeys();

// Helper to get query key with request params
export const getUsersQueryKey = (
  request?: GetUsersRequestInterface
): QueryKey => {
  return customerQueryKeys.list(request);
};
