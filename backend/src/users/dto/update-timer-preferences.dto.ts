import { IsOptional, IsNumber, Min, Max } from 'class-validator';

export class UpdateTimerPreferencesDto {
  @IsOptional()
  @IsNumber()
  @Min(60) // Minimum 1 minute
  @Max(14400) // Maximum 240 minutes
  defaultWorkDuration?: number;

  @IsOptional()
  @IsNumber()
  @Min(60)
  @Max(14400)
  defaultBreakDuration?: number;
}
