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
import { calculateElapsed } from '@/lib/utils/timer';
import { toast } from 'sonner';

export default function TimerPage() {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data: activeSession } = useGetActiveSessionQuery(undefined, {
    pollingInterval: 10000,
  });
  const { data: sessions = [] } = useGetAllSessionsQuery();
  const [startSession, { isLoading: isStarting }] = useStartSessionMutation();
  const [endSession, { isLoading: isEnding }] = useEndSessionMutation();
  const [deleteSession] = useDeleteSessionMutation();

  const isLoading = isStarting || isEnding;

  useEffect(() => {
    if (activeSession) {
      setElapsed(calculateElapsed(activeSession.startTime));

      intervalRef.current = setInterval(() => {
        setElapsed(calculateElapsed(activeSession.startTime));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setElapsed(0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [activeSession]);

  const handleStart = async () => {
    try {
      await startSession().unwrap();
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
            Track your focus sessions with a Pomodoro-style timer
          </p>
        </div>

        <div className="space-y-8">
          <TimerDisplay elapsed={elapsed} isActive={!!activeSession} />

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
