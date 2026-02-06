'use client';

import { useState, useMemo } from 'react';

import { TaskItem } from '@/components/tasks/TaskItem';
import { TaskFormDialog } from '@/components/tasks/TaskFormDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  useGetTasksQuery,
  useGetTaskStatsQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useToggleTaskStatusMutation,
  useDeleteTaskMutation,
} from '@/store/api/tasksApi';
import { Task, TaskStatus } from '@/types/task';
import { toast } from 'sonner';
import {
  Plus,
  CheckCircle2,
  Clock,
  ListChecks,
  ClipboardList,
} from 'lucide-react';

export default function TasksPage() {
  const [filter, setFilter] = useState<'all' | TaskStatus>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [toggleTaskStatus] = useToggleTaskStatusMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const { data: tasks = [], isLoading } = useGetTasksQuery(undefined);
  const { data: stats } = useGetTaskStatsQuery();

  const filteredTasks = useMemo(() => {
    if (filter === 'all') return tasks;
    return tasks.filter((task) => task.status === filter);
  }, [filter, tasks]);

  const completionPercent =
    stats && stats.total > 0
      ? Math.round((stats.completed / stats.total) * 100)
      : 0;

  const handleCreate = async (data: { title: string; description: string }) => {
    try {
      await createTask(data).unwrap();
      toast.success('Task created successfully');
    } catch {
      toast.error('Failed to create task');
    }
  };

  const handleUpdate = async (data: { title: string; description: string }) => {
    if (!editingTask) return;

    try {
      await updateTask({ id: editingTask._id, data }).unwrap();
      setEditingTask(null);
      toast.success('Task updated successfully');
    } catch {
      toast.error('Failed to update task');
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleTaskStatus(id).unwrap();
    } catch {
      toast.error('Failed to update task');
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteTask(deleteId).unwrap();
      setDeleteId(null);
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    }
  };

  return (
    <div className="min-h-screen w-full p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and track your to-dos.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingTask(null);
            setIsFormOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total
            </CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">{stats?.total ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">{stats?.pending ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Done
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">{stats?.completed ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">{completionPercent}%</p>
            <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Tabs
        value={filter}
        onValueChange={(v) => setFilter(v as 'all' | TaskStatus)}
        className="mb-6"
      >
        <TabsList>
          <TabsTrigger value="all" className="gap-1.5">
            All
            {stats && (
              <span className="ml-1 text-xs text-muted-foreground">
                {stats.total}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value={TaskStatus.PENDING} className="gap-1.5">
            Pending
            {stats && (
              <span className="ml-1 text-xs text-muted-foreground">
                {stats.pending}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value={TaskStatus.COMPLETED} className="gap-1.5">
            Completed
            {stats && (
              <span className="ml-1 text-xs text-muted-foreground">
                {stats.completed}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Task List */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 rounded-lg border border-border bg-card animate-pulse"
            />
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 px-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
            <ClipboardList className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-medium mb-1">
            {filter === 'all'
              ? 'No tasks yet'
              : filter === TaskStatus.PENDING
                ? 'No pending tasks'
                : 'No completed tasks'}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 text-center max-w-[280px]">
            {filter === 'all'
              ? 'Create your first task to get started.'
              : filter === TaskStatus.PENDING
                ? 'All caught up! Nothing pending.'
                : 'Complete a task to see it here.'}
          </p>
          {filter === 'all' && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => {
                setEditingTask(null);
                setIsFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Create a task
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={setDeleteId}
            />
          ))}
        </div>
      )}

      {/* Create / Edit dialog */}
      <TaskFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={editingTask ? handleUpdate : handleCreate}
        task={editingTask}
      />

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
