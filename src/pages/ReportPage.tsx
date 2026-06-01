import { useEffect, useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useSprints } from '@/hooks/useSprints';
import { useGaps } from '@/hooks/useGaps';
import { ReportGenerator } from '@/components/reports/ReportGenerator';
import { ReportPreview } from '@/components/reports/ReportPreview';
import { CopyReportButton } from '@/components/reports/CopyReportButton';
import { Spinner } from '@/components/shared/Spinner';
import { generateReport, type ReportOptions } from '@/utils/generateReport';

const DEFAULT_OPTIONS: ReportOptions = {
  sprintIds: [],
  dateFrom: null,
  dateUntil: null,
  includeGaps: true,
  includeStats: true,
};

export default function ReportPage() {
  const { tasks, status: taskStatus, loadTasks } = useTasks();
  const { sprints, loadSprints } = useSprints();
  const { gaps, loadGaps } = useGaps();

  const [options, setOptions] = useState<ReportOptions>(DEFAULT_OPTIONS);
  const [report, setReport] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
    loadSprints();
    loadGaps();
  }, [loadTasks, loadSprints, loadGaps]);

  const loading = taskStatus === 'loading' && tasks.length === 0;

  function handleChange(partial: Partial<ReportOptions>) {
    setOptions((prev) => ({ ...prev, ...partial }));
    // Clear preview when settings change so stale output isn't shown.
    setReport(null);
  }

  function handleGenerate() {
    const text = generateReport(tasks, sprints, gaps, options);
    setReport(text);
  }

  return (
    <div className="mx-auto max-w-5xl p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Performance Report</h1>
        <p className="mt-1 text-sm text-slate-500">
          Generate a review-ready summary of your completed work, velocity, and learning areas.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(280px,360px)_1fr]">
          {/* Controls */}
          <div>
            <ReportGenerator
              sprints={sprints}
              options={options}
              onChange={handleChange}
              onGenerate={handleGenerate}
            />
          </div>

          {/* Preview */}
          <div>
            {report ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-700">Preview</h2>
                  <CopyReportButton text={report} />
                </div>
                <ReportPreview text={report} />
              </div>
            ) : (
              <div className="flex h-full min-h-[400px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white">
                <div className="text-center">
                  <svg
                    className="mx-auto mb-3 h-10 w-10 text-slate-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm text-slate-400">
                    Configure your report and click <strong className="text-slate-600">Generate report</strong>.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
