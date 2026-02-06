import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { QueryTasksDto } from "./dto/query-tasks.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("tasks")
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Request() req: { user: { userId: string } }, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(req.user.userId, createTaskDto);
  }

  @Get()
  findAll(@Request() req: { user: { userId: string } }, @Query() query: QueryTasksDto) {
    return this.tasksService.findAll(req.user.userId, query.status);
  }

  @Get("stats")
  getStats(@Request() req: { user: { userId: string } }) {
    return this.tasksService.getStats(req.user.userId);
  }

  @Get(":id")
  findOne(@Request() req: { user: { userId: string } }, @Param("id") id: string) {
    return this.tasksService.findOne(id, req.user.userId);
  }

  @Put(":id")
  update(
    @Request() req: { user: { userId: string } },
    @Param("id") id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, req.user.userId, updateTaskDto);
  }

  @Put(":id/toggle")
  toggleStatus(@Request() req: { user: { userId: string } }, @Param("id") id: string) {
    return this.tasksService.toggleStatus(id, req.user.userId);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Request() req: { user: { userId: string } }, @Param("id") id: string) {
    return this.tasksService.remove(id, req.user.userId);
  }
}
