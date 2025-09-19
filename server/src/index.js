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
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

// In-memory sessions: { sessionId: { username, startTime } }
const sessions = new Map();

// Health
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Get challenge (for UI)
app.get("/api/challenge", (req, res) => {
  res.json({
    id: challenge.id,
    title: challenge.title,
    description: challenge.description,
    starterCode: challenge.starterCode,
    starterCodes: challenge.starterCodes || null,
    examples: challenge.examples || [],
  });
});

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Start session (username -> sessionId, start timer)
app.post("/api/start", (req, res) => {
  const { username } = req.body || {};
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
      sessions.set(sessionId, { username: submitted, startTime });
      return res.json({ sessionId, startTime });
    })
    .catch((err) => {
      return res.status(500).json({ error: "Server error" });
    });
});

// Run (with predefined input)
app.post("/api/run", async (req, res) => {
  const { code, language } = req.body || {};
  if (typeof code !== "string") return res.status(400).json({ error: "code required" });
  const lang = (language || "python").toLowerCase();
  let result;
  if (lang === "python") {
    result = await runUserScript(code, challenge.predefinedInput, 3000);
  } else if (lang === "java") {
    result = await runJava(code, challenge.predefinedInput, 10000);
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
  const ms = endTime - sess.startTime;

  // Persist to leaderboard
  const score = await Score.create({ username: sess.username, ms });

  // end session
  sessions.delete(sessionId);

  res.json({ ok: true, ms, scoreId: score._id });
});

// Leaderboard (top 20)
app.get("/api/leaderboard", async (req, res) => {
  const rows = await Score.find({}).sort({ ms: 1, createdAt: 1 }).limit(20).lean();
  res.json(rows.map(r => ({ username: r.username, ms: r.ms, createdAt: r.createdAt })));
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
