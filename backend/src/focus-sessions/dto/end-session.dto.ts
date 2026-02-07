import { IsOptional, IsDateString } from 'class-validator';

export class EndSessionDto {
  @IsOptional()
  @IsDateString()
  endTime?: string; // Optional: allow client to specify end time
}
