import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ default: "light", enum: ["light", "dark"] })
  themePreference: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Index for faster email lookups
UserSchema.index({ email: 1 });
