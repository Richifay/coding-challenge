import React, { useEffect, useState } from "react";
import UsernameGate from "./components/UsernameGate.jsx";
import Tabs from "./components/Tabs.jsx";
import Challenge from "./components/Challenge.jsx";
import Leaderboard from "./components/Leaderboard.jsx";
import Timer from "./components/Timer.jsx";
import Warmup from "./components/Warmup.jsx";

export default function App() {
  const [session, setSession] = useState(null); // { username, sessionId, startTime }
  const [activeTab, setActiveTab] = useState("leaderboard");
  const [stoppedMs, setStoppedMs] = useState(null);
  const [warmupDone, setWarmupDone] = useState(false);

  // Restore existing session from localStorage on load
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("session");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.username && parsed.sessionId && parsed.startTime) {
          setSession(parsed);
          setActiveTab("challenge");
          setStoppedMs(null);
        }
      }
    } catch {}
  }, []);

  function handleStart({ username, sessionId, startTime }) {
    setSession({ username, sessionId, startTime });
    setActiveTab("challenge");
    setStoppedMs(null);
    try {
      window.localStorage.setItem(
        "session",
        JSON.stringify({ username, sessionId, startTime })
      );
    } catch {}
  }

  function handleSolved(ms) {
    clearSession();
    window.alert(`You successfully solved the TDI coding challenge in ${ms}ms. \n
      Your name should appear in the leaderboard. \n
      Please come back to the coding challenge booth at 4pm to claim your prize. \n
      Thanks for participating in the TDI coding challenge.`);
  }

  function handleLogout() {
    const code = window.prompt("Enter code to logout and clear data:");
    if (code === "cleanMe") {
      clearSession();
    }
  }

  function clearSession() {
      try {
        window.localStorage.clear();
      } catch {}
      setSession(null);
      setStoppedMs(null);
      setWarmupDone(false)
      setActiveTab("leaderboard");
  }
  

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: 16 }}>
      <h1>TDI Coding Challenge</h1>

      {!session ? (
        <div>
          {!warmupDone ? (
            <Warmup onStart={(payload) => { setWarmupDone(true); handleStart(payload); }} />
          ) : null}
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div><strong>User:</strong> {session.username}</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Timer startTime={session.startTime} stoppedMs={stoppedMs} />
            <button onClick={handleLogout} style={{ padding: "6px 10px", borderRadius: 8 }}>Logout</button>
          </div>
        </div>
      )}

      <Tabs
        active={activeTab}
        onChange={setActiveTab}
        items={
          session
            ? [
                { id: "challenge", label: "Challenge" },
                { id: "leaderboard", label: "Leaderboard" },
              ]
            : [
                { id: "leaderboard", label: "Leaderboard" },
              ]
        }
      />

      {session && activeTab === "challenge" && (
        <Challenge sessionId={session.sessionId} onSolved={handleSolved} />
      )}

      {activeTab === "leaderboard" && <Leaderboard />}
    </div>
  );
}
