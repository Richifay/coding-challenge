import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { API_BASE_URL } from "../config/api.js";

export default function Challenge({ sessionId, onSolved }) {
  const [meta, setMeta] = useState(null);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/challenge`).then(r => r.json()).then((c) => {
      setMeta(c);
      const key = `code:${c.id || "default"}`;
      const saved = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
      setCode(saved != null ? saved : (c.starterCode || ""));
    });
  }, []);

  // Persist code to localStorage using challenge id as key
  useEffect(() => {
    if (!meta) return;
    const key = `code:${meta.id || "default"}`;
    try {
      window.localStorage.setItem(key, code || "");
    } catch {}
  }, [code, meta]);

  async function run() {
    setRunning(true); setError(null); setOutput("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      console.log(data);
      if (data.timedOut) return setOutput("⏱️ Timeout");
      if (data.code !== 0) setOutput((data.stderr || data.stdout || "Error"));
      else setOutput((data.stdout || ""));
    } catch (e) {
      setError(e.message);
    } finally {
      setRunning(false);
    }
  }

  async function submit() {
    if (!sessionId) return setError("You must start with a username.");
    setRunning(true); setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, code }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.message || "Wrong answer");
      } else {
        // success: clear screen & notify parent
        try {
          if (meta) {
            const key = `code:${meta.id || "default"}`;
            window.localStorage.removeItem(key);
          }
        } catch {}
        setCode("");
        setOutput("");
        onSolved(data.ms);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setRunning(false);
    }
  }

  if (!meta) return <div>Loading challenge...</div>;

  return (
    <div>
      <h2 style={{ margin: "8px 0" }}>{meta.title}</h2>
      <p style={{ margin: "8px 0 16px", whiteSpace: "pre-line" }}>{meta.description}</p>

      {Array.isArray(meta.examples) && meta.examples.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginBottom: 16 }}>
          {meta.examples.slice(0, 2).map((ex, idx) => (
            <div key={idx} style={{ border: "1px solid #eee", borderRadius: 8, padding: 8 }}>
              <div style={{ marginBottom: 8 }}><strong>Example input:</strong> {ex.input}</div>
              {ex.image && (
                <img src={ex.image} alt={`example-${idx + 1}`} style={{ width: "200px", height: "auto", borderRadius: 6 }} />
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ border: "1px solid #ddd", borderRadius: 8, overflow: "hidden", marginBottom: 8 }}>
        <Editor height="500px" defaultLanguage="python" value={code} onChange={setCode} options={{ fontSize: 14 }} />
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <button onClick={run} disabled={running} style={{ padding: "8px 12px", borderRadius: 8 }}>Run</button>
        <button onClick={submit} disabled={running} style={{ padding: "8px 12px", borderRadius: 8 }}>Submit</button>
      </div>

      <div style={{ border: "1px solid #eee", borderRadius: 8, padding: 8, minHeight: 80, background: "#fafafa" }}>
        <p style={{ whiteSpace: "pre-wrap", fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" }}>
          {output || "(no output)"}
        </p>
      </div>

      {error && (
        <div style={{ color: "crimson", marginTop: 8 }}>
          <strong>Error:</strong>
            {error}
        </div>
      )}
    </div>
  );
}
