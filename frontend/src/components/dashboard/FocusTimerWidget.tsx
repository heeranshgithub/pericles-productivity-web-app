'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import {
  useGetActiveSessionQuery,
  useGetSessionStatsQuery,
} from '@/store/api/focusSessionsApi';
import { calculateElapsed, formatDuration } from '@/lib/utils/timer';

export function FocusTimerWidget() {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data: activeSession } = useGetActiveSessionQuery(undefined, {
    pollingInterval: 10000,
  });
  const { data: stats } = useGetSessionStatsQuery();

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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Focus Time
        </CardTitle>
        <Timer className="h-3.5 w-3.5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {activeSession ? (
          <div>
            <p className="text-2xl font-bold tabular-nums text-teal-600 dark:text-teal-400">
              {formatDuration(elapsed)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Session in progress
            </p>
          </div>
        ) : (
          <div>
            <p className="text-2xl font-bold tabular-nums">
              {formatDuration(stats?.todayTime ?? 0)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.todaySessions ?? 0} sessions today
            </p>
          </div>
        )}
        <Link href="/dashboard/timer">
          <Button variant="outline" size="sm" className="w-full mt-3 gap-2">
            <Timer className="h-3.5 w-3.5" />
            Go to Timer
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
