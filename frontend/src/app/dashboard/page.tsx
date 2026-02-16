'use client';

import { useRef } from 'react';
import { useAppSelector } from '@/store/hooks';
import { useGetDashboardStatsQuery } from '@/store/api/dashboardApi';
import { useExportPdfMutation } from '@/store/api/notesApi';
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
  FileDown,
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { FocusTimerWidget } from '@/components/dashboard/FocusTimerWidget';
import { formatDuration } from '@/lib/utils/timer';

export default function DashboardPage() {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const { user } = useAppSelector(state => state.auth);
  const { data: stats, isLoading } = useGetDashboardStatsQuery();
  const [exportPdf, { isLoading: isExporting }] = useExportPdfMutation();

  const handleExportPdf = async () => {
    if (!dashboardRef.current) return;

    try {
      const clone = dashboardRef.current.cloneNode(true) as HTMLElement;

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600;700&display=swap');
            body { 
              font-family: 'Geist Mono', monospace; 
              background: white;
              color: black;
            }
          </style>
        </head>
        <body>
          ${clone.outerHTML}
        </body>
        </html>
      `;

      const blob = await exportPdf({
        htmlContent,
        filename: 'dashboard-report.pdf',
      }).unwrap();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'dashboard-report.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export PDF:', error);
    }
  };

  return (
    <div className="min-h-screen w-full p-6 lg:p-8">
      {/* Welcome header with PDF button */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {user?.name}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s an overview of your productivity.
          </p>
        </div>

        <Button
          onClick={handleExportPdf}
          disabled={isExporting || isLoading}
          className="gap-2"
          variant="outline"
        >
          <FileDown className="h-4 w-4" />
          {isExporting ? 'Generating...' : 'Get PDF'}
        </Button>
      </div>

      {/* Wrap content in ref for PDF capture */}
      <div ref={dashboardRef}>
        {/* Stats cards */}
        <div className="grid gap-4 sm:grid-cols-2 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Tasks
              </CardTitle>
              <Link href="/dashboard/tasks">
                <Button variant="ghost" size="sm" className="gap-1 h-7 text-xs">
                  View All
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="flex items-center gap-4 mb-3">
                <Link
                  href="/dashboard/tasks?filter=all"
                  className="flex-1 flex items-center gap-2 p-2 rounded-lg border border-border hover:bg-accent/50 transition-colors duration-150"
                >
                  <CheckSquare className="h-3.5 w-3.5 text-muted-foreground" />
                  <div>
                    <p className="text-lg font-bold tabular-nums">
                      {stats?.tasks.total ?? 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                </Link>
                <Link
                  href="/dashboard/tasks?filter=pending"
                  className="flex-1 flex items-center gap-2 p-2 rounded-lg border border-border hover:bg-accent/50 transition-colors duration-150"
                >
                  <Clock className="h-3.5 w-3.5 text-amber-500" />
                  <div>
                    <p className="text-lg font-bold tabular-nums">
                      {stats?.tasks.pending ?? 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </Link>
                <Link
                  href="/dashboard/tasks?filter=completed"
                  className="flex-1 flex items-center gap-2 p-2 rounded-lg border border-border hover:bg-accent/50 transition-colors duration-150"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <div>
                    <p className="text-lg font-bold tabular-nums">
                      {stats?.tasks.completed ?? 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                </Link>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-150"
                  style={{
                    width: `${stats && stats.tasks.total > 0 ? Math.round((stats.tasks.completed / stats.tasks.total) * 100) : 0}%`,
                  }}
                />
              </div>
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
                    <Link
                      key={note._id}
                      href={`/dashboard/notes?open=${note._id}`}
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
                    </Link>
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
    </div>
  );
}
