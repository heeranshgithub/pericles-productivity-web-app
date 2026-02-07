import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  FocusSession,
  FocusSessionDocument,
} from './schemas/focus-session.schema';
import { StartSessionDto } from './dto/start-session.dto';
import { EndSessionDto } from './dto/end-session.dto';

@Injectable()
export class FocusSessionsService {
  constructor(
    @InjectModel(FocusSession.name)
    private focusSessionModel: Model<FocusSessionDocument>,
  ) {}

  async startSession(
    userId: string,
    dto: StartSessionDto = {},
  ): Promise<FocusSession> {
    const activeSession = await this.focusSessionModel
      .findOne({
        userId: new Types.ObjectId(userId),
        isActive: true,
      })
      .exec();

    if (activeSession) {
      throw new BadRequestException(
        'You already have an active session. End it before starting a new one.',
      );
    }

    const startTime = dto.startTime ? new Date(dto.startTime) : new Date();

    const session = new this.focusSessionModel({
      userId: new Types.ObjectId(userId),
      startTime,
      isActive: true,
    });

    return session.save();
  }

  async endSession(
    userId: string,
    dto: EndSessionDto = {},
  ): Promise<FocusSession> {
    const activeSession = await this.focusSessionModel
      .findOne({
        userId: new Types.ObjectId(userId),
        isActive: true,
      })
      .exec();

    if (!activeSession) {
      throw new NotFoundException('No active session found');
    }

    const endTime = dto.endTime ? new Date(dto.endTime) : new Date();

    // Calculate duration in seconds
    const duration = Math.floor(
      (endTime.getTime() - activeSession.startTime.getTime()) / 1000,
    );

    activeSession.endTime = endTime;
    activeSession.duration = duration;
    activeSession.isActive = false;

    return activeSession.save();
  }

  async getActiveSession(userId: string): Promise<FocusSession | null> {
    return this.focusSessionModel
      .findOne({
        userId: new Types.ObjectId(userId),
        isActive: true,
      })
      .exec();
  }

  async getAllSessions(
    userId: string,
    limit: number = 50,
  ): Promise<FocusSession[]> {
    return this.focusSessionModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ startTime: -1 })
      .limit(limit)
      .exec();
  }

  async getRecentSessions(
    userId: string,
    limit: number = 3,
  ): Promise<FocusSession[]> {
    return this.focusSessionModel
      .find({
        userId: new Types.ObjectId(userId),
        isActive: false,
      })
      .sort({ startTime: -1 })
      .limit(limit)
      .exec();
  }

  async getSessionStats(userId: string) {
    const completedSessions = await this.focusSessionModel
      .find({
        userId: new Types.ObjectId(userId),
        isActive: false,
      })
      .exec();

    const totalSessions = completedSessions.length;
    const totalTime = completedSessions.reduce(
      (sum, session) => sum + (session.duration || 0),
      0,
    );
    const averageTime =
      totalSessions > 0 ? Math.floor(totalTime / totalSessions) : 0;

    // Calculate today's total
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySessions = completedSessions.filter(
      (session) => session.startTime >= today,
    );
    const todayTime = todaySessions.reduce(
      (sum, session) => sum + (session.duration || 0),
      0,
    );

    return {
      totalSessions,
      totalTime,
      averageTime,
      todaySessions: todaySessions.length,
      todayTime,
    };
  }

  async deleteSession(sessionId: string, userId: string): Promise<void> {
    const session = await this.focusSessionModel.findById(sessionId).exec();

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.userId.toString() !== userId) {
      throw new BadRequestException('Access denied');
    }

    await session.deleteOne();
  }
}
