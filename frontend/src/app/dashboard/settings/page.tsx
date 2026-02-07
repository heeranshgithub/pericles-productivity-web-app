'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';
import {
  useGetProfileQuery,
  useUpdatePreferencesMutation,
} from '@/store/api/userApi';
import { toast } from 'sonner';
import {
  Settings,
  User,
  Palette,
  Mail,
  Sparkles,
  Moon,
  Sun,
} from 'lucide-react';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { data: profile } = useGetProfileQuery();
  const [updatePreferences] = useUpdatePreferencesMutation();

  const handleThemeToggle = async (isDark: boolean) => {
    const newTheme = isDark ? 'dark' : 'light';
    setTheme(newTheme);

    try {
      await updatePreferences({ themePreference: newTheme }).unwrap();
      toast.success('Theme preference saved');
    } catch {
      toast.error('Failed to save preference');
    }
  };

  // Get user initials for avatar
  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen w-full p-6 lg:p-8">
      {/* Header with Gradient */}
      <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 border border-primary/10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />

        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                Settings
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your account preferences
              </p>
            </div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/50 backdrop-blur-sm border border-border/50 shadow-sm">
            <Settings className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Profile Info Card */}
        <Card className="hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 border-border/50 hover:border-primary/20">
          <CardHeader className="relative flex flex-row items-center justify-between pb-3 pt-5 px-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <User className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-sm font-semibold tracking-wide">
                Profile Information
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="relative px-6 pb-6 space-y-5">
            {/* Name Field */}
            <div className="group/item p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-border/50">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background border border-border/50 shrink-0 mt-0.5">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <Label className="text-xs font-medium tracking-wide text-muted-foreground uppercase mb-1.5 block">
                    Full Name
                  </Label>
                  <p className="text-base font-medium leading-relaxed truncate">
                    {profile?.name ?? '...'}
                  </p>
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div className="group/item p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-border/50">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background border border-border/50 shrink-0 mt-0.5">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <Label className="text-xs font-medium tracking-wide text-muted-foreground uppercase mb-1.5 block">
                    Email Address
                  </Label>
                  <p className="text-base font-medium leading-relaxed truncate">
                    {profile?.email ?? '...'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Card */}
        <Card className="hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 border-border/50 hover:border-primary/20">
          <CardHeader className="relative flex flex-row items-center justify-between pb-3 pt-5 px-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Palette className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-sm font-semibold tracking-wide">
                Appearance
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="relative px-6 pb-6">
            <div className="p-5 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-border/50">
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shrink-0">
                    {theme === 'dark' ? (
                      <Moon className="h-5 w-5 text-primary" />
                    ) : (
                      <Sun className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="dark-mode"
                      className="text-base font-semibold cursor-pointer block"
                    >
                      {theme === 'dark' ? 'Dark' : 'Light'} Mode
                    </Label>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {theme === 'dark'
                        ? 'Easier on the eyes in low light'
                        : 'Bright and clear for daytime use'}
                    </p>
                  </div>
                </div>
                <div className="shrink-0">
                  <Switch
                    id="dark-mode"
                    checked={theme === 'dark'}
                    onCheckedChange={handleThemeToggle}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Footer */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-4">
          <div className="h-1 w-1 rounded-full bg-muted-foreground/50" />
          <p>Your preferences are automatically saved</p>
          <div className="h-1 w-1 rounded-full bg-muted-foreground/50" />
        </div>
      </div>
    </div>
  );
}
