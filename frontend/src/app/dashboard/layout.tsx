'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, useSidebar } from '@/components/SidebarContext';
import { TimerNotificationProvider } from '@/components/dashboard/TimerNotificationProvider';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/useIsMobile';
import { MOBILE_RESTRICTION_CONFIG } from '@/config/mobileRestriction.config';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { toast } from 'sonner';

/**
 * Mobile guard component that logs out users on mobile devices.
 * Placed inside ProtectedRoute to ensure auth state is available.
 *
 * @removable - This component can be removed when mobile support is ready.
 */
function MobileGuard({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (MOBILE_RESTRICTION_CONFIG.ENABLE_MOBILE_RESTRICTION && isMobile) {
      dispatch(logout());
      toast.info(MOBILE_RESTRICTION_CONFIG.TOAST_MESSAGE);
      router.push('/auth/login');
    }
  }, [isMobile, dispatch, router]);

  // If on mobile and restriction enabled, don't render dashboard content
  if (MOBILE_RESTRICTION_CONFIG.ENABLE_MOBILE_RESTRICTION && isMobile) {
    return null;
  }

  return <>{children}</>;
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300',
          collapsed ? 'w-[68px]' : 'w-[240px]'
        )}
      >
        <AppSidebar />
      </aside>
      <main
        className={cn(
          'flex-1 transition-all duration-300',
          collapsed ? 'pl-[68px]' : 'pl-[240px]'
        )}
      >
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <TimerNotificationProvider />
        <MobileGuard>
          <DashboardShell>{children}</DashboardShell>
        </MobileGuard>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
