import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FocusSessionsService } from './focus-sessions.service';
import { FocusSessionsController } from './focus-sessions.controller';
import {
  FocusSession,
  FocusSessionSchema,
} from './schemas/focus-session.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FocusSession.name, schema: FocusSessionSchema },
    ]),
  ],
  controllers: [FocusSessionsController],
  providers: [FocusSessionsService],
  exports: [FocusSessionsService],
})
export class FocusSessionsModule {}
