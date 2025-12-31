interface ErrorStateProps {
  error: unknown;
  onRetry: () => void;
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  const errorMessage =
    error instanceof Error ? error.message : "An unknown error occurred";

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "600px",
        margin: "0 auto",
        marginTop: "4rem",
      }}
    >
      <div
        style={{
          padding: "2rem",
          backgroundColor: "#fee",
          border: "1px solid #fcc",
          borderRadius: "12px",
        }}
      >
        <h3
          style={{
            margin: "0 0 1rem 0",
            color: "#c33",
            fontSize: "1.5rem",
            fontWeight: "600",
          }}
        >
          Error loading posts
        </h3>
        <p
          style={{
            margin: "0 0 1.5rem 0",
            color: "#933",
            fontSize: "1rem",
            lineHeight: "1.5",
          }}
        >
          {errorMessage}
        </p>
        <button
          onClick={onRetry}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#c33",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "500",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#a22";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#c33";
          }}
        >
          Retry
        </button>
      </div>
    </div>
  );
}
