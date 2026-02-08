'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginMutation } from '@/store/api/authApi';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';
import AuthBranding from '@/components/auth/AuthBranding';
import { useIsMobile } from '@/hooks/useIsMobile';
import { MobileRestrictionMessage } from '@/components/mobile/MobileRestrictionMessage';
import { MOBILE_RESTRICTION_CONFIG } from '@/config/mobileRestriction.config';

const DEMO_EMAIL = process.env.NEXT_PUBLIC_DEMO_ACCOUNT_EMAIL;
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_ACCOUNT_PASSWORD;

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const isMobile = useIsMobile();

  // Show mobile restriction message on mobile devices
  if (MOBILE_RESTRICTION_CONFIG.ENABLE_MOBILE_RESTRICTION && isMobile) {
    return <MobileRestrictionMessage />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await login({ email, password }).unwrap();

      dispatch(
        setCredentials({
          user: result.user,
          token: result.access_token,
        })
      );

      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || 'Login failed');
    }
  };

  const handleDemoLogin = async () => {
    if (!DEMO_EMAIL || !DEMO_PASSWORD) return;
    setIsDemoLoading(true);
    try {
      const result = await login({
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      }).unwrap();
      dispatch(
        setCredentials({ user: result.user, token: result.access_token })
      );
      toast.success('Welcome to the demo!');
      router.push('/dashboard');
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || 'Demo login failed');
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <AuthBranding />

      <div className="flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md border-border">
          <CardHeader>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Sign in to your Pericles account
            </CardDescription>
          </CardHeader>
          {DEMO_EMAIL && DEMO_PASSWORD && (
            <CardContent className="pb-0">
              <Button
                type="button"
                className="w-full h-12 text-sm font-semibold tracking-wide bg-teal-600 hover:bg-teal-700 text-white transition-colors duration-150"
                disabled={isDemoLoading || isLoading}
                onClick={handleDemoLogin}
              >
                {isDemoLoading
                  ? 'Loading demo...'
                  : 'Try Demo — No signup required'}
              </Button>
              <div className="relative w-full mt-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-2 text-muted-foreground uppercase tracking-wider">
                    or sign in
                  </span>
                </div>
              </div>
            </CardContent>
          )}
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-xs font-medium tracking-wide"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-xs font-medium tracking-wide"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full mt-2"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link
                  href="/auth/register"
                  className="text-teal-600 hover:underline"
                >
                  Register
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
