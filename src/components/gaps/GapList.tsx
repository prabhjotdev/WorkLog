import { GapCard } from './GapCard';
import type { KnowledgeGap } from '@/types/app';

export function GapList({ gaps }: { gaps: KnowledgeGap[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {gaps.map((gap) => (
        <GapCard key={gap.id} gap={gap} />
      ))}
    </div>
  );
}
