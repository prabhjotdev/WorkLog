import { Badge } from '@/components/shared/Badge';
import {
  TASK_STATUS_LABELS,
  TASK_STATUS_STYLES,
  TASK_PRIORITY_LABELS,
  TASK_PRIORITY_STYLES,
  type TaskStatus,
  type TaskPriority,
} from '@/lib/constants';

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return <Badge className={TASK_STATUS_STYLES[status]}>{TASK_STATUS_LABELS[status]}</Badge>;
}

export function TaskPriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <Badge className={TASK_PRIORITY_STYLES[priority]}>{TASK_PRIORITY_LABELS[priority]}</Badge>
  );
}
