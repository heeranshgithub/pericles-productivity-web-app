'use client';

import {
  CheckCircle2,
  Timer,
  ListTodo,
  StickyNote,
  BarChart3,
} from 'lucide-react';
import Image from 'next/image';

const features = [
  {
    icon: ListTodo,
    title: 'Task Management',
    description: 'Organize, prioritize, and track your tasks with ease',
  },
  {
    icon: Timer,
    title: 'Focus Timer',
    description: 'Stay productive with Pomodoro and custom focus sessions',
  },
  {
    icon: StickyNote,
    title: 'Quick Notes',
    description: 'Capture ideas and thoughts before they slip away',
  },
  {
    icon: BarChart3,
    title: 'Progress Insights',
    description: 'Visualize your productivity trends and streaks',
  },
];

export default function AuthBranding() {
  return (
    <div className="hidden lg:flex flex-col justify-between h-full bg-teal-950 dark:bg-teal-950/80 text-white p-12">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-teal-400/30 bg-teal-500/20 overflow-hidden">
            <Image src="/pericles.jpg" alt="Pericles" width={40} height={40} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Pericles</h1>
        </div>
        <p className="text-sm text-teal-300/80 tracking-wide ml-[52px]">
          Your productivity companion
        </p>
      </div>

      <div className="space-y-6">
        <p className="text-xs font-medium uppercase tracking-wider text-teal-400">
          Everything you need to stay focused
        </p>
        <div className="space-y-5">
          {features.map(feature => (
            <div key={feature.title} className="flex items-start gap-4 group">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-teal-400/20 bg-teal-500/10 transition-colors duration-150 group-hover:bg-teal-500/20">
                <feature.icon className="h-4 w-4 text-teal-300" />
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-xs text-teal-300/70 leading-relaxed mt-0.5">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-teal-300/60">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Join the vanguard of digital discipline.</span>
        </div>
        <div className="h-px bg-teal-400/10" />
        <p className="text-xs text-teal-300/40 tracking-wide">
          Built with precision. Designed for focus.
        </p>
      </div>
    </div>
  );
}
