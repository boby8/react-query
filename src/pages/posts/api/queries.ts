import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { postQueryKeys } from "./query-keys";
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  patchPost,
  deletePost,
} from "./api";
import type {
  GetPostsRequestInterface,
  CreatePostRequestInterface,
  UpdatePostRequestInterface,
  Post,
} from "./types";
import { getApiRequestContext } from "../../../api/types";

/**
 * Query hook to fetch all posts
 */
export const usePostsQuery = (request: GetPostsRequestInterface = {}) => {
  return useQuery({
    queryKey: postQueryKeys.list(request),
    queryFn: async (context) => {
      const { data } = await getPosts(request, getApiRequestContext(context));
      return data;
    },
  });
};

/**
 * Query hook to fetch a single post by ID
 */
export const usePostQuery = (id: number | string) => {
  return useQuery({
    queryKey: postQueryKeys.detail(id),
    queryFn: async (context) => {
      const { data } = await getPost(id, getApiRequestContext(context));
      return data;
    },
    enabled: !!id,
  });
};

/**
 * Mutation hook to create a post
 */
export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: CreatePostRequestInterface) => {
      const { data } = await createPost(request);
      return data;
    },
    onSuccess: (newPost) => {
      // Optimistically update the cache by adding the new post
      queryClient.setQueryData<Post[]>(postQueryKeys.list({}), (oldPosts) => {
        if (!oldPosts) return [newPost];
        return [newPost, ...oldPosts];
      });
    },
  });
};

/**
 * Mutation hook to update a post (PUT - full update)
 */
export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      request,
    }: {
      id: number | string;
      request: UpdatePostRequestInterface;
    }) => {
      const { data } = await updatePost(id, request);
      return data;
    },
    onSuccess: (updatedPost, variables) => {
      // Optimistically update the cache
      queryClient.setQueryData<Post[]>(postQueryKeys.list({}), (oldPosts) => {
        if (!oldPosts) return oldPosts || [];
        return oldPosts.map((post) =>
          post.id === Number(variables.id) ? updatedPost : post
        );
      });
      // Update the single post cache as well
      queryClient.setQueryData<Post>(
        postQueryKeys.detail(variables.id),
        updatedPost
      );
    },
  });
};

/**
 * Mutation hook to patch a post (PATCH - partial update)
 */
export const usePatchPostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      request,
    }: {
      id: number | string;
      request: UpdatePostRequestInterface;
    }) => {
      const { data } = await patchPost(id, request);
      return data;
    },
    onSuccess: (_data, variables) => {
      // Invalidate both the list and the specific post detail
      queryClient.invalidateQueries({ queryKey: postQueryKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: postQueryKeys.detail(variables.id),
      });
    },
  });
};

/**
 * Mutation hook to delete a post
 */
export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | string) => {
      const { data } = await deletePost(id);
      return data;
    },
    onSuccess: (_data, deletedId) => {
      // Optimistically remove the post from the cache
      queryClient.setQueryData<Post[]>(postQueryKeys.list({}), (oldPosts) => {
        if (!oldPosts) return oldPosts || [];
        return oldPosts.filter((post) => post.id !== Number(deletedId));
      });
      // Remove the single post cache
      queryClient.removeQueries({
        queryKey: postQueryKeys.detail(deletedId),
      });
    },
  });
};
