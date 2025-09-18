export function formatMs(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  const msPart = ms % 1000;
  return `${m}:${String(sec).padStart(2, "0")}.${String(msPart).padStart(3, "0")}`;
}
