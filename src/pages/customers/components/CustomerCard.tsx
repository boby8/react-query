import type { User } from "../api/types";

interface CustomerCardProps {
  user: User;
}

export default function CustomerCard({ user }: CustomerCardProps) {
  return (
    <div
      style={{
        padding: "1.5rem",
        border: "1px solid #e0e0e0",
        borderRadius: "12px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "1rem",
        }}
      >
        <div style={{ flex: 1 }}>
          <h3
            style={{
              margin: "0 0 0.5rem 0",
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "#1a1a1a",
            }}
          >
            {user.name}
          </h3>
          <p
            style={{
              margin: "0.25rem 0",
              color: "#666",
              fontSize: "0.9375rem",
            }}
          >
            <strong style={{ color: "#333" }}>Email:</strong> {user.email}
          </p>
          <p
            style={{
              margin: "0.25rem 0",
              color: "#666",
              fontSize: "0.9375rem",
            }}
          >
            <strong style={{ color: "#333" }}>Phone:</strong> {user.phone}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <span
            style={{
              display: "inline-block",
              padding: "0.375rem 0.875rem",
              backgroundColor: "#e3f2fd",
              color: "#1976d2",
              borderRadius: "16px",
              fontSize: "0.8125rem",
              fontWeight: "600",
            }}
          >
            #{user.id}
          </span>
        </div>
      </div>

      <div
        style={{
          paddingTop: "1rem",
          borderTop: "1px solid #f0f0f0",
        }}
      >
        <p
          style={{
            margin: "0.5rem 0",
            color: "#666",
            fontSize: "0.9375rem",
          }}
        >
          <strong style={{ color: "#333" }}>Company:</strong>{" "}
          {user.company.name}
        </p>
        <p
          style={{
            margin: "0.5rem 0",
            color: "#666",
            fontSize: "0.9375rem",
          }}
        >
          <strong style={{ color: "#333" }}>City:</strong> {user.address.city}
        </p>
        {user.website && (
          <p
            style={{
              margin: "0.5rem 0",
              color: "#666",
              fontSize: "0.9375rem",
            }}
          >
            <strong style={{ color: "#333" }}>Website:</strong>{" "}
            <a
              href={`https://${user.website}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#1976d2",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = "none";
              }}
            >
              {user.website}
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
