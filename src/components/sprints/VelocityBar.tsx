import { clsx } from 'clsx';

interface VelocityBarProps {
  done: number;
  total: number;
  pointsDone?: number;
  pointsTotal?: number;
  size?: 'sm' | 'md';
}

/** Horizontal completion bar for a sprint, with task and (optional) point counts. */
export function VelocityBar({ done, total, pointsDone, pointsTotal, size = 'md' }: VelocityBarProps) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          {done}/{total} tasks
        </span>
        <span className="font-medium text-slate-700">{pct}%</span>
      </div>
      <div className={clsx('w-full overflow-hidden rounded-full bg-slate-100', size === 'sm' ? 'h-1.5' : 'h-2.5')}>
        <div
          className={clsx(
            'h-full rounded-full transition-all',
            pct === 100 ? 'bg-green-500' : 'bg-brand-500'
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      {pointsTotal !== undefined && pointsDone !== undefined && (
        <span className="text-xs text-slate-400">
          {pointsDone}/{pointsTotal} story points
        </span>
      )}
    </div>
  );
}
