import { baseApi } from "./baseApi";
import {
  Task,
  CreateTaskDto,
  UpdateTaskDto,
  TaskStatus,
  TaskStats,
} from "@/types/task";

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], TaskStatus | undefined>({
      query: (status) => ({
        url: "/tasks",
        params: status ? { status } : {},
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Task" as const, id: _id })),
              { type: "Task", id: "LIST" },
            ]
          : [{ type: "Task", id: "LIST" }],
    }),

    getTaskStats: builder.query<TaskStats, void>({
      query: () => "/tasks/stats",
      providesTags: [{ type: "Task", id: "STATS" }],
    }),

    getTask: builder.query<Task, string>({
      query: (id) => `/tasks/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Task", id }],
    }),

    createTask: builder.mutation<Task, CreateTaskDto>({
      query: (data) => ({
        url: "/tasks",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [
        { type: "Task", id: "LIST" },
        { type: "Task", id: "STATS" },
      ],
    }),

    updateTask: builder.mutation<Task, { id: string; data: UpdateTaskDto }>({
      query: ({ id, data }) => ({
        url: `/tasks/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Task", id },
        { type: "Task", id: "LIST" },
        { type: "Task", id: "STATS" },
      ],
    }),

    toggleTaskStatus: builder.mutation<Task, string>({
      query: (id) => ({
        url: `/tasks/${id}/toggle`,
        method: "PUT",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Task", id },
        { type: "Task", id: "LIST" },
        { type: "Task", id: "STATS" },
      ],
    }),

    deleteTask: builder.mutation<void, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Task", id: "LIST" },
        { type: "Task", id: "STATS" },
      ],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskStatsQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useToggleTaskStatusMutation,
  useDeleteTaskMutation,
} = tasksApi;
