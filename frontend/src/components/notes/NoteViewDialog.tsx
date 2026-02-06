'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Note, NoteType } from '@/types/note';
import { Lock, Globe } from 'lucide-react';
import { format } from 'date-fns';

interface NoteViewDialogProps {
  note: Note | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NoteViewDialog({
  note,
  open,
  onOpenChange,
}: NoteViewDialogProps) {
  if (!note) return null;

  const isPrivate = note.type === NoteType.PRIVATE;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {isPrivate ? (
              <Lock className="h-5 w-5 text-amber-600" />
            ) : (
              <Globe className="h-5 w-5 text-teal-600" />
            )}
            <DialogTitle className="flex-1">{note.title}</DialogTitle>
            <Badge variant={isPrivate ? 'secondary' : 'outline'}>
              {isPrivate ? 'Private' : 'Public'}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Last updated: {format(new Date(note.updatedAt), 'PPpp')}
          </p>
        </DialogHeader>
        <div className="py-4">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <pre className="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-lg">
              {note.content}
            </pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
