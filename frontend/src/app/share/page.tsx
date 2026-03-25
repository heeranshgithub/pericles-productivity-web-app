import Link from "next/link";
import {
  BarChart3,
  CheckSquare,
  StickyNote,
  Timer,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function SharePage() {
  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-start justify-between gap-6 mb-10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Pericles — Shared Preview
            </h1>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              This page is intentionally unprotected (no login required). It
              gives a clean overview of what Pericles tracks. For personalized
              tasks, notes, and focus sessions, sign in.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/login" className="gap-2">
                Open Login
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Tasks
            </h2>
            <div className="mt-4 flex items-baseline gap-3">
              <p className="text-2xl font-bold tabular-nums">—</p>
              <p className="text-sm text-muted-foreground">personalized on sign-in</p>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Prioritize, complete, and keep momentum.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Notes
            </h2>
            <div className="mt-4 flex items-baseline gap-3">
              <p className="text-2xl font-bold tabular-nums">—</p>
              <p className="text-sm text-muted-foreground">public/private with encryption</p>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Capture thoughts, optionally protected.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Focus
            </h2>
            <div className="mt-4 flex items-baseline gap-3">
              <p className="text-2xl font-bold tabular-nums">—</p>
              <p className="text-sm text-muted-foreground">track sessions and stats</p>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Pomodoro and focus sessions to build streaks.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold tracking-tight mb-4">
              What you can do
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <CheckSquare className="h-4 w-4 text-teal-600 dark:text-teal-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Manage tasks</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Create tasks, mark progress, and view summaries.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <StickyNote className="h-4 w-4 text-teal-600 dark:text-teal-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Write notes</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Keep public notes and encrypted private ones.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Timer className="h-4 w-4 text-teal-600 dark:text-teal-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Run focus sessions</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Pomodoro timer with session history.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <BarChart3 className="h-4 w-4 text-teal-600 dark:text-teal-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">See insights</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Dashboard stats for tasks, notes, and focus time.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold tracking-tight mb-4">
              Sharing options
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you share this link, recipients will see the same unprotected
              preview layout. Your actual data (tasks, notes, sessions) requires
              authentication because your backend endpoints are protected.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button variant="ghost" asChild>
                <Link href="/auth/login" className="gap-2">
                  Sign in to view data
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/auth/register" className="gap-2">
                  Create an account
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Pericles • Productivity Dashboard
          </p>
        </div>
      </div>
    </div>
  );
}

