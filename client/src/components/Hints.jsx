import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api.js";


export default function Hints({ sessionId, onPenaltyChange }) {
  const [hints, setHints] = useState([]);
  const [purchased, setPurchased] = useState([]);
  const [penaltyMs, setPenaltyMs] = useState(0);
  const [error, setError] = useState(null);
  const [details, setDetails] = useState({}); // { [hintId]: { open: bool, text: string|null, loading: bool } }

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/hints`).then(r => r.json()).then(setHints).catch(() => {});
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    fetch(`${API_BASE_URL}/api/session?sessionId=${encodeURIComponent(sessionId)}`)
      .then(r => r.json())
      .then((s) => {
        if (s && typeof s.penaltyMs === 'number') setPenaltyMs(s.penaltyMs);
        if (Array.isArray(s.purchasedHints)) setPurchased(s.purchasedHints);
        if (typeof onPenaltyChange === 'function') onPenaltyChange(s.penaltyMs || 0);
      })
      .catch(() => {});
  }, [sessionId]);

  async function buyHint(h) {
    setError(null);
    if (!sessionId) return setError("You must start with a username.");
    if (h.costMin > 0){
      const ok = window.confirm(`Buy hint "${h.title}" for ${h.costMin} minute(s)? 💰`);
      if (!ok) return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/hints/buy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, hintId: h.id })
      });
      const data = await res.json();
      if (!res.ok || !data.ok) return setError(data.error || "Could not buy hint");
      setPenaltyMs(data.penaltyMs || 0);
      if (typeof onPenaltyChange === 'function') onPenaltyChange(data.penaltyMs || 0);
      if (Array.isArray(data.purchased)) setPurchased(data.purchased);
      // Automatically open the hint after purchase
      try { await toggleView(h.id); } catch {}
    } catch (e) {
      setError(e.message);
    }
  }

  async function toggleView(hintId) {
    setError(null);
    setDetails(prev => ({ ...prev, [hintId]: { ...(prev[hintId] || {}), open: !(prev[hintId]?.open) } }));
    const cur = details[hintId];
    const nowOpen = !(cur?.open);
    if (!nowOpen) return; // closing
    // if opening and not loaded, fetch
    if (!cur || !cur.text) {
      try {
        setDetails(prev => ({ ...prev, [hintId]: { ...(prev[hintId] || {}), loading: true } }));
        const res = await fetch(`${API_BASE_URL}/api/hints/${encodeURIComponent(hintId)}?sessionId=${encodeURIComponent(sessionId)}`);
        const data = await res.json();
        if (!res.ok || !data || !data.detail) return setError(data.error || "Could not load hint");
        setDetails(prev => ({ ...prev, [hintId]: { open: true, loading: false, text: data.detail, title: data.title, codePython: data.codePython || null, codeJava: data.codeJava || null } }));
      } catch (e) {
        setError(e.message);
        setDetails(prev => ({ ...prev, [hintId]: { ...(prev[hintId] || {}), loading: false } }));
      }
    }
  }

  return (
    <div>
      <h2 style={{ margin: "0 0 8px" }}>Hints</h2>
      <div style={{ marginBottom: 12, color: "#444" }}>Time Spent for Hints: <strong>{Math.floor(penaltyMs/60000)}m {Math.floor((penaltyMs%60000)/1000)}s 💸</strong></div>
      {error && (
        <div style={{ color: "crimson", marginBottom: 8 }}>{error}</div>
      )}
      <div style={{ display: "grid", gap: 10 }}>
        {hints.map(h => (
          <div key={h.id} style={{ border: "1px solid #eee", borderRadius: 8, padding: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong>{h.title}</strong>
                <div style={{ fontSize: 12, color: "#666" }}>{h.summary}</div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 12 }}></span>
                {purchased.includes(h.id) ? (
                  <button onClick={() => toggleView(h.id)} style={{ padding: "6px 10px", borderRadius: 6 }}>
                    {details[h.id]?.open ? "Hide" : "View"}
                  </button>
                ) : (
                  (h.costMin > 0) ? (
                  <button onClick={() => buyHint(h)} style={{ padding: "6px 10px", borderRadius: 6 }}>
                    Buy for {h.costMin} Min 🔒
                  </button>
                ) : (
                  <button onClick={() => buyHint(h)} style={{ padding: "6px 10px", borderRadius: 6 }}>
                    Free
                  </button>
                ))}
              </div>
            </div>
            {details[h.id]?.open && (
              <div style={{ marginTop: 8, fontSize: 14 }}>
                {details[h.id]?.loading ? "Loading..." : (
                  <div>
                    <div style={{ whiteSpace: "pre-wrap", marginBottom: 8 }}>{details[h.id]?.text || "(no detail)"}</div>
                    {(details[h.id]?.codePython || details[h.id]?.codeJava) && (
                      <div style={{ display: "grid", gap: 8 }}>
                        {details[h.id]?.codePython && (
                          <div>
                            <div style={{ fontWeight: 600, marginBottom: 4 }}>Python</div>
                            <pre style={{ background: "#f8f8f8", padding: 8, borderRadius: 6, overflowX: "auto" }}><code>{details[h.id].codePython}</code></pre>
                          </div>
                        )}
                        {details[h.id]?.codeJava && (
                          <div>
                            <div style={{ fontWeight: 600, marginBottom: 4 }}>Java</div>
                            <pre style={{ background: "#f8f8f8", padding: 8, borderRadius: 6, overflowX: "auto" }}><code>{details[h.id].codeJava}</code></pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


