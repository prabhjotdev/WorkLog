import { useEffect } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useSprints } from '@/hooks/useSprints';
import { useGaps } from '@/hooks/useGaps';
import { useAnalytics } from '@/hooks/useAnalytics';
import { MetricCard } from '@/components/analytics/MetricCard';
import { ChartCard } from '@/components/analytics/ChartCard';
import { VelocityChart } from '@/components/analytics/VelocityChart';
import { StatusPieChart } from '@/components/analytics/StatusPieChart';
import { CompletionTrend } from '@/components/analytics/CompletionTrend';
import { Spinner } from '@/components/shared/Spinner';
import { EmptyState } from '@/components/shared/EmptyState';

export default function AnalyticsPage() {
  const { tasks, status: taskStatus, loadTasks } = useTasks();
  const { loadSprints } = useSprints();
  const { loadGaps } = useGaps();
  const { velocityData, statusData, trendData, summary, hasData } = useAnalytics();

  useEffect(() => {
    loadTasks();
    loadSprints();
    loadGaps();
  }, [loadTasks, loadSprints, loadGaps]);

  const loading = taskStatus === 'loading' && tasks.length === 0;

  return (
    <div className="mx-auto max-w-6xl p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="mt-1 text-sm text-slate-500">Your productivity patterns and trends.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : !hasData ? (
        <EmptyState
          title="No data to analyze yet"
          description="Create and complete some tasks to see your productivity analytics."
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard label="Total tasks completed" value={summary.totalDone} accent="green" />
            <MetricCard label="Avg velocity / sprint" value={summary.avgVelocity} hint="story points" accent="brand" />
            <MetricCard label="Most-used tag" value={summary.topTag ? `#${summary.topTag}` : '—'} accent="amber" />
            <MetricCard label="Gap resolution rate" value={`${summary.gapResolutionRate}%`} accent="brand" />
          </div>

          {/* Charts */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="lg:col-span-2">
              <ChartCard title="Sprint velocity" subtitle="Story points committed vs. completed per sprint">
                {velocityData.length > 0 ? (
                  <VelocityChart data={velocityData} />
                ) : (
                  <p className="py-12 text-center text-sm text-slate-400">No sprints yet.</p>
                )}
              </ChartCard>
            </div>

            <ChartCard title="Completion trend" subtitle="Tasks completed per week (last 8 weeks)">
              <CompletionTrend data={trendData} />
            </ChartCard>

            <ChartCard title="Task status breakdown" subtitle="Current distribution across all tasks">
              {statusData.length > 0 ? (
                <StatusPieChart data={statusData} />
              ) : (
                <p className="py-12 text-center text-sm text-slate-400">No tasks yet.</p>
              )}
            </ChartCard>
          </div>
        </>
      )}
    </div>
  );
}
