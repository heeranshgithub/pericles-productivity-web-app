export const POMODORO_WORK_DURATION = 25 * 60;
export const POMODORO_BREAK_DURATION = 5 * 60;

export const MIN_DURATION_SECONDS = 60;
export const MAX_DURATION_SECONDS = 240 * 60;

export const DURATION_PRESETS = {
  CLASSIC: { work: 25 * 60, break: 5 * 60 },
  EXTENDED: { work: 50 * 60, break: 10 * 60 },
  DEEP_FOCUS: { work: 90 * 60, break: 20 * 60 },
} as const;

export type PresetName = keyof typeof DURATION_PRESETS;

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
