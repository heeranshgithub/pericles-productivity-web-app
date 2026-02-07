'use client';

import { useAppSelector } from '@/store/hooks';
import { useGetDashboardStatsQuery } from '@/store/api/dashboardApi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  StickyNote,
  Timer,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { FocusTimerWidget } from '@/components/dashboard/FocusTimerWidget';
import { formatDuration } from '@/lib/utils/timer';

export default function DashboardPage() {
  const { user } = useAppSelector(state => state.auth);
  const { data: stats, isLoading } = useGetDashboardStatsQuery();

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
              {stats?.tasks.total ?? 0}
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
              {stats?.tasks.pending ?? 0}
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
              {stats?.tasks.completed ?? 0}
            </p>
          </CardContent>
        </Card>

        <FocusTimerWidget />
      </div>

      {/* Recent activity */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Notes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pt-4 px-4 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Recent Notes
            </CardTitle>
            <Link href="/dashboard/notes">
              <Button variant="ghost" size="sm" className="gap-1 h-7 text-xs">
                View All
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : stats?.notes.recent.length ? (
              <div className="space-y-3">
                {stats.notes.recent.map(note => (
                  <div
                    key={note._id}
                    className="flex items-start justify-between gap-4 p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors duration-150"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {note.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDistanceToNow(new Date(note.updatedAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    <Badge
                      variant={
                        note.type === 'private' ? 'secondary' : 'outline'
                      }
                      className="text-[10px] shrink-0"
                    >
                      {note.type}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-8 px-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted mb-3">
                  <StickyNote className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No notes yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Focus Sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pt-4 px-4 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Recent Sessions
            </CardTitle>
            <Link href="/dashboard/timer">
              <Button variant="ghost" size="sm" className="gap-1 h-7 text-xs">
                View All
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : stats?.sessions.recent.length ? (
              <div className="space-y-3">
                {stats.sessions.recent.map(session => (
                  <div
                    key={session._id}
                    className="flex items-center justify-between gap-4 p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors duration-150"
                  >
                    <div>
                      <p className="text-sm font-bold tabular-nums">
                        {formatDuration(session.duration ?? 0)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDistanceToNow(new Date(session.startTime), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    <Timer className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-8 px-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted mb-3">
                  <Timer className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  No sessions yet
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
