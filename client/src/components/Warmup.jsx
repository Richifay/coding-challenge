import React, { useMemo, useState } from "react";
import { API_BASE_URL } from "../config/api.js";

export default function Warmup({ onStart }) {
  const questions = useMemo(() => (
    [
      {
        q: "What does DNS stand for?",
        a: ["Do Not Search", "Domain Name System", "Digital Nerd Service"],
        correct: 1,
      },
      {
        q: "What is the main purpose of a firewall in networking?",
        a: [
          "To keep the office warm during winter",
          "To block unauthorized access to/from a network",
          "To roast slow computers with judgmental heat",
        ],
        correct: 1,
      },
      {
        q: "What is the shortcut for copying text in most operating systems?",
        a: ["Ctrl + C", "Ctrl + Cry", "Ctrl + Regret"],
        correct: 0,
      },
      {
        q: "What does the \"ping\" command do?",
        a: [
          "Sends a packet to check if a device is reachable",
          "Pings your boss to see if they're mad",
          "Locates your favorite memes in the network",
        ],
        correct: 0,
      },
      {
        q: "What is two-factor authentication (2FA)?",
        a: [
          "Logging in with your password twice to confuse hackers",
          "Using two different methods to verify your identity",
          "Typing really fast so no one can see your password",
        ],
        correct: 1,
      },
      {
        q: "What does \"sudo\" do in Linux?",
        a: [
          "Summons superpowers from the terminal",
          "Starts a game of Sudoku",
          "Politely asks the system to crash",
        ],
        correct: 0,
      },
      {
        q: "What is an IP address used for?",
        a: [
          "To track how much coffee an IT person drinks",
          "To uniquely identify a device on a network",
          "To unlock hidden Netflix categories",
        ],
        correct: 1,
      },
      {
        q: "What’s the difference between RAM and ROM?",
        a: [
          "RAM forgets everything, ROM never forgives",
          "RAM is for texting, ROM is for calling",
          "RAM is temporary gossip, ROM is ancient wisdom",
        ],
        correct: 0,
      },
      {
        q: "Why should you avoid using “admin” as a default username?",
        a: [
          "It confuses the hackers (in a bad way)",
          "It’s too common and a security risk",
          "Because “admin” is copyrighted by villains",
        ],
        correct: 1,
      },
      {
        q: "What is Git primarily used for?",
        a: [
          "Managing source code and version control",
          "Arguing with teammates over merge conflicts",
          "Tracking the number of bugs you've ignored",
        ],
        correct: 0,
      },
    ]
  ), []);

  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [username, setUsername] = useState("");
  const [division, setDivision] = useState("");
  const [team, setTeam] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [ready, setReady] = useState(false);
  // mark warmup completion across reloads
  React.useEffect(() => {
    try {
      const done = window.localStorage.getItem("warmup_done");
      if (done === "1") {
        setStarted(true);
        setReady(true);
      }
    } catch {}
  }, []);

  function handleStartWarmup() {
    setStarted(true);
  }

  function handleSkipWarmup() {
    try { window.localStorage.setItem("warmup_done", "1"); } catch {}
    setStarted(true);
    setReady(true);
    try { window.scrollTo({ top: 0 }); } catch {}
  }

  function selectAnswer(idx, choice) {
    const next = answers.slice();
    next[idx] = choice;
    setAnswers(next);
  }

  const allAnswered = answers.every((v) => v !== null);

  async function handleSubmitWarmup(e) {
    e.preventDefault();
    setError(null);
    if (!allAnswered) {
      return setError("Please answer all questions.");
    }
    try { window.localStorage.setItem("warmup_quiz", JSON.stringify({ answers })); } catch {}
    try { window.localStorage.setItem("warmup_done", "1"); } catch {}
    
    setReady(true);
    try { window.scrollTo({ top: 0}); } catch {}
  }

  async function handleBeginRealChallenge() {
    setError(null);
    const u = (username || "").trim();
    if (!u) return setError("Please enter your email.");
    // Accept any valid email format
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(u);
    if (!isValidEmail) return setError("Please enter a valid email");
    setBusy(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u, team: team || null, division: division || null })
      });
      const data = await res.json();
      if (!res.ok || !data || !data.sessionId) {
        throw new Error(data?.error || "Failed to start session");
      }
      try { window.localStorage.setItem("user", u); } catch {}
      if (typeof onStart === "function") {
        onStart({ username: u, sessionId: data.sessionId, startTime: data.startTime });
      }
    } catch (err) {
      setError(String(err.message || err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ border: "1px solid #eee", borderRadius: 8, padding: 16, marginBottom: 16 }}>
      <h2 style={{ marginTop: 0 }}>Warm‑up</h2>
      {!started ? (
        <div>
          <p>Ready to warm up before the real challenge? 😎</p>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleStartWarmup} style={{ padding: "8px 12px", borderRadius: 8, cursor: "pointer" }}>
              Start Warm‑up (Recommended)
            </button>
            <button onClick={handleSkipWarmup} style={{ padding: "8px 12px", borderRadius: 8, cursor: "pointer", background: "#f5f5f5", border: "1px solid #ddd" }}>
              Skip warm‑up, I've already did a workout this morning
            </button>
          </div>
        </div>
      ) : !ready ? (
        <form onSubmit={handleSubmitWarmup}>
          <div style={{ display: "grid", gap: 12 }}>
            {questions.map((item, idx) => (
              <div key={idx} style={{ padding: 8, border: "1px solid #eee", borderRadius: 8 }}>
                <div style={{ marginBottom: 6 }}><strong>Q{idx + 1}.</strong> {item.q}</div>
                <div style={{ display: "grid", gap: 6 }}>
                  {item.a.map((label, optIdx) => (
                    <label key={optIdx} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                      <input
                        type="radio"
                        name={`q_${idx}`}
                        checked={answers[idx] === optIdx}
                        onChange={() => selectAnswer(idx, optIdx)}
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {error && <div style={{ color: "#b00020", marginTop: 8 }}>{error}</div>}
          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button disabled={busy} type="submit" style={{ padding: "8px 12px", borderRadius: 8, cursor: "pointer" }}>
              {busy ? "Saving..." : "Submit"}
            </button>
          </div>
        </form>
      ) : (
        <div>
          <p><strong>Now you are warmed up 🔥. Ready to start the real challenge?</strong></p>
          <div style={{ marginTop: 12 }}>
            <label style={{ display: "block", marginBottom: 6 }}>Enter your Email:</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your Email"
              validateEmail
              style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ddd" }}
            />
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
            <div style={{ flex: 1, marginRight: 16 }}>
              <label style={{ display: "block", marginBottom: 6 }}>Division (optional):</label>
              <input
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ddd" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: 6 }}>Team (optional):</label>
              <input
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ddd" }}
              />
            </div>
          </div>
          {error && <div style={{ color: "#b00020", marginTop: 8 }}>{error}</div>}
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button disabled={busy} onClick={handleBeginRealChallenge} style={{ padding: "8px 12px", borderRadius: 8, cursor: "pointer" }}>
              {busy ? "Starting..." : "Start Challenge"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


