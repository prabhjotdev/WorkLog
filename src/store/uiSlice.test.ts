import { describe, it, expect } from 'vitest';
import reducer, {
  openTaskModal,
  closeTaskModal,
  openSprintModal,
  closeSprintModal,
  openGapModal,
  closeGapModal,
  setTaskFilters,
  clearTaskFilters,
  setReportRange,
  toggleSidebar,
} from './uiSlice';

const initial = reducer(undefined, { type: '@@INIT' });

describe('uiSlice', () => {
  it('openTaskModal in create mode (null id)', () => {
    const state = reducer(initial, openTaskModal(null));
    expect(state.taskModalOpen).toBe(true);
    expect(state.editingTaskId).toBeNull();
  });

  it('openTaskModal in edit mode stores the id, closeTaskModal resets', () => {
    let state = reducer(initial, openTaskModal('t1'));
    expect(state.editingTaskId).toBe('t1');
    state = reducer(state, closeTaskModal());
    expect(state.taskModalOpen).toBe(false);
    expect(state.editingTaskId).toBeNull();
  });

  it('sprint modal open/close', () => {
    let state = reducer(initial, openSprintModal('s1'));
    expect(state.sprintModalOpen).toBe(true);
    expect(state.editingSprintId).toBe('s1');
    state = reducer(state, closeSprintModal());
    expect(state.sprintModalOpen).toBe(false);
    expect(state.editingSprintId).toBeNull();
  });

  it('gap modal open/close', () => {
    let state = reducer(initial, openGapModal('g1'));
    expect(state.gapModalOpen).toBe(true);
    expect(state.editingGapId).toBe('g1');
    state = reducer(state, closeGapModal());
    expect(state.gapModalOpen).toBe(false);
    expect(state.editingGapId).toBeNull();
  });

  it('setTaskFilters merges partial updates', () => {
    let state = reducer(initial, setTaskFilters({ search: 'abc' }));
    expect(state.taskFilters.search).toBe('abc');
    state = reducer(state, setTaskFilters({ status: ['done'] }));
    expect(state.taskFilters.search).toBe('abc'); // preserved
    expect(state.taskFilters.status).toEqual(['done']);
  });

  it('clearTaskFilters resets to defaults', () => {
    const dirty = reducer(initial, setTaskFilters({ search: 'x', status: ['todo'] }));
    const state = reducer(dirty, clearTaskFilters());
    expect(state.taskFilters).toEqual({
      status: [],
      priority: [],
      tags: [],
      sprintId: null,
      search: '',
    });
  });

  it('setReportRange sets and clears', () => {
    let state = reducer(initial, setReportRange({ from: '2026-01-01', to: '2026-02-01' }));
    expect(state.reportRange).toEqual({ from: '2026-01-01', to: '2026-02-01' });
    state = reducer(state, setReportRange(null));
    expect(state.reportRange).toBeNull();
  });

  it('toggleSidebar flips the flag', () => {
    const state = reducer(initial, toggleSidebar());
    expect(state.sidebarCollapsed).toBe(!initial.sidebarCollapsed);
  });
});
