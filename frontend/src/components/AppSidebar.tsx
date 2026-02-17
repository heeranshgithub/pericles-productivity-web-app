'use client';

import { usePathname, useRouter } from 'next/navigation';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { baseApi } from '@/store/api/baseApi';
import { useEndSessionMutation } from '@/store/api/focusSessionsApi';
import { useSidebar } from '@/components/SidebarContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  CheckSquare,
  StickyNote,
  Timer,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  FileDown,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const navItems = [
  {
    label: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Tasks',
    href: '/dashboard/tasks',
    icon: CheckSquare,
  },
  {
    label: 'Notes',
    href: '/dashboard/notes',
    icon: StickyNote,
  },
  {
    label: 'Focus Timer',
    href: '/dashboard/timer',
    icon: Timer,
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
  {
    label: 'PDF Export',
    href: '/dashboard/test-pdf',
    icon: FileDown,
  },
];

export function AppSidebar() {
  const { collapsed, toggle } = useSidebar();

  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const [endSession] = useEndSessionMutation();

  const handleLogout = async () => {
    try {
      await endSession().unwrap();
    } catch {
      // Intentionally ignore errors (e.g., 404 if no active session)
      // to ensure logout proceeds regardless of timer state.
    }
    dispatch(logout());
    dispatch(baseApi.util.resetApiState());
    router.push('/auth/login');
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  // Render only the sidebar inner content so the outer <aside> can be
  // provided by the parent (server) component to keep markup stable
  // between server and client and avoid hydration mismatches.
  return (
    <>
      {/* Header */}
      <div className="flex h-14 items-center border-b border-sidebar-border px-3">
        <Link
          href="/dashboard"
          className={cn(
            'flex items-center gap-2.5 overflow-hidden',
            collapsed && 'justify-center w-full'
          )}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-teal-400/30 bg-teal-500/20 overflow-hidden">
            <Image src="/pericles.jpg" alt="Pericles" width={40} height={40} />
          </div>
          {!collapsed && (
            <span className="text-sm font-bold tracking-tight text-sidebar-foreground">
              PERICLES
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        <p
          className={cn(
            'mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/40',
            collapsed && 'sr-only'
          )}
        >
          Menu
        </p>
        {navItems.map(item => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
                  : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3 space-y-2">
        {/* User info */}
        {user && (
          <div
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2',
              collapsed && 'justify-center px-0'
            )}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold uppercase text-primary">
              {user.name?.charAt(0)}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-sidebar-foreground">
                  {user.name}
                </p>
                <p className="truncate text-[11px] text-sidebar-foreground/50">
                  {user.email}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div
          className={cn('flex items-center gap-1', collapsed ? 'flex-col' : '')}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className={cn(
              'h-9 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground',
              collapsed
                ? 'w-full justify-center px-0'
                : 'flex-1 justify-start gap-2 px-3'
            )}
            title="Log out"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="text-sm">Log out</span>}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggle}
            className="h-9 px-2 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
