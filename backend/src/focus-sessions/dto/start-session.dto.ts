import { IsOptional, IsDateString } from 'class-validator';

export class StartSessionDto {
  @IsOptional()
  @IsDateString()
  startTime?: string; // Optional: allow client to specify start time
}
