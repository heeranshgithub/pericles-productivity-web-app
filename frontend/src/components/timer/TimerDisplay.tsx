'use client';

import { formatDuration } from '@/lib/utils/timer';
import { Card } from '@/components/ui/card';

interface TimerDisplayProps {
  elapsed: number;
  isActive: boolean;
}

export function TimerDisplay({ elapsed, isActive }: TimerDisplayProps) {
  return (
    <Card className="p-8 text-center">
      <div className="mb-4">
        <div
          className={`text-6xl font-mono font-bold tabular-nums ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-muted-foreground'}`}
        >
          {formatDuration(elapsed)}
        </div>
      </div>
      <div className="text-sm text-muted-foreground">
        {isActive ? 'Session in progress' : 'No active session'}
      </div>
    </Card>
  );
}
