import { clsx } from 'clsx';

interface MetricCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon?: React.ReactNode;
  accent?: 'brand' | 'green' | 'amber' | 'red';
}

const accentStyles = {
  brand: 'bg-brand-50 text-brand-600',
  green: 'bg-green-50 text-green-600',
  amber: 'bg-amber-50 text-amber-600',
  red: 'bg-red-50 text-red-600',
};

export function MetricCard({ label, value, hint, icon, accent = 'brand' }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        {icon && (
          <span className={clsx('flex h-8 w-8 items-center justify-center rounded-lg', accentStyles[accent])}>
            {icon}
          </span>
        )}
      </div>
      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
