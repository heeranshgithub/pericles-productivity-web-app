'use client';

import { formatDuration } from '@/lib/utils/timer';
import { SessionType } from '@/types/focus-session';
import { Card } from '@/components/ui/card';

interface TimerDisplayProps {
  elapsed: number;
  isActive: boolean;
  sessionType?: SessionType;
  targetDuration?: number | null;
  isBreak?: boolean;
}

export function TimerDisplay({
  elapsed,
  isActive,
  sessionType = SessionType.STOPWATCH,
  targetDuration,
  isBreak = false,
}: TimerDisplayProps) {
  const isPomodoro = sessionType === SessionType.POMODORO;
  const remaining = targetDuration ? Math.max(0, targetDuration - elapsed) : 0;
  const isOvertime = targetDuration ? elapsed > targetDuration : false;

  const displayTime = isPomodoro ? remaining : elapsed;

  const displayText = isPomodoro
    ? isOvertime
      ? 'Time is up!'
      : isBreak
        ? 'Break time'
        : 'Focus time'
    : isActive
      ? 'Session in progress'
      : 'No active session';

  return (
    <Card className="p-8 text-center">
      {isPomodoro && targetDuration && (
        <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {isBreak ? 'BREAK SESSION' : 'WORK SESSION'}
        </div>
      )}

      <div className="mb-4">
        <div
          className={`text-6xl font-mono font-bold tabular-nums ${
            isActive
              ? isOvertime
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-teal-600 dark:text-teal-400'
              : 'text-muted-foreground'
          }`}
        >
          {formatDuration(displayTime)}
        </div>
      </div>

      {isPomodoro && targetDuration && (
        <div className="mb-2">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-150 ${
                isOvertime ? 'bg-amber-500' : 'bg-teal-500'
              }`}
              style={{
                width: `${Math.min(100, (elapsed / targetDuration) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      <div className="text-sm text-muted-foreground">{displayText}</div>
    </Card>
  );
}
