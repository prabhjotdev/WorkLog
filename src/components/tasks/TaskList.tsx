import { TaskCard } from './TaskCard';
import type { Task } from '@/types/app';

export function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
