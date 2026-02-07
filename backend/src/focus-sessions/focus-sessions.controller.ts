import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FocusSessionsService } from './focus-sessions.service';
import { StartSessionDto } from './dto/start-session.dto';
import { EndSessionDto } from './dto/end-session.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('focus-sessions')
@UseGuards(JwtAuthGuard)
export class FocusSessionsController {
  constructor(private readonly focusSessionsService: FocusSessionsService) {}

  @Post('start')
  @HttpCode(HttpStatus.CREATED)
  startSession(@Request() req, @Body() dto: StartSessionDto) {
    return this.focusSessionsService.startSession(req.user.userId, dto);
  }

  @Post('end')
  @HttpCode(HttpStatus.OK)
  endSession(@Request() req, @Body() dto: EndSessionDto) {
    return this.focusSessionsService.endSession(req.user.userId, dto);
  }

  @Get('active')
  getActiveSession(@Request() req) {
    return this.focusSessionsService.getActiveSession(req.user.userId);
  }

  @Get('recent')
  getRecentSessions(@Request() req) {
    return this.focusSessionsService.getRecentSessions(req.user.userId);
  }

  @Get('stats')
  getStats(@Request() req) {
    return this.focusSessionsService.getSessionStats(req.user.userId);
  }

  @Get()
  getAllSessions(@Request() req) {
    return this.focusSessionsService.getAllSessions(req.user.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteSession(@Request() req, @Param('id') id: string) {
    return this.focusSessionsService.deleteSession(id, req.user.userId);
  }
}
