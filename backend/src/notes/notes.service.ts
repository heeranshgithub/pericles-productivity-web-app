import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Note, NoteDocument, NoteType } from './schemas/note.schema';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { EncryptionService } from '../encryption/encryption.service';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note.name) private noteModel: Model<NoteDocument>,
    private encryptionService: EncryptionService,
  ) {}

  async create(userId: string, createNoteDto: CreateNoteDto): Promise<Note> {
    const isPrivate = createNoteDto.type === NoteType.PRIVATE;

    const note = new this.noteModel({
      userId: new Types.ObjectId(userId),
      title: createNoteDto.title,
      content: isPrivate
        ? this.encryptionService.encrypt(createNoteDto.content)
        : createNoteDto.content,
      type: createNoteDto.type,
      isEncrypted: isPrivate,
    });

    const saved = await note.save();
    return this.decryptNoteIfNeeded(saved);
  }

  async findAll(userId: string, type?: NoteType): Promise<Note[]> {
    const query: any = { userId: new Types.ObjectId(userId) };

    if (type) {
      query.type = type;
    }

    const notes = await this.noteModel
      .find(query)
      .sort({ updatedAt: -1 })
      .exec();

    return notes.map((note) => this.decryptNoteIfNeeded(note));
  }

  async findOne(id: string, userId: string): Promise<Note> {
    const note = await this.noteModel.findById(id).exec();

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    if (note.userId.toString() !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.decryptNoteIfNeeded(note);
  }

  async update(
    id: string,
    userId: string,
    updateNoteDto: UpdateNoteDto,
  ): Promise<Note> {
    const note = await this.noteModel.findById(id).exec();

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    if (note.userId.toString() !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // Handle type change (public to private or vice versa)
    if (updateNoteDto.type && updateNoteDto.type !== note.type) {
      const currentContent = note.isEncrypted
        ? this.encryptionService.decrypt(note.content)
        : note.content;

      note.content =
        updateNoteDto.type === NoteType.PRIVATE
          ? this.encryptionService.encrypt(currentContent)
          : currentContent;

      note.isEncrypted = updateNoteDto.type === NoteType.PRIVATE;
      note.type = updateNoteDto.type;
    }

    // Handle content update
    if (updateNoteDto.content !== undefined) {
      note.content = note.isEncrypted
        ? this.encryptionService.encrypt(updateNoteDto.content)
        : updateNoteDto.content;
    }

    // Handle title update
    if (updateNoteDto.title !== undefined) {
      note.title = updateNoteDto.title;
    }

    const updated = await note.save();
    return this.decryptNoteIfNeeded(updated);
  }

  async remove(id: string, userId: string): Promise<void> {
    const note = await this.noteModel.findById(id).exec();

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    if (note.userId.toString() !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await note.deleteOne();
  }

  async getRecentNotes(userId: string, limit: number = 3): Promise<Note[]> {
    const notes = await this.noteModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .exec();

    return notes.map((note) => this.decryptNoteIfNeeded(note));
  }

  private decryptNoteIfNeeded(note: NoteDocument): Note {
    const noteObj = note.toObject();

    if (noteObj.isEncrypted && noteObj.content) {
      try {
        noteObj.content = this.encryptionService.decrypt(noteObj.content);
      } catch (error) {
        // If decryption fails, log error but don't crash
        console.error('Failed to decrypt note:', error);
        noteObj.content = '[Encrypted - Unable to decrypt]';
      }
    }

    return noteObj;
  }
}
