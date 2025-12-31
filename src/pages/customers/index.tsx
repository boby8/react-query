import { useState, useMemo } from "react";
import { useUsersQuery } from "./api/queries";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";

const ITEMS_PER_PAGE = 5;

export default function CustomersPage() {
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all users (JSONPlaceholder doesn't support pagination params)
  const {
    isLoading,
    data: allUsers,
    error,
    isError,
    isFetching,
    refetch,
  } = useUsersQuery({});

  // Client-side pagination
  const paginatedUsers = useMemo(() => {
    if (!allUsers) return [];
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return allUsers.slice(startIndex, endIndex);
  }, [allUsers, currentPage]);

  const totalUsers = allUsers?.length || 0;
  const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

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
          Customers
        </h1>
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
      </div>

      {paginatedUsers && paginatedUsers.length > 0 ? (
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
                    Name
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
                    Email
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
                    Phone
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
                    Company
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
                    City
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
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
                      {user.id}
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        color: "#333",
                        fontSize: "0.9375rem",
                        fontWeight: "500",
                      }}
                    >
                      {user.name}
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        color: "#666",
                        fontSize: "0.9375rem",
                      }}
                    >
                      {user.email}
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        color: "#666",
                        fontSize: "0.9375rem",
                      }}
                    >
                      {user.phone}
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        color: "#666",
                        fontSize: "0.9375rem",
                      }}
                    >
                      {user.company.name}
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        color: "#666",
                        fontSize: "0.9375rem",
                      }}
                    >
                      {user.address.city}
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
              {Math.min(currentPage * ITEMS_PER_PAGE, totalUsers)} of{" "}
              {totalUsers} customers
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
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (hasPrevPage) {
                    e.currentTarget.style.backgroundColor = "#f0f0f0";
                    e.currentTarget.style.borderColor = "#bbb";
                  }
                }}
                onMouseLeave={(e) => {
                  if (hasPrevPage) {
                    e.currentTarget.style.backgroundColor = "#fff";
                    e.currentTarget.style.borderColor = "#ddd";
                  }
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
                        fontWeight: currentPage === pageNum ? "600" : "400",
                        transition: "all 0.2s",
                        minWidth: "2.5rem",
                      }}
                      onMouseEnter={(e) => {
                        if (currentPage !== pageNum) {
                          e.currentTarget.style.backgroundColor = "#f0f0f0";
                          e.currentTarget.style.borderColor = "#bbb";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentPage !== pageNum) {
                          e.currentTarget.style.backgroundColor = "#fff";
                          e.currentTarget.style.borderColor = "#ddd";
                        }
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
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (hasNextPage) {
                    e.currentTarget.style.backgroundColor = "#f0f0f0";
                    e.currentTarget.style.borderColor = "#bbb";
                  }
                }}
                onMouseLeave={(e) => {
                  if (hasNextPage) {
                    e.currentTarget.style.backgroundColor = "#fff";
                    e.currentTarget.style.borderColor = "#ddd";
                  }
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
          No customers found.
        </div>
      )}
    </div>
  );
}
