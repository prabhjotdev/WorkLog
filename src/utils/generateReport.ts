import { format, parseISO, isValid } from 'date-fns';
import type { Task, Sprint, KnowledgeGap } from '@/types/app';

export interface ReportOptions {
  sprintIds: string[];
  dateFrom: string | null;
  dateUntil: string | null;
  includeGaps: boolean;
  includeStats: boolean;
}

function fmt(iso: string | null | undefined): string {
  if (!iso) return '?';
  const d = parseISO(iso);
  return isValid(d) ? format(d, 'MMM d, yyyy') : '?';
}

const PRIORITY_LABEL: Record<Task['priority'], string> = {
  low: 'LOW',
  medium: 'MED',
  high: 'HIGH',
  critical: 'CRIT',
};

/**
 * Pure function — no side effects, no network. Accepts pre-fetched data +
 * options and returns a markdown-flavoured string ready for the report preview
 * and clipboard copy.
 */
export function generateReport(
  tasks: Task[],
  sprints: Sprint[],
  gaps: KnowledgeGap[],
  options: ReportOptions
): string {
  const { sprintIds, dateFrom, dateUntil, includeGaps, includeStats } = options;

  // ── Determine scope ──────────────────────────────────────────────────────
  const selectedSprints = sprints.filter((s) => sprintIds.includes(s.id));
  const sprintTaskIds = new Set(
    tasks.filter((t) => t.sprint_id && sprintIds.includes(t.sprint_id)).map((t) => t.id)
  );

  const inDateRange = (t: Task): boolean => {
    const ts = t.completed_at ?? t.updated_at;
    if (!ts) return false;
    const d = parseISO(ts);
    if (!isValid(d)) return false;
    if (dateFrom && d < parseISO(dateFrom)) return false;
    if (dateUntil && d > parseISO(dateUntil)) return false;
    return true;
  };

  // If sprints are selected, scope by sprint membership; otherwise use date range.
  let scopedTasks: Task[];
  if (sprintIds.length > 0) {
    scopedTasks = tasks.filter((t) => sprintTaskIds.has(t.id));
    if (dateFrom || dateUntil) {
      scopedTasks = scopedTasks.filter(inDateRange);
    }
  } else {
    scopedTasks = dateFrom || dateUntil ? tasks.filter(inDateRange) : tasks;
  }

  const doneTasks = scopedTasks
    .filter((t) => t.status === 'done')
    .sort((a, b) => (b.completed_at ?? b.updated_at).localeCompare(a.completed_at ?? a.updated_at));

  const inProgressTasks = scopedTasks.filter((t) => t.status === 'in_progress');
  const blockedTasks = scopedTasks.filter((t) => t.status === 'blocked');

  const scopedGaps = sprintIds.length > 0
    ? gaps.filter((g) => g.task_id && sprintTaskIds.has(g.task_id))
    : gaps;

  const openGaps = scopedGaps.filter((g) => !g.resolved)
    .sort((a, b) => b.recurrence - a.recurrence);

  const resolvedGaps = scopedGaps.filter((g) => g.resolved);

  // ── Header ───────────────────────────────────────────────────────────────
  const lines: string[] = [];

  if (selectedSprints.length > 0) {
    const sprintNames = selectedSprints.map((s) => s.name).join(', ');
    const earliest = selectedSprints.map((s) => s.start_date).filter(Boolean).sort()[0];
    const latest = selectedSprints.map((s) => s.end_date).filter(Boolean).sort().at(-1);
    lines.push(`# Performance Report — ${sprintNames}`);
    if (earliest || latest) {
      lines.push(`**Period:** ${fmt(earliest)} – ${fmt(latest)}`);
    }
  } else {
    lines.push(`# Performance Report`);
    if (dateFrom || dateUntil) {
      lines.push(`**Period:** ${fmt(dateFrom)} – ${fmt(dateUntil)}`);
    }
  }

  lines.push(`**Generated:** ${format(new Date(), 'MMM d, yyyy')}`);

  // ── Stats summary ─────────────────────────────────────────────────────────
  if (includeStats) {
    lines.push('');
    lines.push('---');
    lines.push('');
    lines.push('## Summary');
    lines.push('');

    const totalPoints = doneTasks.reduce((s, t) => s + (t.story_points ?? 0), 0);

    const statRows = [
      ['Tasks completed', String(doneTasks.length)],
      ['Story points delivered', String(totalPoints)],
      ['Tasks in progress', String(inProgressTasks.length)],
      ['Tasks blocked', String(blockedTasks.length)],
    ];

    if (includeGaps) {
      statRows.push(['Knowledge gaps logged', String(scopedGaps.length)]);
      statRows.push(['Gaps resolved', String(resolvedGaps.length)]);
    }

    if (selectedSprints.length > 0) {
      for (const sprint of selectedSprints) {
        const sprintDone = doneTasks.filter((t) => t.sprint_id === sprint.id);
        const sprintPoints = sprintDone.reduce((s, t) => s + (t.story_points ?? 0), 0);
        const sprintTotal = scopedTasks
          .filter((t) => t.sprint_id === sprint.id)
          .reduce((s, t) => s + (t.story_points ?? 0), 0);
        statRows.push([`${sprint.name} velocity`, `${sprintPoints}/${sprintTotal} pts`]);
      }
    }

    statRows.forEach(([k, v]) => lines.push(`- **${k}:** ${v}`));
  }

  // ── Completed tasks ───────────────────────────────────────────────────────
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push(`## Completed Work (${doneTasks.length} tasks)`);
  lines.push('');

  if (doneTasks.length === 0) {
    lines.push('_No completed tasks in this period._');
  } else {
    // Group by sprint when sprints are selected
    if (selectedSprints.length > 1) {
      for (const sprint of selectedSprints) {
        const group = doneTasks.filter((t) => t.sprint_id === sprint.id);
        if (group.length === 0) continue;
        lines.push(`### ${sprint.name}`);
        lines.push('');
        group.forEach((t) => {
          const tags = t.tags.length > 0 ? ` _(${t.tags.join(', ')})_` : '';
          const pts = t.story_points > 0 ? ` · ${t.story_points} pts` : '';
          const done = t.completed_at ? ` · done ${fmt(t.completed_at)}` : '';
          lines.push(`- [${PRIORITY_LABEL[t.priority]}] **${t.title}**${pts}${done}${tags}`);
          if (t.description) {
            lines.push(`  ${t.description.split('\n')[0]}`);
          }
        });
        lines.push('');
      }
    } else {
      doneTasks.forEach((t) => {
        const tags = t.tags.length > 0 ? ` _(${t.tags.join(', ')})_` : '';
        const pts = t.story_points > 0 ? ` · ${t.story_points} pts` : '';
        const done = t.completed_at ? ` · done ${fmt(t.completed_at)}` : '';
        lines.push(`- [${PRIORITY_LABEL[t.priority]}] **${t.title}**${pts}${done}${tags}`);
        if (t.description) {
          lines.push(`  ${t.description.split('\n')[0]}`);
        }
      });
    }
  }

  // ── In progress ───────────────────────────────────────────────────────────
  if (inProgressTasks.length > 0) {
    lines.push('');
    lines.push('---');
    lines.push('');
    lines.push(`## In Progress (${inProgressTasks.length} tasks)`);
    lines.push('');
    inProgressTasks.forEach((t) => {
      lines.push(`- [${PRIORITY_LABEL[t.priority]}] **${t.title}**`);
    });
  }

  // ── Knowledge gaps ────────────────────────────────────────────────────────
  if (includeGaps && scopedGaps.length > 0) {
    lines.push('');
    lines.push('---');
    lines.push('');
    lines.push('## Knowledge Gaps & Learning Areas');
    lines.push('');

    if (openGaps.length > 0) {
      lines.push('### Open / Recurring');
      lines.push('');
      openGaps.forEach((g) => {
        const cat = g.category ? ` _(${g.category})_` : '';
        const rec = g.recurrence > 1 ? ` · ×${g.recurrence}` : '';
        lines.push(`- **${g.title}**${cat}${rec}`);
        if (g.description) {
          lines.push(`  ${g.description.split('\n')[0]}`);
        }
      });
      lines.push('');
    }

    if (resolvedGaps.length > 0) {
      lines.push('### Resolved');
      lines.push('');
      resolvedGaps.forEach((g) => {
        const cat = g.category ? ` _(${g.category})_` : '';
        lines.push(`- ~~${g.title}~~${cat} ✓`);
      });
    }
  }

  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('_Generated by WorkLog — Track your work. Prove your impact._');

  return lines.join('\n');
}
