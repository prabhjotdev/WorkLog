import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { isWithinInterval, subDays } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { useSprints } from '@/hooks/useSprints';
import { useGaps } from '@/hooks/useGaps';
import { MetricCard } from '@/components/analytics/MetricCard';
import { VelocityBar } from '@/components/sprints/VelocityBar';
import { SprintStatusBadge } from '@/components/sprints/SprintStatusBadge';
import { TaskCard } from '@/components/tasks/TaskCard';
import { Spinner } from '@/components/shared/Spinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { computeSprintStats } from '@/utils/computeVelocity';

export default function DashboardPage() {
  const { profile } = useAuth();
  const { tasks, status: taskStatus, loadTasks } = useTasks();
  const { sprints, loadSprints } = useSprints();
  const { gaps, loadGaps } = useGaps();

  useEffect(() => {
    loadTasks();
    loadSprints();
    loadGaps();
  }, [loadTasks, loadSprints, loadGaps]);

  const metrics = useMemo(() => {
    const weekAgo = subDays(new Date(), 7);
    const doneThisWeek = tasks.filter(
      (t) =>
        t.status === 'done' &&
        t.completed_at &&
        isWithinInterval(new Date(t.completed_at), { start: weekAgo, end: new Date() })
    ).length;
    const blocked = tasks.filter((t) => t.status === 'blocked').length;
    const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
    const openTasks = tasks.filter((t) => t.status !== 'done').length;
    const openGaps = gaps.filter((g) => !g.resolved).length;
    return { doneThisWeek, blocked, inProgress, openTasks, openGaps };
  }, [tasks, gaps]);

  const activeSprint = useMemo(
    () => sprints.find((s) => s.status === 'active') ?? null,
    [sprints]
  );
  const activeStats = activeSprint ? computeSprintStats(tasks, activeSprint.id) : null;

  const recentTasks = useMemo(
    () =>
      [...tasks]
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .slice(0, 4),
    [tasks]
  );

  const loading = taskStatus === 'loading' && tasks.length === 0;

  return (
    <div className="mx-auto max-w-6xl p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back{profile?.display_name ? `, ${profile.display_name}` : ''}!
        </h1>
        <p className="mt-1 text-sm text-slate-500">Here's your work at a glance.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {/* Metrics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <MetricCard
              label="Completed this week"
              value={metrics.doneThisWeek}
              accent="green"
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              }
            />
            <MetricCard
              label="In progress"
              value={metrics.inProgress}
              accent="brand"
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            />
            <MetricCard
              label="Open tasks"
              value={metrics.openTasks}
              accent="amber"
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
                </svg>
              }
            />
            <MetricCard
              label="Blocked"
              value={metrics.blocked}
              accent="red"
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              }
            />
            <MetricCard
              label="Open knowledge gaps"
              value={metrics.openGaps}
              accent="amber"
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              }
            />
          </div>

          {/* Active sprint + recent tasks */}
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Active sprint */}
            <div className="lg:col-span-1">
              <h2 className="mb-3 text-sm font-semibold text-slate-700">Active sprint</h2>
              {activeSprint && activeStats ? (
                <Link
                  to={`/sprints/${activeSprint.id}`}
                  className="block rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="truncate font-semibold text-slate-900">{activeSprint.name}</h3>
                    <SprintStatusBadge status={activeSprint.status} />
                  </div>
                  {activeSprint.goal && (
                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">{activeSprint.goal}</p>
                  )}
                  <div className="mt-4">
                    <VelocityBar
                      done={activeStats.tasksDone}
                      total={activeStats.tasksTotal}
                      pointsDone={activeStats.pointsDone}
                      pointsTotal={activeStats.pointsTotal}
                    />
                  </div>
                </Link>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-500">
                  No active sprint.{' '}
                  <Link to="/sprints" className="font-medium text-brand-600 hover:text-brand-700">
                    Start one →
                  </Link>
                </div>
              )}
            </div>

            {/* Recent tasks */}
            <div className="lg:col-span-2">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-700">Recent activity</h2>
                <Link to="/tasks" className="text-sm font-medium text-brand-600 hover:text-brand-700">
                  View all
                </Link>
              </div>
              {recentTasks.length === 0 ? (
                <EmptyState title="No tasks yet" description="Create a task to get started." />
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {recentTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
