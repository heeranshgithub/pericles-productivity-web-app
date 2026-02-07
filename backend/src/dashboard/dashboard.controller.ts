import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TasksService } from '../tasks/tasks.service';
import { NotesService } from '../notes/notes.service';
import { FocusSessionsService } from '../focus-sessions/focus-sessions.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly notesService: NotesService,
    private readonly focusSessionsService: FocusSessionsService,
  ) {}

  @Get('stats')
  async getDashboardStats(@Request() req: { user: { userId: string } }) {
    const userId = req.user.userId;

    const [taskStats, recentNotes, sessionStats, recentSessions] =
      await Promise.all([
        this.tasksService.getStats(userId),
        this.notesService.getRecentNotes(userId, 3),
        this.focusSessionsService.getSessionStats(userId),
        this.focusSessionsService.getRecentSessions(userId, 3),
      ]);

    return {
      tasks: taskStats,
      notes: {
        recent: recentNotes,
      },
      sessions: {
        stats: sessionStats,
        recent: recentSessions,
      },
    };
  }
}
