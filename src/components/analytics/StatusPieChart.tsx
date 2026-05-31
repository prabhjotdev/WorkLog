import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { StatusDatum } from '@/hooks/useAnalytics';
import type { TaskStatus } from '@/lib/constants';

const COLORS: Record<TaskStatus, string> = {
  todo: '#94a3b8',
  in_progress: '#3377f6',
  done: '#22c55e',
  blocked: '#ef4444',
};

export function StatusPieChart({ data }: { data: StatusDatum[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={2}
        >
          {data.map((entry) => (
            <Cell key={entry.status} fill={COLORS[entry.status]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13 }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
