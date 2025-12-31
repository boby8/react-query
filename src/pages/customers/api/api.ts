import api from "../../../api";
import type { ApiRequestContext } from "../../../api/types";
import { ENDPOINTS } from "../../../constants/endpoints";
import type {
  GetUsersRequestInterface,
  GetUsersResponseInterface,
} from "./types";

/**
 * Fetch all users from the API
 */
export const getUsers = (
  request: GetUsersRequestInterface = {},
  context?: ApiRequestContext
) => {
  return api.get<GetUsersResponseInterface>(ENDPOINTS.USERS.LIST, {
    params: request,
    signal: context?.signal,
  });
};
