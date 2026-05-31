import { describe, it, expect } from 'vitest';
import { computeSprintStats } from './computeVelocity';
import { makeTask } from '@/test/factories';

describe('computeSprintStats', () => {
  it('returns zeros for a sprint with no tasks', () => {
    const stats = computeSprintStats([], 's1');
    expect(stats).toEqual({
      tasksTotal: 0,
      tasksDone: 0,
      pointsTotal: 0,
      pointsDone: 0,
      completionPct: 0,
    });
  });

  it('only counts tasks belonging to the sprint', () => {
    const tasks = [
      makeTask({ sprint_id: 's1' }),
      makeTask({ sprint_id: 's2' }),
      makeTask({ sprint_id: null }),
    ];
    expect(computeSprintStats(tasks, 's1').tasksTotal).toBe(1);
  });

  it('sums total and done story points', () => {
    const tasks = [
      makeTask({ sprint_id: 's1', status: 'done', story_points: 3 }),
      makeTask({ sprint_id: 's1', status: 'done', story_points: 2 }),
      makeTask({ sprint_id: 's1', status: 'todo', story_points: 5 }),
    ];
    const stats = computeSprintStats(tasks, 's1');
    expect(stats.pointsTotal).toBe(10);
    expect(stats.pointsDone).toBe(5);
    expect(stats.tasksDone).toBe(2);
  });

  it('computes completion percentage rounded to one decimal', () => {
    const tasks = [
      makeTask({ sprint_id: 's1', status: 'done' }),
      makeTask({ sprint_id: 's1', status: 'todo' }),
      makeTask({ sprint_id: 's1', status: 'todo' }),
    ];
    // 1/3 = 33.333... → 33.3
    expect(computeSprintStats(tasks, 's1').completionPct).toBe(33.3);
  });

  it('reports 100% when all tasks are done', () => {
    const tasks = [
      makeTask({ sprint_id: 's1', status: 'done' }),
      makeTask({ sprint_id: 's1', status: 'done' }),
    ];
    expect(computeSprintStats(tasks, 's1').completionPct).toBe(100);
  });
});
