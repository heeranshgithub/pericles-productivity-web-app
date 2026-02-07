'use client';

import { Note, NoteType } from '@/types/note';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Lock, Globe } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NoteItemProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onClick: (note: Note) => void;
}

export function NoteItem({ note, onEdit, onDelete, onClick }: NoteItemProps) {
  const isPrivate = note.type === NoteType.PRIVATE;
  const trimmed =
    note.content.length > 150
      ? note.content.substring(0, 150) + '...'
      : note.content;
  const preview = isPrivate
    ? 'This note is private. Open to view its contents.'
    : trimmed;

  return (
    <Card
      className="p-4 transition-all hover:shadow-md cursor-pointer"
      onClick={() => onClick(note)}
    >
      <div className="flex items-center gap-2 mb-2">
        {isPrivate ? (
          <Lock className="h-4 w-4 text-amber-600" />
        ) : (
          <Globe className="h-4 w-4 text-teal-600" />
        )}
        <h3 className="font-semibold truncate flex-1">{note.title}</h3>
        <Badge
          variant={isPrivate ? 'secondary' : 'outline'}
          className="shrink-0"
        >
          {isPrivate ? 'Private' : 'Public'}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2 mb-3 min-h-[2.5rem]">
        {preview}
      </p>

      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">
          Updated{' '}
          {formatDistanceToNow(new Date(note.updatedAt), {
            addSuffix: true,
          })}
        </span>

        <div className="flex gap-2 shrink-0" onClick={e => e.stopPropagation()}>
          <Button variant="ghost" size="sm" onClick={() => onEdit(note)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(note._id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
