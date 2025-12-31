import { useQuery } from "@tanstack/react-query";
import { customerQueryKeys } from "./query-keys";
import { getUsers } from "./api";
import type { GetUsersRequestInterface } from "./types";
import { getApiRequestContext } from "../../../api/types";

export const useUsersQuery = (request: GetUsersRequestInterface = {}) => {
  return useQuery({
    queryKey: customerQueryKeys.list(request),
    queryFn: async (context) => {
      const { data } = await getUsers(request, getApiRequestContext(context));
      return data;
    },
  });
};
