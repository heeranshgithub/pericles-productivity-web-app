'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Note, NoteType } from '@/types/note';
import { Lock, Globe } from 'lucide-react';

interface NoteFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { title: string; content: string; type: NoteType }) => void;
  note?: Note | null;
}

export function NoteFormDialog({
  open,
  onOpenChange,
  onSubmit,
  note,
}: NoteFormDialogProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setIsPrivate(note.type === NoteType.PRIVATE);
    } else {
      setTitle('');
      setContent('');
      setIsPrivate(false);
    }
  }, [note, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      content,
      type: isPrivate ? NoteType.PRIVATE : NoteType.PUBLIC,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{note ? 'Edit Note' : 'Create New Note'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter note title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                maxLength={200}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {isPrivate ? (
                  <Lock className="h-5 w-5 text-amber-600" />
                ) : (
                  <Globe className="h-5 w-5 text-teal-600" />
                )}
                <div>
                  <Label htmlFor="private-toggle" className="cursor-pointer">
                    {isPrivate ? 'Private Note' : 'Public Note'}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {isPrivate
                      ? 'Content is encrypted and stored securely'
                      : 'Content is stored in plain text'}
                  </p>
                </div>
              </div>
              <Switch
                id="private-toggle"
                checked={isPrivate}
                onCheckedChange={setIsPrivate}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Write your note here..."
                value={content}
                onChange={e => setContent(e.target.value)}
                required
                rows={12}
                maxLength={10000}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground text-right">
                {content.length} / 10000 characters
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">{note ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
