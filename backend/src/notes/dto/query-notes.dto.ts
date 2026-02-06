import { IsEnum, IsOptional } from 'class-validator';
import { NoteType } from '../schemas/note.schema';

export class QueryNotesDto {
  @IsEnum(NoteType)
  @IsOptional()
  type?: NoteType;
}
