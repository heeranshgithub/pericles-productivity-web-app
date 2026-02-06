import { IsString, IsNotEmpty, IsEnum, MaxLength } from 'class-validator';
import { NoteType } from '../schemas/note.schema';

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  content: string;

  @IsEnum(NoteType)
  type: NoteType;
}
