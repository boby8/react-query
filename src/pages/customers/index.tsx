import CustomerCard from "./components/CustomerCard";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import { useUsersQuery } from "./api/queries";

export default function CustomersPage() {
  const {
    isLoading,
    data: users,
    error,
    isError,
    isFetching,
    refetch,
  } = useUsersQuery();
  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
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

      {users && users.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {users.map((user) => (
            <CustomerCard key={user.id} user={user} />
          ))}
        </div>
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
