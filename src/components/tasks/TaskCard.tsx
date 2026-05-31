import { clsx } from 'clsx';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { useTasks } from '@/hooks/useTasks';
import { openTaskModal, openGapModal } from '@/store/uiSlice';
import { TaskStatusBadge, TaskPriorityBadge } from './TaskStatusBadge';
import { Badge } from '@/components/shared/Badge';
import { TASK_STATUSES, TASK_STATUS_LABELS } from '@/lib/constants';
import { formatDate, isOverdue } from '@/utils/formatDate';
import type { Task } from '@/types/app';

export function TaskCard({ task }: { task: Task }) {
  const dispatch = useAppDispatch();
  const sprints = useAppSelector((s) => s.sprints.items);
  const { changeStatus, deleteTask } = useTasks();

  const sprint = task.sprint_id ? sprints.find((s) => s.id === task.sprint_id) : null;
  const overdue = task.status !== 'done' && isOverdue(task.due_date);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3
            className={clsx(
              'truncate text-sm font-semibold',
              task.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-900'
            )}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="mt-1 line-clamp-2 text-sm text-slate-500">{task.description}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={() => dispatch(openTaskModal(task.id))}
            title="Edit"
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete "${task.title}"?`)) deleteTask(task.id);
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

      {/* Meta row */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <TaskStatusBadge status={task.status} />
        <TaskPriorityBadge priority={task.priority} />
        {sprint && <Badge className="bg-brand-50 text-brand-700">{sprint.name}</Badge>}
        {task.story_points > 0 && (
          <Badge className="bg-slate-100 text-slate-600">{task.story_points} pts</Badge>
        )}
        {task.due_date && (
          <span className={clsx('text-xs', overdue ? 'font-medium text-red-600' : 'text-slate-500')}>
            {overdue ? 'Overdue · ' : 'Due '}
            {formatDate(task.due_date)}
          </span>
        )}
      </div>

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {task.tags.map((tag) => (
            <span key={tag} className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Inline status switcher */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3">
        <span className="mr-1 text-xs text-slate-400">Move to:</span>
        {TASK_STATUSES.filter((s) => s !== task.status).map((s) => (
          <button
            key={s}
            onClick={() => changeStatus(task.id, s)}
            className="rounded-md px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          >
            {TASK_STATUS_LABELS[s]}
          </button>
        ))}
        {task.status === 'blocked' && (
          <button
            onClick={() => dispatch(openGapModal(null))}
            className="ml-auto rounded-md px-2 py-1 text-xs font-medium text-amber-600 hover:bg-amber-50"
            title="Log a knowledge gap for this blocker"
          >
            Log gap
          </button>
        )}
      </div>
    </div>
  );
}
