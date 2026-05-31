import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { useSprints } from '@/hooks/useSprints';
import { useTasks } from '@/hooks/useTasks';
import { openSprintModal, openTaskModal } from '@/store/uiSlice';
import { SprintStatusBadge } from '@/components/sprints/SprintStatusBadge';
import { VelocityBar } from '@/components/sprints/VelocityBar';
import { SprintModal } from '@/components/sprints/SprintModal';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskModal } from '@/components/tasks/TaskModal';
import { Button } from '@/components/shared/Button';
import { Spinner } from '@/components/shared/Spinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { computeSprintStats } from '@/utils/computeVelocity';
import { formatDate } from '@/utils/formatDate';

export default function SprintPage() {
  const { sprintId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { sprints, status, loadSprints } = useSprints();
  const { tasks, loadTasks } = useTasks();

  useEffect(() => {
    if (sprints.length === 0) loadSprints();
    if (tasks.length === 0) loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sprint = useAppSelector((s) => s.sprints.items.find((sp) => sp.id === sprintId));
  const sprintTasks = tasks.filter((t) => t.sprint_id === sprintId);

  if (status === 'loading' && sprints.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!sprint) {
    return (
      <div className="mx-auto max-w-4xl p-8">
        <EmptyState
          title="Sprint not found"
          description="This sprint may have been deleted."
          action={<Button onClick={() => navigate('/sprints')}>Back to sprints</Button>}
        />
      </div>
    );
  }

  const stats = computeSprintStats(tasks, sprint.id);
  const dateRange =
    sprint.start_date || sprint.end_date
      ? `${formatDate(sprint.start_date) || '?'} – ${formatDate(sprint.end_date) || '?'}`
      : 'No dates set';

  return (
    <div className="mx-auto max-w-5xl p-8">
      {/* Breadcrumb */}
      <Link to="/sprints" className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Sprints
      </Link>

      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{sprint.name}</h1>
              <SprintStatusBadge status={sprint.status} />
            </div>
            <p className="mt-1 text-sm text-slate-400">{dateRange}</p>
            {sprint.goal && <p className="mt-3 max-w-2xl text-sm text-slate-600">{sprint.goal}</p>}
          </div>
          <Button variant="secondary" size="sm" onClick={() => dispatch(openSprintModal(sprint.id))}>
            Edit sprint
          </Button>
        </div>

        <div className="mt-6 max-w-md">
          <VelocityBar
            done={stats.tasksDone}
            total={stats.tasksTotal}
            pointsDone={stats.pointsDone}
            pointsTotal={stats.pointsTotal}
          />
        </div>
      </div>

      {/* Tasks */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Tasks <span className="text-sm font-normal text-slate-400">({sprintTasks.length})</span>
          </h2>
          <Button size="sm" onClick={() => dispatch(openTaskModal(null))}>
            Add task
          </Button>
        </div>

        {sprintTasks.length === 0 ? (
          <EmptyState
            title="No tasks in this sprint"
            description="Assign tasks to this sprint from the task form."
          />
        ) : (
          <TaskList tasks={sprintTasks} />
        )}
      </div>

      <SprintModal />
      <TaskModal />
    </div>
  );
}
