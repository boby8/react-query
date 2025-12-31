// Post types based on JSONPlaceholder API structure
export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface CreatePostRequestInterface {
  title: string;
  body: string;
  userId: number;
}

export interface UpdatePostRequestInterface {
  title?: string;
  body?: string;
  userId?: number;
}

export interface GetPostsRequestInterface {
  limit?: number;
  skip?: number;
}

export type GetPostsResponseInterface = Post[];

export type CreatePostResponseInterface = Post;

export type UpdatePostResponseInterface = Post;
