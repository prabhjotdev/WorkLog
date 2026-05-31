import type { Task } from '@/types/app';

export interface SprintStats {
  tasksTotal: number;
  tasksDone: number;
  pointsTotal: number;
  pointsDone: number;
  completionPct: number;
}

/**
 * Compute sprint stats from a task list, client-side. Mirrors the
 * get_sprint_velocity RPC so cards can render instantly without an extra
 * round-trip after a local task mutation.
 */
export function computeSprintStats(tasks: Task[], sprintId: string): SprintStats {
  const sprintTasks = tasks.filter((t) => t.sprint_id === sprintId);
  const done = sprintTasks.filter((t) => t.status === 'done');
  const pointsTotal = sprintTasks.reduce((sum, t) => sum + (t.story_points ?? 0), 0);
  const pointsDone = done.reduce((sum, t) => sum + (t.story_points ?? 0), 0);
  return {
    tasksTotal: sprintTasks.length,
    tasksDone: done.length,
    pointsTotal,
    pointsDone,
    completionPct:
      sprintTasks.length === 0
        ? 0
        : Math.round((done.length / sprintTasks.length) * 1000) / 10,
  };
}
