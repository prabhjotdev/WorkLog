/**
 * App root. For Phase 1 this renders a placeholder landing screen confirming the
 * scaffold works. Phase 2 will replace this with the Redux Provider, router, and
 * Supabase auth subscription.
 */
export default function App() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6 text-center">
      <div className="max-w-md">
        <span className="inline-flex items-center rounded-full bg-brand-100 px-3 py-1 text-sm font-medium text-brand-700">
          Phase 1 · Scaffold ready
        </span>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900">
          WorkLog
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          Track your work. Prove your impact.
        </p>
        <p className="mt-6 text-sm text-slate-500">
          React + TypeScript + Tailwind + Redux Toolkit + Supabase scaffold is up
          and running.
        </p>
      </div>
    </div>
  );
}
