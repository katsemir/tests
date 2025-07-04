export const getEnv = (key: string, fallback: string = ''): string =>
  process.env[key] || fallback;
export function formatTime(hours: number, minutes: number): string {
  const h = hours.toString().padStart(2, '0');
  const m = minutes.toString().padStart(2, '0');
  return `${h}:${m}`;
}