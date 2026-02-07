'use client';

import { useEffect, useState } from 'react';
import { FocusSession, SessionType } from '@/types/focus-session';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDuration, calculateElapsed } from '@/lib/utils/timer';
import { Trash2, Clock, Timer } from 'lucide-react';
import { format } from 'date-fns';

interface SessionHistoryProps {
  sessions: FocusSession[];
  onDelete: (id: string) => void;
}

export function SessionHistory({ sessions, onDelete }: SessionHistoryProps) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const hasActive = sessions.some(s => s.isActive);
    if (!hasActive) return;

    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [sessions]);

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 px-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
          <Clock className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-sm font-medium mb-1">No sessions yet</h3>
        <p className="text-sm text-muted-foreground text-center">
          Start a focus session to see your history here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.map(session => {
        const isPomodoro = session.sessionType === SessionType.POMODORO;

        return (
          <Card key={session._id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                {isPomodoro ? (
                  <Timer className="h-4 w-4 text-teal-600 shrink-0" />
                ) : (
                  <Clock className="h-4 w-4 text-teal-600 shrink-0" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant={isPomodoro ? 'default' : 'secondary'}
                    >
                      {isPomodoro ? 'Pomodoro' : 'Stopwatch'}
                    </Badge>

                    {isPomodoro && (
                      <Badge variant={session.isBreak ? 'outline' : 'default'}>
                        {session.isBreak ? 'Break' : 'Work'}
                      </Badge>
                    )}

                    {session.isActive && (
                      <Badge variant="default" className="bg-teal-600">
                        Active
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {format(new Date(session.startTime), 'PPp')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="font-bold tabular-nums">
                    {formatDuration(
                      session.isActive
                        ? calculateElapsed(session.startTime)
                        : session.duration ?? 0
                    )}
                  </span>

                  {isPomodoro && session.targetDuration && (
                    <p className="text-xs text-muted-foreground">
                      Target: {Math.floor(session.targetDuration / 60)}m
                    </p>
                  )}
                </div>

                {!session.isActive && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(session._id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
