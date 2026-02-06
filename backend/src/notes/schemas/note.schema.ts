import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NoteDocument = Note & Document;

export enum NoteType {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

@Schema({ timestamps: true })
export class Note {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  content: string; // Encrypted for private notes, plain for public

  @Prop({ type: String, enum: NoteType, required: true })
  type: NoteType;

  @Prop({ default: false })
  isEncrypted: boolean; // Flag to track encryption status

  createdAt?: Date;
  updatedAt?: Date;
}

export const NoteSchema = SchemaFactory.createForClass(Note);

// Indexes
NoteSchema.index({ userId: 1, type: 1 });
NoteSchema.index({ userId: 1, createdAt: -1 });
