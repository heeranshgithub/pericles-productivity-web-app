'use client';

import { useState, useEffect, useRef } from 'react';
import { useGetActiveSessionQuery } from '@/store/api/focusSessionsApi';
import { SessionType } from '@/types/focus-session';
import { calculateElapsed } from '@/lib/utils/timer';

/**
 * Renders nothing visible. Polls the active session and fires
 * a toast + browser Notification when a Pomodoro timer elapses,
 * regardless of which dashboard page is currently mounted.
 */
export function TimerNotificationProvider() {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const notifiedRef = useRef(false);

  const { data: activeSession } = useGetActiveSessionQuery(undefined, {
    pollingInterval: 10000,
  });

  // Request notification permission once
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Track elapsed time while a session is active
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

  // Fire notification when pomodoro target is reached
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

      if ('Notification' in window && Notification.permission === 'granted') {
        const message = activeSession.isBreak
          ? 'Break time is over! Ready to focus?'
          : 'Great work! Time for a break!';

        new Notification('Pomodoro Timer', {
          body: message,
          icon: '/pericles.jpg',
        });
      }
    }
  }, [activeSession, elapsed]);

  return null;
}
