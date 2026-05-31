import { useParams } from 'react-router-dom';

export default function SprintPage() {
  const { sprintId } = useParams();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-900">Sprint detail</h1>
      <p className="mt-2 text-slate-500">Sprint {sprintId} — coming in Phase 4.</p>
    </div>
  );
}
