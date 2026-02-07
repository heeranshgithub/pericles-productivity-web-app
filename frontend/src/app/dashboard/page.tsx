'use client';

import { useAppSelector } from '@/store/hooks';
import { useGetTaskStatsQuery } from '@/store/api/tasksApi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  ArrowRight,
  Timer,
} from 'lucide-react';
import Link from 'next/link';
import { FocusTimerWidget } from '@/components/dashboard/FocusTimerWidget';

export default function DashboardPage() {
  const { user } = useAppSelector(state => state.auth);
  const { data: stats } = useGetTaskStatsQuery();

  return (
    <div className="min-h-screen w-full p-6 lg:p-8">
      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {user?.name}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s an overview of your productivity.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Tasks
            </CardTitle>
            <CheckSquare className="h-3.5 w-3.5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold tabular-nums">
              {stats?.total ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Pending
            </CardTitle>
            <Clock className="h-3.5 w-3.5 text-amber-500" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold tabular-nums">
              {stats?.pending ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Completed
            </CardTitle>
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold tabular-nums">
              {stats?.completed ?? 0}
            </p>
          </CardContent>
        </Card>

        <FocusTimerWidget />
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader className="pt-4 px-4 pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 flex gap-2 flex-wrap">
          <Link href="/dashboard/tasks">
            <Button variant="outline" className="gap-2">
              <CheckSquare className="h-4 w-4" />
              Go to Tasks
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard/timer">
            <Button variant="outline" className="gap-2">
              <Timer className="h-4 w-4" />
              Focus Timer
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
