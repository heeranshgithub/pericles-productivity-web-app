import {
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsDateString,
  Min,
  Max,
} from 'class-validator';
import { SessionType } from '../schemas/focus-session.schema';

export class StartSessionDto {
  @IsOptional()
  @IsEnum(SessionType)
  sessionType?: SessionType;

  @IsOptional()
  @IsNumber()
  @Min(60) // Minimum 1 minute
  @Max(14400) // Maximum 240 minutes (4 hours)
  targetDuration?: number; // in seconds

  @IsOptional()
  @IsBoolean()
  isBreak?: boolean;

  @IsOptional()
  @IsDateString()
  startTime?: string;
}
