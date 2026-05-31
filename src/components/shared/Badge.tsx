import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

/** Generic pill badge. Pass color classes via className. */
export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        'bg-slate-100 text-slate-700',
        className
      )}
    >
      {children}
    </span>
  );
}
