import type { Task } from '@/types/app';

export interface TaskFilterState {
  status: string[];
  priority: string[];
  tags: string[];
  sprintId: string | null;
  search: string;
}

/** Pure task filter — applied client-side over the loaded task list. */
export function filterTasks(tasks: Task[], filters: TaskFilterState): Task[] {
  const search = filters.search.trim().toLowerCase();
  return tasks.filter((task) => {
    if (filters.status.length && !filters.status.includes(task.status)) return false;
    if (filters.priority.length && !filters.priority.includes(task.priority)) return false;
    if (filters.sprintId && task.sprint_id !== filters.sprintId) return false;
    if (filters.tags.length && !filters.tags.some((t) => task.tags.includes(t))) return false;
    if (search) {
      const haystack = `${task.title} ${task.description ?? ''} ${task.tags.join(' ')}`.toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return true;
  });
}
