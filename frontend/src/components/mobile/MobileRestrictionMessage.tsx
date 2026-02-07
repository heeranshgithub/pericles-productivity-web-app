'use client';

import { Smartphone, Monitor } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { MOBILE_RESTRICTION_CONFIG } from '@/config/mobileRestriction.config';

/**
 * A friendly message component displayed to mobile users
 * indicating that the app is desktop-only for now.
 *
 * @removable - This file can be deleted when mobile support is ready.
 */
export function MobileRestrictionMessage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md border-border text-center">
        <CardHeader className="pb-4">
          <div className="flex justify-center gap-3 mb-4">
            <div className="relative">
              <Smartphone className="h-12 w-12 text-muted-foreground/50" />
              <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-amber-500 flex items-center justify-center">
                <span className="text-xs text-white font-bold">!</span>
              </div>
            </div>
            <Monitor className="h-12 w-12 text-teal-600" />
          </div>
          <CardTitle className="text-xl font-bold tracking-tight">
            Desktop Only
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-2">
            {MOBILE_RESTRICTION_CONFIG.MESSAGE}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">
              For the best experience, please visit us on a desktop or laptop
              computer.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
