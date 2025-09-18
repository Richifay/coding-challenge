import React, { useEffect, useState } from "react";
import { formatMs } from "../utils/formatMs";

export default function Timer({ startTime, stoppedMs }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (stoppedMs != null) return;
    const id = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(id);
  }, [stoppedMs]);

  if (!startTime) return null;
  const elapsed = stoppedMs != null ? stoppedMs : now - startTime;
  return <div><strong>Time:</strong> {formatMs(elapsed)}</div>;
}
