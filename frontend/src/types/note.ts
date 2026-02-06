export enum NoteType {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  type: NoteType;
  isEncrypted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteDto {
  title: string;
  content: string;
  type: NoteType;
}

export interface UpdateNoteDto {
  title?: string;
  content?: string;
  type?: NoteType;
}
