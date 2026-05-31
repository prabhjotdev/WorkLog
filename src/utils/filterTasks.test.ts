import { describe, it, expect } from 'vitest';
import { filterTasks, type TaskFilterState } from './filterTasks';
import { makeTask } from '@/test/factories';

const empty: TaskFilterState = {
  status: [],
  priority: [],
  tags: [],
  sprintId: null,
  search: '',
};

describe('filterTasks', () => {
  it('returns all tasks when no filters are set', () => {
    const tasks = [makeTask(), makeTask()];
    expect(filterTasks(tasks, empty)).toHaveLength(2);
  });

  it('filters by status', () => {
    const tasks = [
      makeTask({ status: 'todo' }),
      makeTask({ status: 'done' }),
      makeTask({ status: 'done' }),
    ];
    const result = filterTasks(tasks, { ...empty, status: ['done'] });
    expect(result).toHaveLength(2);
    expect(result.every((t) => t.status === 'done')).toBe(true);
  });

  it('filters by multiple statuses (OR)', () => {
    const tasks = [
      makeTask({ status: 'todo' }),
      makeTask({ status: 'done' }),
      makeTask({ status: 'blocked' }),
    ];
    const result = filterTasks(tasks, { ...empty, status: ['todo', 'blocked'] });
    expect(result).toHaveLength(2);
  });

  it('filters by priority', () => {
    const tasks = [makeTask({ priority: 'high' }), makeTask({ priority: 'low' })];
    expect(filterTasks(tasks, { ...empty, priority: ['high'] })).toHaveLength(1);
  });

  it('filters by sprintId', () => {
    const tasks = [
      makeTask({ sprint_id: 's1' }),
      makeTask({ sprint_id: 's2' }),
      makeTask({ sprint_id: null }),
    ];
    expect(filterTasks(tasks, { ...empty, sprintId: 's1' })).toHaveLength(1);
  });

  it('filters by tags (OR match)', () => {
    const tasks = [
      makeTask({ tags: ['api', 'backend'] }),
      makeTask({ tags: ['ui'] }),
      makeTask({ tags: [] }),
    ];
    expect(filterTasks(tasks, { ...empty, tags: ['api'] })).toHaveLength(1);
    expect(filterTasks(tasks, { ...empty, tags: ['api', 'ui'] })).toHaveLength(2);
  });

  it('searches title, description, and tags case-insensitively', () => {
    const tasks = [
      makeTask({ title: 'Fix Auth bug' }),
      makeTask({ description: 'about PAGINATION' }),
      makeTask({ tags: ['database'] }),
      makeTask({ title: 'unrelated' }),
    ];
    expect(filterTasks(tasks, { ...empty, search: 'auth' })).toHaveLength(1);
    expect(filterTasks(tasks, { ...empty, search: 'pagination' })).toHaveLength(1);
    expect(filterTasks(tasks, { ...empty, search: 'DATABASE' })).toHaveLength(1);
  });

  it('combines filters with AND semantics', () => {
    const tasks = [
      makeTask({ status: 'done', priority: 'high', tags: ['api'] }),
      makeTask({ status: 'done', priority: 'low', tags: ['api'] }),
      makeTask({ status: 'todo', priority: 'high', tags: ['api'] }),
    ];
    const result = filterTasks(tasks, {
      ...empty,
      status: ['done'],
      priority: ['high'],
      tags: ['api'],
    });
    expect(result).toHaveLength(1);
  });

  it('ignores leading/trailing whitespace in search', () => {
    const tasks = [makeTask({ title: 'hello world' })];
    expect(filterTasks(tasks, { ...empty, search: '  world  ' })).toHaveLength(1);
  });
});
