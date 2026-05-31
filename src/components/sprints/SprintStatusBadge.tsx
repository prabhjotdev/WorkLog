import { Badge } from '@/components/shared/Badge';
import { SPRINT_STATUS_LABELS, type SprintStatus } from '@/lib/constants';

const STYLES: Record<SprintStatus, string> = {
  planned: 'bg-slate-100 text-slate-600',
  active: 'bg-brand-100 text-brand-700',
  completed: 'bg-green-100 text-green-700',
};

export function SprintStatusBadge({ status }: { status: SprintStatus }) {
  return <Badge className={STYLES[status]}>{SPRINT_STATUS_LABELS[status]}</Badge>;
}
