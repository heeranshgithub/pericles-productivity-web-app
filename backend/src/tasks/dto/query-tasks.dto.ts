import { IsEnum, IsOptional } from "class-validator";
import { TaskStatus } from "../schemas/task.schema";

export class QueryTasksDto {
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;
}
