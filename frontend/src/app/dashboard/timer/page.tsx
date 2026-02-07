'use client';

import { useState, useEffect, useRef } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { TimerDisplay } from '@/components/timer/TimerDisplay';
import { TimerControls } from '@/components/timer/TimerControls';
import { SessionHistory } from '@/components/timer/SessionHistory';
import {
  useStartSessionMutation,
  useEndSessionMutation,
  useGetActiveSessionQuery,
  useGetAllSessionsQuery,
  useDeleteSessionMutation,
} from '@/store/api/focusSessionsApi';
import { useGetProfileQuery } from '@/store/api/userApi';
import {
  SessionType,
  StartSessionParams,
} from '@/types/focus-session';
import {
  calculateElapsed,
  POMODORO_WORK_DURATION,
  POMODORO_BREAK_DURATION,
} from '@/lib/utils/timer';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer, Clock } from 'lucide-react';

export default function TimerPage() {
  const [elapsed, setElapsed] = useState(0);
  const [timerMode, setTimerMode] = useState<SessionType>(SessionType.POMODORO);
  const [isBreakMode, setIsBreakMode] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const notifiedRef = useRef(false);

  const { data: currentUser } = useGetProfileQuery();

  const { data: activeSession } = useGetActiveSessionQuery(undefined, {
    pollingInterval: 10000,
  });
  const { data: sessions = [] } = useGetAllSessionsQuery();
  const [startSession, { isLoading: isStarting }] = useStartSessionMutation();
  const [endSession, { isLoading: isEnding }] = useEndSessionMutation();
  const [deleteSession] = useDeleteSessionMutation();

  const isLoading = isStarting || isEnding;

  const getWorkDuration = () =>
    currentUser?.timerPreferences?.defaultWorkDuration || POMODORO_WORK_DURATION;

  const getBreakDuration = () =>
    currentUser?.timerPreferences?.defaultBreakDuration || POMODORO_BREAK_DURATION;

  useEffect(() => {
    if (activeSession) {
      setElapsed(calculateElapsed(activeSession.startTime));
      notifiedRef.current = false;

      intervalRef.current = setInterval(() => {
        setElapsed(calculateElapsed(activeSession.startTime));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setElapsed(0);
      notifiedRef.current = false;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [activeSession]);

  // Request notification permission for Pomodoro mode
  useEffect(() => {
    if (timerMode === SessionType.POMODORO && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, [timerMode]);

  // Detect timer completion for Pomodoro
  useEffect(() => {
    if (
      !activeSession ||
      activeSession.sessionType !== SessionType.POMODORO ||
      !activeSession.targetDuration ||
      notifiedRef.current
    ) {
      return;
    }

    const remaining = activeSession.targetDuration - elapsed;

    if (remaining <= 0) {
      notifiedRef.current = true;

      const message = activeSession.isBreak
        ? 'Break time is over! Ready to focus?'
        : 'Great work! Time for a break!';

      toast.success(message);

      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Pomodoro Timer', {
          body: message,
          icon: '/favicon.ico',
        });
      }
    }
  }, [activeSession, elapsed]);

  const handleStart = async () => {
    try {
      const params: StartSessionParams =
        timerMode === SessionType.POMODORO
          ? {
              sessionType: SessionType.POMODORO,
              targetDuration: isBreakMode
                ? getBreakDuration()
                : getWorkDuration(),
              isBreak: isBreakMode,
            }
          : {
              sessionType: SessionType.STOPWATCH,
            };

      await startSession(params).unwrap();
      toast.success('Focus session started!');
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'data' in err
          ? (err as { data?: { message?: string } }).data?.message
          : undefined;
      toast.error(message ?? 'Failed to start session');
    }
  };

  const handleStop = async () => {
    try {
      const completed = await endSession().unwrap();
      toast.success(
        `Session completed: ${Math.floor((completed.duration ?? 0) / 60)} minutes`
      );
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'data' in err
          ? (err as { data?: { message?: string } }).data?.message
          : undefined;
      toast.error(message ?? 'Failed to end session');
    }
  };

  const handleReset = () => {
    setElapsed(0);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSession(id).unwrap();
      toast.success('Session deleted');
    } catch {
      toast.error('Failed to delete session');
    }
  };

  return (
    <ProtectedRoute>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Focus Timer</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your focus sessions with a Pomodoro timer or stopwatch
          </p>
        </div>

        <div className="space-y-8">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <Button
                  variant={timerMode === SessionType.POMODORO ? 'default' : 'outline'}
                  onClick={() => setTimerMode(SessionType.POMODORO)}
                  disabled={!!activeSession}
                  className="gap-2"
                >
                  <Timer className="h-4 w-4" />
                  Pomodoro
                </Button>
                <Button
                  variant={timerMode === SessionType.STOPWATCH ? 'default' : 'outline'}
                  onClick={() => setTimerMode(SessionType.STOPWATCH)}
                  disabled={!!activeSession}
                  className="gap-2"
                >
                  <Clock className="h-4 w-4" />
                  Stopwatch
                </Button>
              </div>

              {timerMode === SessionType.POMODORO && !activeSession && (
                <div className="flex gap-2 items-center">
                  <span className="text-xs font-medium tracking-wide text-muted-foreground">
                    Mode:
                  </span>
                  <Button
                    variant={!isBreakMode ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setIsBreakMode(false)}
                  >
                    Work ({Math.floor(getWorkDuration() / 60)}m)
                  </Button>
                  <Button
                    variant={isBreakMode ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setIsBreakMode(true)}
                  >
                    Break ({Math.floor(getBreakDuration() / 60)}m)
                  </Button>
                </div>
              )}
            </div>
          </Card>

          <TimerDisplay
            elapsed={elapsed}
            isActive={!!activeSession}
            sessionType={activeSession?.sessionType ?? timerMode}
            targetDuration={activeSession?.targetDuration}
            isBreak={activeSession?.isBreak}
          />

          <TimerControls
            isActive={!!activeSession}
            onStart={handleStart}
            onStop={handleStop}
            onReset={handleReset}
            isLoading={isLoading}
          />

          <div className="pt-8">
            <h2 className="text-lg font-semibold tracking-tight mb-4">
              Session History
            </h2>
            <SessionHistory sessions={sessions} onDelete={handleDelete} />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
