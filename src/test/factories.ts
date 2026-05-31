import type { Task, Sprint, KnowledgeGap } from '@/types/app';

let counter = 0;
const nextId = () => `id-${++counter}`;

export function makeTask(overrides: Partial<Task> = {}): Task {
  const id = overrides.id ?? nextId();
  return {
    id,
    user_id: 'user-1',
    sprint_id: null,
    title: 'Sample task',
    description: null,
    status: 'todo',
    priority: 'medium',
    tags: [],
    story_points: 1,
    due_date: null,
    completed_at: null,
    created_at: '2026-05-01T00:00:00.000Z',
    updated_at: '2026-05-01T00:00:00.000Z',
    ...overrides,
  };
}

export function makeSprint(overrides: Partial<Sprint> = {}): Sprint {
  const id = overrides.id ?? nextId();
  return {
    id,
    user_id: 'user-1',
    name: 'Sprint A',
    goal: null,
    status: 'active',
    start_date: '2026-05-01',
    end_date: '2026-05-14',
    created_at: '2026-05-01T00:00:00.000Z',
    updated_at: '2026-05-01T00:00:00.000Z',
    ...overrides,
  };
}

export function makeGap(overrides: Partial<KnowledgeGap> = {}): KnowledgeGap {
  const id = overrides.id ?? nextId();
  return {
    id,
    user_id: 'user-1',
    task_id: null,
    title: 'Sample gap',
    description: null,
    category: null,
    recurrence: 1,
    resolved: false,
    resolved_at: null,
    created_at: '2026-05-01T00:00:00.000Z',
    updated_at: '2026-05-01T00:00:00.000Z',
    ...overrides,
  };
}
