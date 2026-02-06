export enum TaskStatus {
  PENDING = "pending",
  COMPLETED = "completed",
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
}
