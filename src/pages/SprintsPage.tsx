import { useEffect } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useSprints } from '@/hooks/useSprints';
import { useTasks } from '@/hooks/useTasks';
import { openSprintModal } from '@/store/uiSlice';
import { SprintList } from '@/components/sprints/SprintList';
import { SprintModal } from '@/components/sprints/SprintModal';
import { Button } from '@/components/shared/Button';
import { Spinner } from '@/components/shared/Spinner';
import { EmptyState } from '@/components/shared/EmptyState';

export default function SprintsPage() {
  const dispatch = useAppDispatch();
  const { sprints, status, loadSprints } = useSprints();
  const { tasks, loadTasks } = useTasks();

  useEffect(() => {
    loadSprints();
    // Tasks power the velocity bars on each card.
    if (tasks.length === 0) loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadSprints, loadTasks]);

  const loading = status === 'loading' && sprints.length === 0;

  return (
    <div className="mx-auto max-w-6xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sprints</h1>
          <p className="mt-1 text-sm text-slate-500">{sprints.length} total</p>
        </div>
        <Button onClick={() => dispatch(openSprintModal(null))}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New sprint
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : sprints.length === 0 ? (
        <EmptyState
          title="No sprints yet"
          description="Group your tasks into sprints to track velocity over time."
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
          action={<Button onClick={() => dispatch(openSprintModal(null))}>Create sprint</Button>}
        />
      ) : (
        <SprintList sprints={sprints} />
      )}

      <SprintModal />
    </div>
  );
}
