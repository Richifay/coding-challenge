import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import { Score } from "./models/Score.js";
import { challenge } from "./challenge.js";
import { runUserScript, runHiddenTests } from "./pythonRunner.js";
import { runJava, runJavaHiddenTests } from "./javaRunner.js";
import { nanoid } from "nanoid";

const app = express();
app.use(express.json({ limit: "200kb" }));

// Flexible CORS: allow exact origins from env and Cloud Run client patterns
const allowOrigins = new Set();
if (process.env.CLIENT_ORIGIN) allowOrigins.add(process.env.CLIENT_ORIGIN);
if (process.env.CLIENT_ORIGINS) {
  for (const o of process.env.CLIENT_ORIGINS.split(",")) {
    const trimmed = o.trim();
    if (trimmed) allowOrigins.add(trimmed);
  }
}

const cloudRunClientRegex = /^https:\/\/coding-challenge-client-[a-z0-9\-]+\.[a-z0-9\-]+\.run\.app$/i;

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // non-browser or same-origin
      if (allowOrigins.has(origin)) return cb(null, true);
      if (cloudRunClientRegex.test(origin)) return cb(null, true);
      return cb(null, false);
    },
    credentials: true,
  })
);

// In-memory sessions: { sessionId: { username, startTime, penaltyMs, purchasedHints:Set } }
const sessions = new Map();

// Health
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Get challenge (for UI)
app.get("/api/challenge", (req, res) => {
  res.json({
    id: challenge.id,
    title: challenge.title,
    description: challenge.description,
    goal: challenge.goal,
    input: challenge.input,
    output: challenge.output,
    starterCodes: challenge.starterCodes || null,
    examples: challenge.examples || [],
    hintItems: (challenge.hintItems || []).map(h => ({ id: h.id, title: h.title, summary: h.summary, costMin: h.costMin })),
  });
});

// Hints endpoints
app.get("/api/hints", (req, res) => {
  const list = (challenge.hintItems || []).map(h => ({ id: h.id, title: h.title, summary: h.summary, costMin: h.costMin }));
  res.json(list);
});

app.post("/api/hints/buy", (req, res) => {
  const { sessionId, hintId } = req.body || {};
  if (!sessionId || !hintId) return res.status(400).json({ error: "sessionId and hintId required" });
  const sess = sessions.get(sessionId);
  if (!sess) return res.status(400).json({ error: "Invalid session" });
  const item = (challenge.hintItems || []).find(h => h.id === hintId);
  if (!item) return res.status(404).json({ error: "Hint not found" });
  if (!sess.purchasedHints) sess.purchasedHints = new Set();
  if (!sess.purchasedHints.has(hintId)) {
    const addMs = (item.costMin || 0) * 60000;
    sess.penaltyMs = (sess.penaltyMs || 0) + addMs;
    sess.purchasedHints.add(hintId);
  }
  res.json({ ok: true, penaltyMs: sess.penaltyMs || 0, purchased: Array.from(sess.purchasedHints) });
});

app.get("/api/hints/:hintId", (req, res) => {
  const { sessionId } = req.query || {};
  const { hintId } = req.params || {};
  if (!sessionId) return res.status(400).json({ error: "sessionId required" });
  const sess = sessions.get(sessionId);
  if (!sess) return res.status(400).json({ error: "Invalid session" });
  if (!sess.purchasedHints || !sess.purchasedHints.has(hintId)) return res.status(403).json({ error: "Hint not purchased" });
  const item = (challenge.hintItems || []).find(h => h.id === hintId);
  if (!item) return res.status(404).json({ error: "Hint not found" });
  res.json({ id: item.id, title: item.title, detail: item.detail, costMin: item.costMin, codePython: item.python || null, codeJava: item.java || null });
});

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Start session (username -> sessionId, start timer)
app.post("/api/start", (req, res) => {
  const { username, team, division } = req.body || {};
  if (!username || !String(username).trim()) {
    return res.status(400).json({ error: "Username required" });
  }
  const submitted = String(username).trim();
  const submittedLower = submitted.toLowerCase();

  // Reject if username already has an active session (case-insensitive)
  for (const [, sess] of sessions) {
    if ((sess.username || "").toLowerCase() === submittedLower) {
      return res.status(400).json({ error: "Username already taken" });
    }
  }

  // Reject if username already exists in leaderboard (case-insensitive)
  const pattern = new RegExp(`^${escapeRegex(submitted)}$`, "i");
  Score.findOne({ username: pattern })
    .then((existing) => {
      if (existing) {
        return res.status(400).json({ error: "Username already taken" });
      }
      const sessionId = nanoid(12);
      const startTime = Date.now();
      sessions.set(sessionId, { username: submitted, startTime, penaltyMs: 0, purchasedHints: new Set(), team: (team || null), division: (division || null) });
      return res.json({ sessionId, startTime });
    })
    .catch((err) => {
      return res.status(500).json({ error: "Server error" });
    });
});

