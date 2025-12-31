import { useState, useMemo } from "react";
import {
  usePostsQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} from "./api/queries";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import type {
  Post,
  CreatePostRequestInterface,
  UpdatePostRequestInterface,
} from "./api/types";

const ITEMS_PER_PAGE = 10;

export default function PostsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  // Fetch all posts
  const {
    isLoading,
    data: allPosts,
    error,
    isError,
    isFetching,
    refetch,
  } = usePostsQuery({});

  // Mutations
  const createMutation = useCreatePostMutation();
  const updateMutation = useUpdatePostMutation();
  const deleteMutation = useDeletePostMutation();

  // Client-side pagination
  const paginatedPosts = useMemo(() => {
    if (!allPosts) return [];
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return allPosts.slice(startIndex, endIndex);
  }, [allPosts, currentPage]);

  const totalPosts = allPosts?.length || 0;
  const totalPages = Math.ceil(totalPosts / ITEMS_PER_PAGE);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const handlePrevPage = () => {
    if (hasPrevPage) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const handleCreate = async (data: CreatePostRequestInterface) => {
    try {
      await createMutation.mutateAsync(data);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleUpdate = async (id: number, data: UpdatePostRequestInterface) => {
    try {
      await updateMutation.mutateAsync({ id, request: data });
      setEditingPost(null);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: "600" }}>
          Posts
        </h1>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          {isFetching && (
            <span
              style={{
                fontSize: "0.875rem",
                color: "#666",
                fontStyle: "italic",
              }}
            >
              Refreshing...
            </span>
          )}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "0.9375rem",
              fontWeight: "500",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#1565c0";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#1976d2";
            }}
          >
            Create Post
          </button>
        </div>
      </div>

      {paginatedPosts && paginatedPosts.length > 0 ? (
        <>
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#f5f5f5",
                    borderBottom: "2px solid #e0e0e0",
                  }}
                >
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      fontWeight: "600",
                      color: "#333",
                      fontSize: "0.875rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    ID
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      fontWeight: "600",
                      color: "#333",
                      fontSize: "0.875rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Title
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      fontWeight: "600",
                      color: "#333",
                      fontSize: "0.875rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Body
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      fontWeight: "600",
                      color: "#333",
                      fontSize: "0.875rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    User ID
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "center",
                      fontWeight: "600",
                      color: "#333",
                      fontSize: "0.875rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedPosts.map((post) => (
                  <tr
                    key={post.id}
                    style={{
                      borderBottom: "1px solid #f0f0f0",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f9f9f9";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#fff";
                    }}
                  >
                    <td
                      style={{
                        padding: "1rem",
                        color: "#666",
                        fontSize: "0.9375rem",
                      }}
                    >
                      {post.id}
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        color: "#333",
                        fontSize: "0.9375rem",
                        fontWeight: "500",
                        maxWidth: "300px",
                      }}
                    >
                      {post.title}
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        color: "#666",
                        fontSize: "0.9375rem",
                        maxWidth: "400px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {post.body}
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        color: "#666",
                        fontSize: "0.9375rem",
                      }}
                    >
                      {post.userId}
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          justifyContent: "center",
                        }}
                      >
                        <button
                          onClick={() => setEditingPost(post)}
                          style={{
                            padding: "0.5rem 1rem",
                            backgroundColor: "#1976d2",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "0.875rem",
                            transition: "background-color 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#1565c0";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#1976d2";
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          disabled={deleteMutation.isPending}
                          style={{
                            padding: "0.5rem 1rem",
                            backgroundColor: "#d32f2f",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: deleteMutation.isPending
                              ? "not-allowed"
                              : "pointer",
                            fontSize: "0.875rem",
                            opacity: deleteMutation.isPending ? 0.6 : 1,
                            transition: "background-color 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            if (!deleteMutation.isPending) {
                              e.currentTarget.style.backgroundColor = "#c62828";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!deleteMutation.isPending) {
                              e.currentTarget.style.backgroundColor = "#d32f2f";
                            }
                          }}
                        >
                          {deleteMutation.isPending ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "2rem",
              padding: "1rem",
            }}
          >
            <div
              style={{
                fontSize: "0.875rem",
                color: "#666",
              }}
            >
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, totalPosts)} of{" "}
              {totalPosts} posts
            </div>

            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
              }}
            >
              <button
                onClick={handlePrevPage}
                disabled={!hasPrevPage}
                style={{
                  padding: "0.5rem 1rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  backgroundColor: hasPrevPage ? "#fff" : "#f5f5f5",
                  color: hasPrevPage ? "#333" : "#999",
                  cursor: hasPrevPage ? "pointer" : "not-allowed",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                }}
              >
                Previous
              </button>

              <div style={{ display: "flex", gap: "0.25rem" }}>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageClick(pageNum)}
                      style={{
                        padding: "0.5rem 0.75rem",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        backgroundColor:
                          currentPage === pageNum ? "#1976d2" : "#fff",
                        color: currentPage === pageNum ? "#fff" : "#333",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                        minWidth: "2.5rem",
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleNextPage}
                disabled={!hasNextPage}
                style={{
                  padding: "0.5rem 1rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  backgroundColor: hasNextPage ? "#fff" : "#f5f5f5",
                  color: hasNextPage ? "#333" : "#999",
                  cursor: hasNextPage ? "pointer" : "not-allowed",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                }}
              >
                Next
              </button>
            </div>
          </div>
        </>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            color: "#666",
          }}
        >
          No posts found.
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <PostModal
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={async (data) => {
            await handleCreate(data as CreatePostRequestInterface);
          }}
          isLoading={createMutation.isPending}
        />
      )}

      {/* Edit Modal */}
      {editingPost && (
        <PostModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
          onSubmit={async (data) => {
            await handleUpdate(
              editingPost.id,
              data as UpdatePostRequestInterface
            );
          }}
          isLoading={updateMutation.isPending}
        />
      )}
    </div>
  );
}

// Post Modal Component
interface PostModalProps {
  post?: Post;
  onClose: () => void;
  onSubmit: (
    data: CreatePostRequestInterface | UpdatePostRequestInterface
  ) => Promise<void> | void;
  isLoading: boolean;
}

function PostModal({ post, onClose, onSubmit, isLoading }: PostModalProps) {
  const [title, setTitle] = useState(post?.title || "");
  const [body, setBody] = useState(post?.body || "");
  const [userId, setUserId] = useState(post?.userId || 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      title,
      body,
      userId,
    });
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "2rem",
          maxWidth: "500px",
          width: "90%",
          maxHeight: "90vh",
          overflow: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ margin: "0 0 1.5rem 0" }}>
          {post ? "Edit Post" : "Create Post"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
              }}
            >
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "1rem",
              }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
              }}
            >
              Body
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              rows={6}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "1rem",
                resize: "vertical",
              }}
            />
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
              }}
            >
              User ID
            </label>
            <input
              type="number"
              value={userId}
              onChange={(e) => setUserId(Number(e.target.value))}
              required
              min={1}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "1rem",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "0.75rem 1.5rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
                backgroundColor: "#fff",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: "0.75rem 1.5rem",
                border: "none",
                borderRadius: "4px",
                backgroundColor: "#1976d2",
                color: "white",
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              {isLoading ? "Saving..." : post ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
