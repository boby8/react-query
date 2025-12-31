import api from "../../../api";
import type { ApiRequestContext } from "../../../api/types";
import { ENDPOINTS } from "../../../constants/endpoints";
import type {
  GetPostsRequestInterface,
  GetPostsResponseInterface,
  CreatePostRequestInterface,
  CreatePostResponseInterface,
  UpdatePostRequestInterface,
  UpdatePostResponseInterface,
  Post,
} from "./types";

/**
 * Get all posts
 */
export const getPosts = (
  request: GetPostsRequestInterface = {},
  context?: ApiRequestContext
) => {
  return api.get<GetPostsResponseInterface>(ENDPOINTS.POSTS.LIST, {
    params: request,
    signal: context?.signal,
  });
};

/**
 * Get a single post by ID
 */
export const getPost = (id: number | string, context?: ApiRequestContext) => {
  return api.get<Post>(ENDPOINTS.POSTS.DETAIL(id), {
    signal: context?.signal,
  });
};

/**
 * Create a new post
 */
export const createPost = (
  request: CreatePostRequestInterface,
  context?: ApiRequestContext
) => {
  return api.post<CreatePostResponseInterface>(ENDPOINTS.POSTS.LIST, request, {
    signal: context?.signal,
  });
};

/**
 * Update a post (PUT - full update)
 */
export const updatePost = (
  id: number | string,
  request: UpdatePostRequestInterface,
  context?: ApiRequestContext
) => {
  return api.put<UpdatePostResponseInterface>(
    ENDPOINTS.POSTS.UPDATE(id),
    request,
    {
      signal: context?.signal,
    }
  );
};

/**
 * Update a post (PATCH - partial update)
 */
export const patchPost = (
  id: number | string,
  request: UpdatePostRequestInterface,
  context?: ApiRequestContext
) => {
  return api.patch<UpdatePostResponseInterface>(
    ENDPOINTS.POSTS.DETAIL(id),
    request,
    {
      signal: context?.signal,
    }
  );
};

/**
 * Delete a post
 */
export const deletePost = (
  id: number | string,
  context?: ApiRequestContext
) => {
  return api.delete<Post>(ENDPOINTS.POSTS.DELETE(id), {
    signal: context?.signal,
  });
};
