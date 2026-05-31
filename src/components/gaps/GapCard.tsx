import { clsx } from 'clsx';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { useGaps } from '@/hooks/useGaps';
import { openGapModal } from '@/store/uiSlice';
import { Badge } from '@/components/shared/Badge';
import { formatDate } from '@/utils/formatDate';
import type { KnowledgeGap } from '@/types/app';

export function GapCard({ gap }: { gap: KnowledgeGap }) {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((s) => s.tasks.items);
  const { resolveGap, reopenGap, incrementRecurrence, deleteGap } = useGaps();

  const linkedTask = gap.task_id ? tasks.find((t) => t.id === gap.task_id) : null;

  return (
    <div
      className={clsx(
        'rounded-xl border bg-white p-5 transition-shadow hover:shadow-sm',
        gap.resolved ? 'border-slate-200 opacity-70' : 'border-slate-200'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3
            className={clsx(
              'text-sm font-semibold',
              gap.resolved ? 'text-slate-400 line-through' : 'text-slate-900'
            )}
          >
            {gap.title}
          </h3>
          {gap.description && (
            <p className="mt-1 line-clamp-2 text-sm text-slate-500">{gap.description}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={() => dispatch(openGapModal(gap.id))}
            title="Edit"
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete "${gap.title}"?`)) deleteGap(gap.id);
            }}
            title="Delete"
            className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Meta */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {gap.resolved ? (
          <Badge className="bg-green-100 text-green-700">Resolved</Badge>
        ) : (
          <Badge className="bg-amber-100 text-amber-700">Open</Badge>
        )}
        {gap.category && (
          <Badge className="bg-slate-100 text-slate-600">
            {gap.category[0].toUpperCase() + gap.category.slice(1)}
          </Badge>
        )}
        <span
          title="Times this has come up"
          className={clsx(
            'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
            gap.recurrence >= 3
              ? 'bg-red-100 text-red-700'
              : gap.recurrence === 2
              ? 'bg-amber-100 text-amber-700'
              : 'bg-slate-100 text-slate-600'
          )}
        >
          ×{gap.recurrence}
        </span>
        {linkedTask && (
          <Badge className="bg-brand-50 text-brand-700">
            {linkedTask.title.length > 25 ? linkedTask.title.slice(0, 25) + '…' : linkedTask.title}
          </Badge>
        )}
      </div>

      {gap.resolved && gap.resolved_at && (
        <p className="mt-2 text-xs text-slate-400">Resolved {formatDate(gap.resolved_at)}</p>
      )}

      {/* Footer actions */}
      <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
        {!gap.resolved ? (
          <button
            onClick={() => resolveGap(gap.id)}
            className="rounded-md px-2.5 py-1 text-xs font-medium text-green-700 hover:bg-green-50"
          >
            ✓ Mark resolved
          </button>
        ) : (
          <button
            onClick={() => reopenGap(gap.id)}
            className="rounded-md px-2.5 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100"
          >
            Reopen
          </button>
        )}
        {!gap.resolved && (
          <button
            onClick={() => incrementRecurrence(gap.id, gap.recurrence)}
            title="Hit this blocker again"
            className="rounded-md px-2.5 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100"
          >
            +1 recurrence
          </button>
        )}
      </div>
    </div>
  );
}
