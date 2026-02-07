import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { NotesModule } from './notes/notes.module';
import { EncryptionModule } from './encryption/encryption.module';
import { FocusSessionsModule } from './focus-sessions/focus-sessions.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI ||
        `mongodb://localhost:27017/${process.env.DB_NAME || 'pericles'}`,
    ),
    AuthModule,
    UsersModule,
    TasksModule,
    NotesModule,
    EncryptionModule,
    FocusSessionsModule,
    DashboardModule,
  ],
})
export class AppModule {}
