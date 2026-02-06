import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { NotesModule } from './notes/notes.module';
import { EncryptionModule } from './encryption/encryption.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/pericles',
    ),
    AuthModule,
    UsersModule,
    TasksModule,
    NotesModule,
    EncryptionModule,
  ],
})
export class AppModule {}
