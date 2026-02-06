import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { Note, NoteSchema } from './schemas/note.schema';
import { EncryptionModule } from '../encryption/encryption.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }]),
    EncryptionModule,
  ],
  controllers: [NotesController],
  providers: [NotesService],
  exports: [NotesService],
})
export class NotesModule {}
