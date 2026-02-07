export const POMODORO_WORK_DURATION = 25 * 60;
export const POMODORO_BREAK_DURATION = 5 * 60;

export const MIN_DURATION_SECONDS = 60;
export const MAX_DURATION_SECONDS = 240 * 60;

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function calculateElapsed(startTime: string): number {
  const start = new Date(startTime).getTime();
  const now = Date.now();
  return Math.floor((now - start) / 1000);
}