// Session info (penalty and purchased hints)
app.get("/api/session", (req, res) => {
  const { sessionId } = req.query || {};
  if (!sessionId) return res.status(400).json({ error: "sessionId required" });
  const sess = sessions.get(sessionId);
  if (!sess) return res.status(400).json({ error: "Invalid session" });
  res.json({ penaltyMs: sess.penaltyMs || 0, purchasedHints: Array.from(sess.purchasedHints || []) });
});

// Run (with predefined input)
app.post("/api/run", async (req, res) => {
  const { code, language, input } = req.body || {};
  if (typeof code !== "string") return res.status(400).json({ error: "code required" });
  const lang = (language || "python").toLowerCase();
  const inputStr = typeof input === "string" && input.length > 0
    ? (input.endsWith("\n") ? input : input + "\n")
    : "";
  let result;
  if (lang === "python") {
    result = await runUserScript(code, inputStr, 3000);
  } else if (lang === "java") {
    result = await runJava(code, inputStr, 10000);
  } else {
    return res.status(400).json({ error: "language not supported" });
  }
  res.json(result);
});

// Submit (run hidden tests)
app.post("/api/submit", async (req, res) => {
  const { sessionId, code, language } = req.body || {};
  if (!sessionId || typeof code !== "string") return res.status(400).json({ error: "sessionId and code required" });
  const sess = sessions.get(sessionId);
  if (!sess) return res.status(400).json({ error: "Invalid session. Start again." });

  const lang = (language || "python").toLowerCase();
  let verdict;
  if (lang === "python") {
    verdict = await runHiddenTests(code, challenge.tests, 3000);
  } else if (lang === "java") {
    verdict = await runJavaHiddenTests(code, challenge.tests, 10000);
  } else {
    return res.status(400).json({ ok: false, message: "language not supported" });
  }
  if (!verdict.ok) {
    return res.status(200).json({ ok: false, message: verdict.message });
  }

  const endTime = Date.now();
  const base = endTime - sess.startTime;
  const ms = base + (sess.penaltyMs || 0);

  // Persist to leaderboard with extra fields
  const score = await Score.create({
    username: sess.username,
    ms,
    team: sess.team || null,
    division: sess.division || null,
    language: lang,
    penaltyMs: sess.penaltyMs || 0,
  });

  // end session
  sessions.delete(sessionId);

  res.json({ ok: true, ms, scoreId: score._id });
});

// Leaderboard (top 20)
app.get("/api/leaderboard", async (req, res) => {
  const rows = await Score.find({}).sort({ ms: 1, createdAt: 1 }).lean();
  res.json(rows.map(r => ({
    username: r.username,
    team: r.team || null,
    division: r.division || null,
    language: r.language || null,
    penaltyMs: r.penaltyMs || 0,
    ms: r.ms,
    createdAt: r.createdAt,
  })));
});

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

const start = async () => {
  if (!MONGODB_URI) throw new Error("MONGODB_URI missing in .env");
  console.log("Connecting to MongoDB...");
  try {
    await connectDB(MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
  console.log(`Starting server on port ${PORT}...`);
  app.listen(PORT, "0.0.0.0", () => console.log(`Server running on :${PORT}`));
};

start();
