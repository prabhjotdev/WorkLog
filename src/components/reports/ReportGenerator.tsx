import { clsx } from 'clsx';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import type { Sprint } from '@/types/app';
import type { ReportOptions } from '@/utils/generateReport';

interface ReportGeneratorProps {
  sprints: Sprint[];
  options: ReportOptions;
  onChange: (opts: Partial<ReportOptions>) => void;
  onGenerate: () => void;
}

function toggleId(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id];
}

export function ReportGenerator({ sprints, options, onChange, onGenerate }: ReportGeneratorProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="mb-4 text-sm font-semibold text-slate-900">Report scope</h2>

      {/* Sprint selector */}
      {sprints.length > 0 && (
        <div className="mb-5">
          <p className="mb-2 text-xs font-medium text-slate-500">Select sprints</p>
          <div className="flex flex-wrap gap-2">
            {sprints.map((s) => {
              const selected = options.sprintIds.includes(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => onChange({ sprintIds: toggleId(options.sprintIds, s.id) })}
                  className={clsx(
                    'rounded-full px-3 py-1 text-sm font-medium transition-colors',
                    selected
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  )}
                >
                  {s.name}
                </button>
              );
            })}
          </div>
          {options.sprintIds.length > 0 && (
            <button
              onClick={() => onChange({ sprintIds: [] })}
              className="mt-2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear sprint selection
            </button>
          )}
        </div>
      )}

      {/* Date range — shown when no sprint selected, or as additional filter */}
      <div className="mb-5">
        <p className="mb-2 text-xs font-medium text-slate-500">
          {options.sprintIds.length > 0 ? 'Narrow by date (optional)' : 'Date range'}
        </p>
        <div className="flex items-center gap-3">
          <Input
            type="date"
            value={options.dateFrom ?? ''}
            onChange={(e) => onChange({ dateFrom: e.target.value || null })}
          />
          <span className="text-slate-400">–</span>
          <Input
            type="date"
            value={options.dateUntil ?? ''}
            onChange={(e) => onChange({ dateUntil: e.target.value || null })}
          />
        </div>
      </div>

      {/* Options */}
      <div className="mb-6 flex flex-col gap-2">
        <label className="flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            checked={options.includeStats}
            onChange={(e) => onChange({ includeStats: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          />
          <span className="text-sm text-slate-700">Include summary stats</span>
        </label>
        <label className="flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            checked={options.includeGaps}
            onChange={(e) => onChange({ includeGaps: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          />
          <span className="text-sm text-slate-700">Include knowledge gaps</span>
        </label>
      </div>

      <Button onClick={onGenerate} className="w-full">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Generate report
      </Button>
    </div>
  );
}
