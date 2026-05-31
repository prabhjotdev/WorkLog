import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { useTasks } from '@/hooks/useTasks';
import { openTaskModal } from '@/store/uiSlice';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskModal } from '@/components/tasks/TaskModal';
import { Button } from '@/components/shared/Button';
import { Spinner } from '@/components/shared/Spinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { filterTasks } from '@/utils/filterTasks';

export default function TasksPage() {
  const dispatch = useAppDispatch();
  const { tasks, status, loadTasks } = useTasks();
  const filters = useAppSelector((s) => s.ui.taskFilters);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const filtered = useMemo(() => filterTasks(tasks, filters), [tasks, filters]);
  const loading = status === 'loading' && tasks.length === 0;

  return (
    <div className="mx-auto max-w-6xl p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
          <p className="mt-1 text-sm text-slate-500">
            {tasks.length} total · {filtered.length} shown
          </p>
        </div>
        <Button onClick={() => dispatch(openTaskModal(null))}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New task
        </Button>
      </div>

      <div className="mb-6">
        <TaskFilters />
      </div>

      {/* Body */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          title="No tasks yet"
          description="Create your first task to start tracking your work."
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          action={
            <Button onClick={() => dispatch(openTaskModal(null))}>Create task</Button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No matching tasks"
          description="Try adjusting or clearing your filters."
        />
      ) : (
        <TaskList tasks={filtered} />
      )}

      <TaskModal />
    </div>
  );
}
