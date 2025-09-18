import React, { useEffect, useState } from "react";

export default function UsernameGate({ onStart }) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load saved username (if any) on mount
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("user");
      if (saved) setUsername(saved);
    } catch {}
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const u = username.trim();
    if (!u) return setError("Username required");
    try {
      window.localStorage.setItem("user", u);
    } catch {}
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start");
      onStart({ username: u, sessionId: data.sessionId, startTime: data.startTime });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <input
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ padding: 8, borderRadius: 8, border: "1px solid #ccc", minWidth: 240 }}
      />
      <button type="submit" disabled={loading} style={{ padding: "8px 12px", borderRadius: 8 }}>
        {loading ? "Starting..." : "Start"}
      </button>
      {error && <span style={{ color: "crimson" }}>{error}</span>}
    </form>
  );
}
