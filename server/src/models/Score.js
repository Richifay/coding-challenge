import mongoose from "mongoose";

const ScoreSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    ms: { type: Number, required: true },
  },
  { timestamps: true }
);

// Case-insensitive unique index on username for fast checks (best-effort)
try {
  ScoreSchema.index({ username: 1 }, { unique: true, collation: { locale: "en", strength: 2 } });
} catch {}

export const Score = mongoose.model("Score", ScoreSchema);
