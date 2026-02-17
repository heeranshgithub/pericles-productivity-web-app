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
  StreamableFile,
  Res,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { Readable } from 'stream';

import axios from 'axios';
import * as FormData from 'form-data';

import { NotesService } from './notes.service';

import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { QueryNotesDto } from './dto/query-notes.dto';
import { ExportPdfDto } from './dto/export-pdf.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  private readonly logger = new Logger(NotesController.name);

  constructor(
    private readonly notesService: NotesService,
    private readonly configService: ConfigService,
  ) {}

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

  @Post('export-pdf')
  @HttpCode(HttpStatus.OK)
  async exportPdf(
    @Body() exportPdfDto: ExportPdfDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const pdfBuffer = await this.notesService.generatePdfFromHtml(
      exportPdfDto.htmlContent,
    );

    const filename = exportPdfDto.filename || 'document.pdf';

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': pdfBuffer.length,
    });

    const webhookUrl = this.configService.get<string>('MAKE_PDF_WEBHOOK_URL');
    const apiKey = this.configService.get<string>('X_MAKE_API_KEY');

    if (webhookUrl) {
      try {
        this.logger.log(
          `Sending PDF to Make.com webhook: ${webhookUrl.substring(0, 30)}...`,
        );

        const form = new FormData();
        form.append('file', pdfBuffer, {
          filename,
          contentType: 'application/pdf',
        });

        await axios.post(webhookUrl, form, {
          headers: {
            ...form.getHeaders(),
            'x-make-apikey': apiKey || '',
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        });

        this.logger.log('PDF successfully sent to Make.com webhook');
      } catch (error) {
        this.logger.error(
          `Failed to send PDF to Make.com webhook: ${error.message}`,
        );
      }
    } else {
      this.logger.warn(
        'MAKE_PDF_WEBHOOK_URL not configured, skipping webhook send',
      );
    }

    const stream = Readable.from(pdfBuffer);
    return new StreamableFile(stream);
  }
}
