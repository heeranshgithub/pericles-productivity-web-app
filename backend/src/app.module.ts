import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        const dbName = configService.get<string>('DB_NAME') || 'pericles';

        if (!uri) {
          throw new Error(
            'MONGODB_URI is not defined in environment variables. Please check your .env file.',
          );
        }

        return {
          uri,
          dbName,
        };
      },
      inject: [ConfigService],
    }),
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
