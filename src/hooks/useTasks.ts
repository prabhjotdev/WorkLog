import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from './useAppDispatch';
import * as tasksService from '@/services/tasks.service';
import {
  setTasks,
  addTask,
  updateTask as updateTaskAction,
  removeTask,
  setStatus,
  setError,
} from '@/store/tasksSlice';
import type { TaskInsert, TaskUpdate } from '@/types/app';

/**
 * Task data hook. Wraps the Supabase task service and keeps the Redux store in
 * sync, with toast feedback on failures. The current user id is read from auth
 * state so callers never pass user_id manually.
 */
export function useTasks() {
  const dispatch = useAppDispatch();
  const { items, status, error, activeTaskId } = useAppSelector((s) => s.tasks);
  const userId = useAppSelector((s) => s.auth.session?.user.id);

  const loadTasks = useCallback(async () => {
    dispatch(setStatus('loading'));
    try {
      const tasks = await tasksService.fetchTasks();
      dispatch(setTasks(tasks));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load tasks';
      dispatch(setError(message));
      toast.error(message);
    }
  }, [dispatch]);

  const createTask = useCallback(
    async (input: Omit<TaskInsert, 'user_id'>) => {
      if (!userId) {
        toast.error('You must be signed in');
        return null;
      }
      try {
        const task = await tasksService.createTask({ ...input, user_id: userId });
        dispatch(addTask(task));
        toast.success('Task created');
        return task;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create task';
        toast.error(message);
        return null;
      }
    },
    [dispatch, userId]
  );

  const editTask = useCallback(
    async (id: string, updates: TaskUpdate) => {
      try {
        const task = await tasksService.updateTask(id, updates);
        dispatch(updateTaskAction(task));
        toast.success('Task updated');
        return task;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update task';
        toast.error(message);
        return null;
      }
    },
    [dispatch]
  );

  /**
   * Toggle status with optimistic update — used by inline status changes on
   * task cards. On failure we reload to resync with the server.
   */
  const changeStatus = useCallback(
    async (id: string, status: TaskUpdate['status']) => {
      const updates: TaskUpdate = {
        status,
        completed_at: status === 'done' ? new Date().toISOString() : null,
      };
      try {
        const task = await tasksService.updateTask(id, updates);
        dispatch(updateTaskAction(task));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update status';
        toast.error(message);
        loadTasks();
      }
    },
    [dispatch, loadTasks]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      try {
        await tasksService.deleteTask(id);
        dispatch(removeTask(id));
        toast.success('Task deleted');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete task';
        toast.error(message);
      }
    },
    [dispatch]
  );

  return {
    tasks: items,
    status,
    error,
    activeTaskId,
    loadTasks,
    createTask,
    editTask,
    changeStatus,
    deleteTask,
  };
}
