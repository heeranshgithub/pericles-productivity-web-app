import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum SessionType {
  POMODORO = 'pomodoro',
  STOPWATCH = 'stopwatch',
}

export type FocusSessionDocument = FocusSession & Document;

@Schema({ collection: 'focus_sessions', timestamps: true })
export class FocusSession {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ type: Date, default: null })
  endTime: Date | null;

  @Prop({ type: Number, default: null })
  duration: number | null; // Duration in seconds, calculated when session ends

  @Prop({ default: false })
  isActive: boolean; // Whether session is currently running

  @Prop({ type: String, enum: SessionType, default: SessionType.POMODORO })
  sessionType: SessionType;

  @Prop({ type: Number, default: null })
  targetDuration: number | null; // Target duration in seconds (e.g., 1500 for 25 min)

  @Prop({ type: Boolean, default: false })
  isBreak: boolean; // Whether this is a break session (for Pomodoro)
}

export const FocusSessionSchema = SchemaFactory.createForClass(FocusSession);

// Indexes for efficient queries
FocusSessionSchema.index({ userId: 1, isActive: 1 });
FocusSessionSchema.index({ userId: 1, startTime: -1 });
