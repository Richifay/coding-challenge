import React, { useEffect, useState } from "react";
import { formatMs } from "../utils/formatMs";

export default function Leaderboard() {
  const [rows, setRows] = useState([]);

  async function load() {
    const res = await fetch("http://localhost:4000/api/leaderboard");
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
            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 6 }}>Time</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 6 }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td style={{ padding: 6 }}>{i + 1}</td>
              <td style={{ padding: 6 }}>{r.username}</td>
              <td style={{ padding: 6 }}>{formatMs(r.ms)}</td>
              <td style={{ padding: 6 }}>{new Date(r.createdAt).toLocaleString()}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td colSpan={4} style={{ padding: 6, color: "#777" }}>(No entries yet)</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
