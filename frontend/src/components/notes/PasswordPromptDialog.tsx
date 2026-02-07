'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useVerifyPasswordMutation } from '@/store/api/authApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Lock, AlertCircle } from 'lucide-react';

interface PasswordPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const DEMO_EMAIL = process.env.NEXT_PUBLIC_DEMO_ACCOUNT_EMAIL;
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_ACCOUNT_PASSWORD;

export function PasswordPromptDialog({
  open,
  onOpenChange,
  onSuccess,
}: PasswordPromptDialogProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [verifyPassword, { isLoading }] = useVerifyPasswordMutation();

  const user = useSelector((state: RootState) => state.auth.user);
  const isDemoAccount = !!DEMO_EMAIL && user?.email === DEMO_EMAIL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const result = await verifyPassword({ password }).unwrap();
      if (result.valid) {
        setPassword('');
        onSuccess();
      } else {
        setError('Incorrect password. Please try again.');
      }
    } catch {
      setError('Verification failed. Please try again.');
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setPassword('');
      setError('');
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-amber-600" />
            <DialogTitle>Private Note</DialogTitle>
          </div>
          <DialogDescription>
            Enter your account password to unlock private notes for this
            session.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              autoFocus
            />
            {error && (
              <div className="flex items-center gap-1.5 text-xs text-destructive">
                <AlertCircle className="h-3 w-3" />
                {error}
              </div>
            )}
            {isDemoAccount && (
              <p className="text-xs text-muted-foreground">
                Demo account password:{' '}
                <span className="font-bold">{DEMO_PASSWORD}</span>
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!password || isLoading}>
              {isLoading ? 'Verifying...' : 'Unlock'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
