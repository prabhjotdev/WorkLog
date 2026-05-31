import { clsx } from 'clsx';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { setTaskFilters, clearTaskFilters } from '@/store/uiSlice';
import { Input } from '@/components/shared/Input';
import {
  TASK_STATUSES,
  TASK_PRIORITIES,
  TASK_STATUS_LABELS,
  TASK_PRIORITY_LABELS,
} from '@/lib/constants';

/** Toggle a value within a string[] filter array. */
function toggle(arr: string[], value: string): string[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

export function TaskFilters() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((s) => s.ui.taskFilters);
  const sprints = useAppSelector((s) => s.sprints.items);

  const hasActiveFilters =
    filters.status.length > 0 ||
    filters.priority.length > 0 ||
    filters.sprintId !== null ||
    filters.search !== '';

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-[200px] flex-1">
          <Input
            placeholder="Search tasks…"
            value={filters.search}
            onChange={(e) => dispatch(setTaskFilters({ search: e.target.value }))}
          />
        </div>
        <select
          value={filters.sprintId ?? ''}
          onChange={(e) => dispatch(setTaskFilters({ sprintId: e.target.value || null }))}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        >
          <option value="">All sprints</option>
          {sprints.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        {hasActiveFilters && (
          <button
            onClick={() => dispatch(clearTaskFilters())}
            className="text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs font-medium text-slate-400">Status:</span>
          {TASK_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => dispatch(setTaskFilters({ status: toggle(filters.status, s) }))}
              className={clsx(
                'rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
                filters.status.includes(s)
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              {TASK_STATUS_LABELS[s]}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs font-medium text-slate-400">Priority:</span>
          {TASK_PRIORITIES.map((p) => (
            <button
              key={p}
              onClick={() => dispatch(setTaskFilters({ priority: toggle(filters.priority, p) }))}
              className={clsx(
                'rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
                filters.priority.includes(p)
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              {TASK_PRIORITY_LABELS[p]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
