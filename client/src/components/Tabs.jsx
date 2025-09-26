import React from "react";

export default function Tabs({ active, onChange, items }) {
  const tabs = items && items.length > 0 ? items : [
    { id: "challenge", label: "Challenge" },
    { id: "leaderboard", label: "Leaderboard" },
    { id: "hints", label: "Hints" },
  ];
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid #ccc",
            background:
              t.id === "hints"
                ? (active === t.id ? "#ff8c00" : "#ffa726")
                : (active === t.id ? "#111" : "#fafafa"),
            color:
              t.id === "hints"
                ? (active === t.id ? "#fff" : "#111")
                : (active === t.id ? "white" : "#111"),
            cursor: "pointer",
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
