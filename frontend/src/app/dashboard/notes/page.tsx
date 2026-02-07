'use client';

import { useState, useMemo } from 'react';
import { NoteItem } from '@/components/notes/NoteItem';
import { NoteFormDialog } from '@/components/notes/NoteFormDialog';
import { NoteViewDialog } from '@/components/notes/NoteViewDialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  useGetNotesQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} from '@/store/api/notesApi';
import { Note, NoteType } from '@/types/note';
import { toast } from 'sonner';
import { Plus, StickyNote } from 'lucide-react';

export default function NotesPage() {
  const [filter, setFilter] = useState<'all' | NoteType>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [createNote] = useCreateNoteMutation();
  const [updateNote] = useUpdateNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();

  const { data: notes = [], isLoading } = useGetNotesQuery(undefined);

  const filteredNotes = useMemo(() => {
    if (filter === 'all') return notes;
    return notes.filter(note => note.type === filter);
  }, [filter, notes]);

  const publicCount = notes.filter(n => n.type === NoteType.PUBLIC).length;
  const privateCount = notes.filter(n => n.type === NoteType.PRIVATE).length;

  const handleCreate = async (data: {
    title: string;
    content: string;
    type: NoteType;
  }) => {
    try {
      await createNote(data).unwrap();
      toast.success('Note created successfully');
    } catch {
      toast.error('Failed to create note');
    }
  };

  const handleUpdate = async (data: {
    title: string;
    content: string;
    type: NoteType;
  }) => {
    if (!editingNote) return;

    try {
      await updateNote({ id: editingNote._id, data }).unwrap();
      setEditingNote(null);
      toast.success('Note updated successfully');
    } catch {
      toast.error('Failed to update note');
    }
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteNote(deleteId).unwrap();
      setDeleteId(null);
      toast.success('Note deleted');
    } catch {
      toast.error('Failed to delete note');
    }
  };

  return (
    <div className="min-h-screen w-full p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create public and private encrypted notes.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingNote(null);
            setIsFormOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Note
        </Button>
      </div>

      {/* Filter Tabs */}
      <Tabs
        value={filter}
        onValueChange={v => setFilter(v as 'all' | NoteType)}
        className="mb-6"
      >
        <TabsList>
          <TabsTrigger value="all" className="gap-1.5">
            All
            <span className="ml-1 text-xs text-muted-foreground">
              {notes.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value={NoteType.PUBLIC} className="gap-1.5">
            Public
            <span className="ml-1 text-xs text-muted-foreground">
              {publicCount}
            </span>
          </TabsTrigger>
          <TabsTrigger value={NoteType.PRIVATE} className="gap-1.5">
            Private
            <span className="ml-1 text-xs text-muted-foreground">
              {privateCount}
            </span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Notes List */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="h-48 rounded-lg border border-border bg-card animate-pulse"
            />
          ))}
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 px-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
            <StickyNote className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-medium mb-1">
            {filter === 'all'
              ? 'No notes yet'
              : filter === NoteType.PUBLIC
                ? 'No public notes'
                : 'No private notes'}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 text-center max-w-[280px]">
            {filter === 'all'
              ? 'Create your first note to get started.'
              : filter === NoteType.PUBLIC
                ? 'Create a public note to see it here.'
                : 'Create a private note to see it here.'}
          </p>
          {filter === 'all' && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => {
                setEditingNote(null);
                setIsFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Create a note
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map(note => (
            <NoteItem
              key={note._id}
              note={note}
              onEdit={handleEdit}
              onDelete={setDeleteId}
              onClick={setViewingNote}
            />
          ))}
        </div>
      )}

      {/* Create / Edit dialog */}
      <NoteFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={editingNote ? handleUpdate : handleCreate}
        note={editingNote}
      />

      {/* View dialog */}
      <NoteViewDialog
        note={viewingNote}
        open={!!viewingNote}
        onOpenChange={open => !open && setViewingNote(null)}
        onEdit={note => {
          // close view and open edit form
          setViewingNote(null);
          setEditingNote(note);
          setIsFormOpen(true);
        }}
      />

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={open => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
