import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Task, TaskDocument, TaskStatus } from "./schemas/task.schema";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(userId: string, createTaskDto: CreateTaskDto): Promise<Task> {
    const task = new this.taskModel({
      ...createTaskDto,
      userId: new Types.ObjectId(userId),
      status: TaskStatus.PENDING,
    });
    return task.save();
  }

  async findAll(userId: string, status?: TaskStatus): Promise<Task[]> {
    const query: { userId: Types.ObjectId; status?: TaskStatus } = {
      userId: new Types.ObjectId(userId),
    };

    if (status) {
      query.status = status;
    }

    return this.taskModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string, userId: string): Promise<TaskDocument> {
    const task = await this.taskModel.findById(id).exec();

    if (!task) {
      throw new NotFoundException("Task not found");
    }

    if (task.userId.toString() !== userId) {
      throw new ForbiddenException("Access denied");
    }

    return task;
  }

  async update(
    id: string,
    userId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.findOne(id, userId);

    Object.assign(task, updateTaskDto);
    return task.save();
  }

  async toggleStatus(id: string, userId: string): Promise<Task> {
    const task = await this.findOne(id, userId);

    task.status =
      task.status === TaskStatus.COMPLETED
        ? TaskStatus.PENDING
        : TaskStatus.COMPLETED;

    return task.save();
  }

  async remove(id: string, userId: string): Promise<void> {
    const task = await this.findOne(id, userId);
    await task.deleteOne();
  }

  async getStats(userId: string) {
    const tasks = await this.findAll(userId);
    const completed = tasks.filter(
      (t) => t.status === TaskStatus.COMPLETED,
    ).length;
    const pending = tasks.filter((t) => t.status === TaskStatus.PENDING).length;

    return {
      total: tasks.length,
      completed,
      pending,
    };
  }
}
