import { describe, it, expect } from 'vitest';
import reducer, {
  setTasks,
  addTask,
  updateTask,
  removeTask,
  setActiveTask,
  setStatus,
  setError,
} from './tasksSlice';
import { makeTask } from '@/test/factories';

const initial = reducer(undefined, { type: '@@INIT' });

describe('tasksSlice', () => {
  it('has a sensible initial state', () => {
    expect(initial).toEqual({
      items: [],
      status: 'idle',
      error: null,
      activeTaskId: null,
    });
  });

  it('setTasks replaces items and resets status to idle', () => {
    const tasks = [makeTask(), makeTask()];
    const state = reducer({ ...initial, status: 'loading' }, setTasks(tasks));
    expect(state.items).toHaveLength(2);
    expect(state.status).toBe('idle');
  });

  it('addTask prepends to the list', () => {
    const a = makeTask({ title: 'first' });
    const b = makeTask({ title: 'second' });
    let state = reducer(initial, addTask(a));
    state = reducer(state, addTask(b));
    expect(state.items[0].title).toBe('second');
    expect(state.items).toHaveLength(2);
  });

  it('updateTask replaces a matching task', () => {
    const task = makeTask({ title: 'old' });
    let state = reducer(initial, setTasks([task]));
    state = reducer(state, updateTask({ ...task, title: 'new' }));
    expect(state.items[0].title).toBe('new');
  });

  it('updateTask is a no-op when id not found', () => {
    const task = makeTask();
    const state = reducer(reducer(initial, setTasks([task])), updateTask(makeTask({ id: 'missing' })));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].id).toBe(task.id);
  });

  it('removeTask deletes by id', () => {
    const a = makeTask();
    const b = makeTask();
    let state = reducer(initial, setTasks([a, b]));
    state = reducer(state, removeTask(a.id));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].id).toBe(b.id);
  });

  it('setActiveTask stores the id', () => {
    const state = reducer(initial, setActiveTask('abc'));
    expect(state.activeTaskId).toBe('abc');
  });

  it('setStatus updates status', () => {
    expect(reducer(initial, setStatus('loading')).status).toBe('loading');
  });

  it('setError sets error message and status', () => {
    const state = reducer(initial, setError('boom'));
    expect(state.error).toBe('boom');
    expect(state.status).toBe('error');
  });
});
