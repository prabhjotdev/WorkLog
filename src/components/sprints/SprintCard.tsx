import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { useSprints } from '@/hooks/useSprints';
import { openSprintModal } from '@/store/uiSlice';
import { SprintStatusBadge } from './SprintStatusBadge';
import { VelocityBar } from './VelocityBar';
import { computeSprintStats } from '@/utils/computeVelocity';
import { formatDate } from '@/utils/formatDate';
import type { Sprint } from '@/types/app';

export function SprintCard({ sprint }: { sprint: Sprint }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((s) => s.tasks.items);
  const { deleteSprint } = useSprints();

  const stats = computeSprintStats(tasks, sprint.id);
  const dateRange =
    sprint.start_date || sprint.end_date
      ? `${formatDate(sprint.start_date) || '?'} – ${formatDate(sprint.end_date) || '?'}`
      : 'No dates set';

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <button
          onClick={() => navigate(`/sprints/${sprint.id}`)}
          className="min-w-0 flex-1 text-left"
        >
          <h3 className="truncate text-base font-semibold text-slate-900 hover:text-brand-600">
            {sprint.name}
          </h3>
          <p className="mt-0.5 text-xs text-slate-400">{dateRange}</p>
        </button>
        <div className="flex shrink-0 items-center gap-1">
          <SprintStatusBadge status={sprint.status} />
        </div>
      </div>

      {sprint.goal && (
        <p className="mt-2 line-clamp-2 text-sm text-slate-500">{sprint.goal}</p>
      )}

      <div className="mt-4">
        <VelocityBar
          done={stats.tasksDone}
          total={stats.tasksTotal}
          pointsDone={stats.pointsDone}
          pointsTotal={stats.pointsTotal}
        />
      </div>

      <div className="mt-4 flex items-center justify-end gap-1 border-t border-slate-100 pt-3">
        <button
          onClick={() => navigate(`/sprints/${sprint.id}`)}
          className="rounded-md px-2.5 py-1 text-xs font-medium text-brand-600 hover:bg-brand-50"
        >
          View
        </button>
        <button
          onClick={() => dispatch(openSprintModal(sprint.id))}
          className="rounded-md px-2.5 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100"
        >
          Edit
        </button>
        <button
          onClick={() => {
            if (confirm(`Delete sprint "${sprint.name}"? Tasks will be unassigned.`))
              deleteSprint(sprint.id);
          }}
          className="rounded-md px-2.5 py-1 text-xs font-medium text-slate-500 hover:bg-red-50 hover:text-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
