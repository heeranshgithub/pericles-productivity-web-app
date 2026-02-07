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
import {
  useGetProfileQuery,
  useUpdateTimerPreferencesMutation,
} from '@/store/api/userApi';
import {
  SessionType,
  StartSessionParams,
} from '@/types/focus-session';
import {
  calculateElapsed,
  POMODORO_WORK_DURATION,
  POMODORO_BREAK_DURATION,
  DURATION_PRESETS,
} from '@/lib/utils/timer';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Timer, Clock, Settings } from 'lucide-react';

export default function TimerPage() {
  const [elapsed, setElapsed] = useState(0);
  const [timerMode, setTimerMode] = useState<SessionType>(SessionType.POMODORO);
  const [isBreakMode, setIsBreakMode] = useState(false);
  const [customWorkDuration, setCustomWorkDuration] = useState<number | null>(null);
  const [customBreakDuration, setCustomBreakDuration] = useState<number | null>(null);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customizingMode, setCustomizingMode] = useState<'work' | 'break'>('work');
  const [customInputValue, setCustomInputValue] = useState('');
  const [saveAsDefault, setSaveAsDefault] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const notifiedRef = useRef(false);

  const { data: currentUser } = useGetProfileQuery();
  const [updateTimerPreferences] = useUpdateTimerPreferencesMutation();

  const { data: activeSession } = useGetActiveSessionQuery(undefined, {
    pollingInterval: 10000,
  });
  const { data: sessions = [] } = useGetAllSessionsQuery();
  const [startSession, { isLoading: isStarting }] = useStartSessionMutation();
  const [endSession, { isLoading: isEnding }] = useEndSessionMutation();
  const [deleteSession] = useDeleteSessionMutation();

  const isLoading = isStarting || isEnding;

  const getWorkDuration = () => {
    if (customWorkDuration) return customWorkDuration;
    if (currentUser?.timerPreferences?.defaultWorkDuration) {
      return currentUser.timerPreferences.defaultWorkDuration;
    }
    return POMODORO_WORK_DURATION;
  };

  const getBreakDuration = () => {
    if (customBreakDuration) return customBreakDuration;
    if (currentUser?.timerPreferences?.defaultBreakDuration) {
      return currentUser.timerPreferences.defaultBreakDuration;
    }
    return POMODORO_BREAK_DURATION;
  };

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

  useEffect(() => {
    if (timerMode === SessionType.POMODORO && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, [timerMode]);

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

  const isPresetActive = (work: number, brk: number) =>
    customWorkDuration === work && customBreakDuration === brk;

  const handlePresetSelect = (work: number, brk: number) => {
    setCustomWorkDuration(work);
    setCustomBreakDuration(brk);
  };

  const handleOpenCustomModal = () => {
    const mode = isBreakMode ? 'break' : 'work';
    setCustomizingMode(mode);
    const currentDuration = mode === 'work' ? getWorkDuration() : getBreakDuration();
    setCustomInputValue(String(Math.floor(currentDuration / 60)));
    setSaveAsDefault(false);
    setShowCustomModal(true);
  };

  const handleApplyCustom = async () => {
    const minutes = parseInt(customInputValue);
    if (isNaN(minutes) || minutes < 1 || minutes > 240) {
      toast.error('Duration must be between 1 and 240 minutes');
      return;
    }

    const seconds = minutes * 60;
    if (customizingMode === 'work') {
      setCustomWorkDuration(seconds);
    } else {
      setCustomBreakDuration(seconds);
    }

    if (saveAsDefault) {
      try {
        await updateTimerPreferences({
          [customizingMode === 'work'
            ? 'defaultWorkDuration'
            : 'defaultBreakDuration']: seconds,
        }).unwrap();
        toast.success('Default duration saved!');
      } catch {
        toast.error('Failed to save default');
      }
    }

    setShowCustomModal(false);
  };

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

          {timerMode === SessionType.POMODORO && !activeSession && (
            <Card className="p-4">
              <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
                DURATION PRESETS
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePresetSelect(DURATION_PRESETS.CLASSIC.work, DURATION_PRESETS.CLASSIC.break)}
                  className={
                    isPresetActive(DURATION_PRESETS.CLASSIC.work, DURATION_PRESETS.CLASSIC.break)
                      ? 'border-teal-500 bg-teal-50 dark:bg-teal-950'
                      : ''
                  }
                >
                  Classic (25/5)
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePresetSelect(DURATION_PRESETS.EXTENDED.work, DURATION_PRESETS.EXTENDED.break)}
                  className={
                    isPresetActive(DURATION_PRESETS.EXTENDED.work, DURATION_PRESETS.EXTENDED.break)
                      ? 'border-teal-500 bg-teal-50 dark:bg-teal-950'
                      : ''
                  }
                >
                  Extended (50/10)
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePresetSelect(DURATION_PRESETS.DEEP_FOCUS.work, DURATION_PRESETS.DEEP_FOCUS.break)}
                  className={
                    isPresetActive(DURATION_PRESETS.DEEP_FOCUS.work, DURATION_PRESETS.DEEP_FOCUS.break)
                      ? 'border-teal-500 bg-teal-50 dark:bg-teal-950'
                      : ''
                  }
                >
                  Deep Focus (90/20)
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenCustomModal}
                  className="gap-2"
                >
                  <Settings className="h-3.5 w-3.5" />
                  Custom
                </Button>

                {(customWorkDuration !== null || customBreakDuration !== null) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setCustomWorkDuration(null);
                      setCustomBreakDuration(null);
                    }}
                  >
                    Reset
                  </Button>
                )}
              </div>
            </Card>
          )}

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

        <Dialog open={showCustomModal} onOpenChange={setShowCustomModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Custom {customizingMode === 'work' ? 'Work' : 'Break'} Duration
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium tracking-wide mb-2 block">
                  Duration (minutes)
                </label>
                <Input
                  type="number"
                  min={1}
                  max={240}
                  value={customInputValue}
                  onChange={e => setCustomInputValue(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Between 1 and 240 minutes
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="saveAsDefault"
                  className="w-4 h-4 accent-teal-600"
                  checked={saveAsDefault}
                  onChange={e => setSaveAsDefault(e.target.checked)}
                />
                <label htmlFor="saveAsDefault" className="text-sm cursor-pointer">
                  Save as my default {customizingMode} duration
                </label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCustomModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleApplyCustom}>Apply</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
}
