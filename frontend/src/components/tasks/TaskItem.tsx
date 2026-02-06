'use client';

import { Task, TaskStatus } from '@/types/task';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Pencil, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  const isCompleted = task.status === TaskStatus.COMPLETED;

  return (
    <div
      className={cn(
        'group flex items-start gap-4 rounded-lg border border-border bg-card p-3 hover:bg-accent/50 transition-colors duration-150',
        isCompleted && 'opacity-75'
      )}
    >
      <Checkbox
        checked={isCompleted}
        onCheckedChange={() => onToggle(task._id)}
        className="mt-0.5"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p
              className={cn(
                'text-sm font-medium leading-snug',
                isCompleted && 'line-through text-muted-foreground'
              )}
            >
              {task.title}
            </p>
            {task.description && (
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <Badge
              variant={isCompleted ? 'secondary' : 'outline'}
              className="text-[10px] uppercase tracking-wider px-1.5 py-0"
            >
              {isCompleted ? 'Done' : 'Pending'}
            </Badge>
            <div className="flex opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground transition-colors duration-150"
                onClick={() => onEdit(task)}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive transition-colors duration-150"
                onClick={() => onDelete(task._id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>

        <p className="mt-2 text-xs text-muted-foreground uppercase tracking-wider">
          {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
}
