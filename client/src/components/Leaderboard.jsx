import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api.js";
import { formatMs } from "../utils/formatMs";

export default function Leaderboard() {
  const [rows, setRows] = useState([]);

  async function load() {
    const res = await fetch(`${API_BASE_URL}/api/leaderboard`);
    const data = await res.json();
    setRows(data);
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2>Leaderboard</h2>
      <button onClick={load} style={{ padding: "6px 10px", borderRadius: 6, marginBottom: 8 }}>Refresh</button>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 6 }}>#</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 6 }}>Username</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 6 }}>Team</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 6 }}>Division</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 6 }}>Language</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 6 }}>Time spent for hints</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 6 }}>Total time</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 6 }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td style={{ padding: 6 }}>{i + 1}</td>
              <td style={{ padding: 6 }}>{r.username + (i + 1 === 1 ? " 🥇" : i + 1 === 2 ? " 🥈" : i + 1 === 3 ? " 🥉" : "")}</td>
              <td style={{ padding: 6 }}>{r.team || ""}</td>
              <td style={{ padding: 6 }}>{r.division || ""}</td>
              <td style={{ padding: 6 }}>{r.language || ""}</td>
              <td style={{ padding: 6 }}>{r.penaltyMs ? formatMs(r.penaltyMs) : ""}</td>
              <td style={{ padding: 6 }}>{formatMs(r.ms)}</td>
              <td style={{ padding: 6 }}>{new Date(r.createdAt).toLocaleString()}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td colSpan={8} style={{ padding: 6, color: "#777" }}>(No entries yet)</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
