'use client';

import { Button } from '@/components/ui/button';
import { Play, Square, RotateCcw } from 'lucide-react';

interface TimerControlsProps {
  isActive: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  isLoading: boolean;
}

export function TimerControls({
  isActive,
  onStart,
  onStop,
  onReset,
  isLoading,
}: TimerControlsProps) {
  return (
    <div className="flex gap-4 justify-center">
      {!isActive ? (
        <Button
          size="lg"
          onClick={onStart}
          disabled={isLoading}
          className="min-w-32 gap-2"
        >
          <Play className="h-4 w-4" />
          Start
        </Button>
      ) : (
        <Button
          size="lg"
          variant="destructive"
          onClick={onStop}
          disabled={isLoading}
          className="min-w-32 gap-2"
        >
          <Square className="h-4 w-4" />
          Stop
        </Button>
      )}

      <Button
        size="lg"
        variant="outline"
        onClick={onReset}
        disabled={isLoading || isActive}
        className="gap-2"
      >
        <RotateCcw className="h-4 w-4" />
        Reset
      </Button>
    </div>
  );
}
