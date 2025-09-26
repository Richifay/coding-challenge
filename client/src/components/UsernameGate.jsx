import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api.js";

export default function UsernameGate({ onStart }) {
  const [username, setUsername] = useState("");
  const [team, setTeam] = useState("");
  const [division, setDivision] = useState("");
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
    try { window.localStorage.setItem("user", u); } catch {}
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u, team: (team || undefined), division: (division || undefined) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start");
      onStart({ username: u, sessionId: data.sessionId, startTime: data.startTime, team: (team || undefined), division: (division || undefined) });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8, alignItems: "center", gridTemplateColumns: "1fr 1fr 1fr auto" }}>
      <input placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} style={{ padding: 8, borderRadius: 8, border: "1px solid #ccc" }} />
      <input placeholder="Team (optional)" value={team} onChange={(e) => setTeam(e.target.value)} style={{ padding: 8, borderRadius: 8, border: "1px solid #ccc" }} />
      <input placeholder="Division (optional)" value={division} onChange={(e) => setDivision(e.target.value)} style={{ padding: 8, borderRadius: 8, border: "1px solid #ccc" }} />
      <button type="submit" disabled={loading} style={{ padding: "8px 12px", borderRadius: 8 }}>
        {loading ? "Starting..." : "Start"}
      </button>
      {error && <span style={{ color: "crimson" }}>{error}</span>}
    </form>
  );
}
