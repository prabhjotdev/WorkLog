import { useMemo } from 'react';
import { format, startOfWeek, subWeeks, isAfter } from 'date-fns';
import { useAppSelector } from './useAppDispatch';
import { computeSprintStats } from '@/utils/computeVelocity';
import { TASK_STATUSES, TASK_STATUS_LABELS, type TaskStatus } from '@/lib/constants';

export interface VelocityDatum {
  sprint: string;
  pointsDone: number;
  pointsTotal: number;
  tasksDone: number;
}

export interface StatusDatum {
  status: TaskStatus;
  label: string;
  value: number;
}

export interface TrendDatum {
  week: string;
  completed: number;
}

export interface AnalyticsSummary {
  totalDone: number;
  avgVelocity: number;
  topTag: string | null;
  gapResolutionRate: number;
}

/**
 * Derives all chart + KPI data from the Redux store. Pure/in-memory — no extra
 * Supabase calls. Recomputes only when tasks/sprints/gaps change.
 */
export function useAnalytics() {
  const tasks = useAppSelector((s) => s.tasks.items);
  const sprints = useAppSelector((s) => s.sprints.items);
  const gaps = useAppSelector((s) => s.gaps.items);

  const velocityData = useMemo<VelocityDatum[]>(() => {
    return sprints.map((sprint) => {
      const stats = computeSprintStats(tasks, sprint.id);
      return {
        sprint: sprint.name,
        pointsDone: stats.pointsDone,
        pointsTotal: stats.pointsTotal,
        tasksDone: stats.tasksDone,
      };
    });
  }, [sprints, tasks]);

  const statusData = useMemo<StatusDatum[]>(() => {
    return TASK_STATUSES.map((status) => ({
      status,
      label: TASK_STATUS_LABELS[status],
      value: tasks.filter((t) => t.status === status).length,
    })).filter((d) => d.value > 0);
  }, [tasks]);

  const trendData = useMemo<TrendDatum[]>(() => {
    // Last 8 weeks of completed-task counts, bucketed by week-start.
    const now = new Date();
    const weeks: { start: Date; label: string }[] = [];
    for (let i = 7; i >= 0; i--) {
      const start = startOfWeek(subWeeks(now, i), { weekStartsOn: 1 });
      weeks.push({ start, label: format(start, 'MMM d') });
    }
    return weeks.map((w, idx) => {
      const next = weeks[idx + 1]?.start ?? now;
      const completed = tasks.filter((t) => {
        if (t.status !== 'done' || !t.completed_at) return false;
        const done = new Date(t.completed_at);
        return isAfter(done, w.start) && !isAfter(done, next);
      }).length;
      return { week: w.label, completed };
    });
  }, [tasks]);

  const summary = useMemo<AnalyticsSummary>(() => {
    const totalDone = tasks.filter((t) => t.status === 'done').length;

    const completedSprints = velocityData.filter((v) => v.pointsDone > 0);
    const avgVelocity =
      completedSprints.length === 0
        ? 0
        : Math.round(
            (completedSprints.reduce((sum, v) => sum + v.pointsDone, 0) /
              completedSprints.length) *
              10
          ) / 10;

    // Most-used tag across all tasks
    const tagCounts = new Map<string, number>();
    tasks.forEach((t) => t.tags.forEach((tag) => tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1)));
    const topTag =
      tagCounts.size === 0
        ? null
        : [...tagCounts.entries()].sort((a, b) => b[1] - a[1])[0][0];

    const resolvedGaps = gaps.filter((g) => g.resolved).length;
    const gapResolutionRate =
      gaps.length === 0 ? 0 : Math.round((resolvedGaps / gaps.length) * 100);

    return { totalDone, avgVelocity, topTag, gapResolutionRate };
  }, [tasks, gaps, velocityData]);

  return { velocityData, statusData, trendData, summary, hasData: tasks.length > 0 };
}
