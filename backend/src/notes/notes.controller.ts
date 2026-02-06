import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { QueryNotesDto } from './dto/query-notes.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Request() req, @Body() createNoteDto: CreateNoteDto) {
    return this.notesService.create(req.user.userId, createNoteDto);
  }

  @Get()
  findAll(@Request() req, @Query() query: QueryNotesDto) {
    return this.notesService.findAll(req.user.userId, query.type);
  }

  @Get('recent')
  getRecent(@Request() req) {
    return this.notesService.getRecentNotes(req.user.userId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.notesService.findOne(id, req.user.userId);
  }

  @Put(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    return this.notesService.update(id, req.user.userId, updateNoteDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Request() req, @Param('id') id: string) {
    return this.notesService.remove(id, req.user.userId);
  }
}
