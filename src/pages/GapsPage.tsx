import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useGaps } from '@/hooks/useGaps';
import { useTasks } from '@/hooks/useTasks';
import { openGapModal } from '@/store/uiSlice';
import { GapList } from '@/components/gaps/GapList';
import { GapModal } from '@/components/gaps/GapModal';
import { Button } from '@/components/shared/Button';
import { Spinner } from '@/components/shared/Spinner';
import { EmptyState } from '@/components/shared/EmptyState';

type Filter = 'all' | 'open' | 'resolved';

const FILTER_OPTIONS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'resolved', label: 'Resolved' },
];

export default function GapsPage() {
  const dispatch = useAppDispatch();
  const { gaps, status, loadGaps } = useGaps();
  const { tasks, loadTasks } = useTasks();
  const [filter, setFilter] = useState<Filter>('all');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    loadGaps();
    if (tasks.length === 0) loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadGaps, loadTasks]);

  const categories = useMemo(
    () => [...new Set(gaps.map((g) => g.category).filter(Boolean) as string[])].sort(),
    [gaps]
  );

  const filtered = useMemo(() => {
    return gaps.filter((g) => {
      if (filter === 'open' && g.resolved) return false;
      if (filter === 'resolved' && !g.resolved) return false;
      if (categoryFilter && g.category !== categoryFilter) return false;
      return true;
    });
  }, [gaps, filter, categoryFilter]);

  // Derived summary counts
  const openCount = gaps.filter((g) => !g.resolved).length;
  const resolvedCount = gaps.filter((g) => g.resolved).length;
  const recurringCount = gaps.filter((g) => !g.resolved && g.recurrence >= 3).length;

  const loading = status === 'loading' && gaps.length === 0;

  return (
    <div className="mx-auto max-w-6xl p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Knowledge Gaps</h1>
          <p className="mt-1 text-sm text-slate-500">
            {openCount} open · {resolvedCount} resolved
            {recurringCount > 0 && (
              <span className="ml-2 font-medium text-red-600">· {recurringCount} recurring (×3+)</span>
            )}
          </p>
        </div>
        <Button onClick={() => dispatch(openGapModal(null))}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Log gap
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={
                filter === opt.value
                  ? 'rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white'
                  : 'rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100'
              }
            >
              {opt.label}
            </button>
          ))}
        </div>

        {categories.length > 0 && (
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c[0].toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        )}

        {(filter !== 'all' || categoryFilter) && (
          <button
            onClick={() => { setFilter('all'); setCategoryFilter(''); }}
            className="text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Body */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : gaps.length === 0 ? (
        <EmptyState
          title="No knowledge gaps logged"
          description="When you hit a blocker or knowledge gap during your work, log it here to track patterns over time."
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          }
          action={<Button onClick={() => dispatch(openGapModal(null))}>Log your first gap</Button>}
        />
      ) : filtered.length === 0 ? (
        <EmptyState title="No matching gaps" description="Try adjusting or clearing your filters." />
      ) : (
        <GapList gaps={filtered} />
      )}

      <GapModal />
    </div>
  );
}
