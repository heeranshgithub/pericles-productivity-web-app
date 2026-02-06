import { IsString, IsOptional, MaxLength, IsEnum } from "class-validator";
import { TaskStatus } from "../schemas/task.schema";

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;
}
