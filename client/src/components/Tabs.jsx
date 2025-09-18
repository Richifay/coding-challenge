import React from "react";

export default function Tabs({ active, onChange, items }) {
  const tabs = items && items.length > 0 ? items : [
    { id: "challenge", label: "Challenge" },
    { id: "leaderboard", label: "Leaderboard" },
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
            background: active === t.id ? "#111" : "#fafafa",
            color: active === t.id ? "white" : "#111",
            cursor: "pointer",
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
