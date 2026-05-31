import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { profile } = useAuth();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-900">
        Welcome back{profile?.display_name ? `, ${profile.display_name}` : ''}!
      </h1>
      <p className="mt-2 text-slate-500">Dashboard — coming in Phase 4.</p>
    </div>
  );
}
