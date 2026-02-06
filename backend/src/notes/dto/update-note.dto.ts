import { IsString, IsOptional, MaxLength, IsEnum } from 'class-validator';
import { NoteType } from '../schemas/note.schema';

export class UpdateNoteDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(10000)
  content?: string;

  @IsEnum(NoteType)
  @IsOptional()
  type?: NoteType;
}
