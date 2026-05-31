import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { VelocityDatum } from '@/hooks/useAnalytics';

export function VelocityChart({ data }: { data: VelocityDatum[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="sprint"
          tick={{ fontSize: 12, fill: '#64748b' }}
          tickLine={false}
          axisLine={{ stroke: '#e2e8f0' }}
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#64748b' }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13 }}
          cursor={{ fill: '#f8fafc' }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="pointsTotal" name="Committed" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
        <Bar dataKey="pointsDone" name="Completed" fill="#1f59eb" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
