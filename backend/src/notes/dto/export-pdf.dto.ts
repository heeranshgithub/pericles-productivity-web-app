import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class ExportPdfDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500000)
  htmlContent: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  filename?: string;
}
