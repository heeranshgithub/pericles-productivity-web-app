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
import { Settings, User, Palette } from 'lucide-react';

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

  return (
    <div className="min-h-screen w-full p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account preferences
          </p>
        </div>
        <Settings className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="space-y-4">
        {/* Profile Info */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Profile
            </CardTitle>
            <User className="h-3.5 w-3.5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-4">
            <div>
              <Label className="text-xs font-medium tracking-wide">Name</Label>
              <p className="text-sm leading-relaxed mt-1">
                {profile?.name ?? '...'}
              </p>
            </div>
            <div>
              <Label className="text-xs font-medium tracking-wide">Email</Label>
              <p className="text-sm leading-relaxed mt-1">
                {profile?.email ?? '...'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Appearance
            </CardTitle>
            <Palette className="h-3.5 w-3.5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label
                  htmlFor="dark-mode"
                  className="text-sm font-medium cursor-pointer"
                >
                  Dark Mode
                </Label>
                <p className="text-xs text-muted-foreground">
                  Toggle between light and dark theme
                </p>
              </div>
              <Switch
                id="dark-mode"
                checked={theme === 'dark'}
                onCheckedChange={handleThemeToggle}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
