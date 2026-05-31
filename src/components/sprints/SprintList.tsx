import { SprintCard } from './SprintCard';
import type { Sprint } from '@/types/app';

export function SprintList({ sprints }: { sprints: Sprint[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {sprints.map((sprint) => (
        <SprintCard key={sprint.id} sprint={sprint} />
      ))}
    </div>
  );
}
