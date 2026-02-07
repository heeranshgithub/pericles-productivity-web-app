import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class TimerPreferences {
  @Prop({ type: Number, default: 1500 })
  defaultWorkDuration: number; // Default: 25 minutes (1500 seconds)

  @Prop({ type: Number, default: 300 })
  defaultBreakDuration: number; // Default: 5 minutes (300 seconds)
}

export const TimerPreferencesSchema =
  SchemaFactory.createForClass(TimerPreferences);

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ default: 'light', enum: ['light', 'dark'] })
  themePreference: string;

  @Prop({ type: TimerPreferencesSchema, default: () => ({}) })
  timerPreferences: TimerPreferences;
}

export const UserSchema = SchemaFactory.createForClass(User);
