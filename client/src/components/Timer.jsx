import React, { useEffect, useState } from "react";
import { formatMs } from "../utils/formatMs";

export default function Timer({ startTime, stoppedMs, penaltyMs = 0 }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (stoppedMs != null) return;
    const id = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(id);
  }, [stoppedMs]);

  if (!startTime) return null;
  const base = stoppedMs != null ? stoppedMs : now - startTime;
  const elapsed = base + (penaltyMs || 0);
  return <div><strong>Time:</strong> {formatMs(elapsed)}</div>;
}
