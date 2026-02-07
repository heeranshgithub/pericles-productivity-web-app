import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { TasksModule } from '../tasks/tasks.module';
import { NotesModule } from '../notes/notes.module';
import { FocusSessionsModule } from '../focus-sessions/focus-sessions.module';

@Module({
  imports: [TasksModule, NotesModule, FocusSessionsModule],
  controllers: [DashboardController],
})
export class DashboardModule {}
