import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/shared/Input';
import { Select } from '@/components/shared/Select';
import { Button } from '@/components/shared/Button';
import {
  TASK_STATUSES,
  TASK_PRIORITIES,
  TASK_STATUS_LABELS,
  TASK_PRIORITY_LABELS,
} from '@/lib/constants';
import type { Task, Sprint } from '@/types/app';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(TASK_STATUSES),
  priority: z.enum(TASK_PRIORITIES),
  sprint_id: z.string().optional(),
  story_points: z.coerce.number().int().min(0, 'Must be 0 or more'),
  due_date: z.string().optional(),
  tags: z.string().optional(), // comma-separated in the form, split on submit
});

type FormFields = z.infer<typeof schema>;

export interface TaskFormValues {
  title: string;
  description: string | null;
  status: Task['status'];
  priority: Task['priority'];
  sprint_id: string | null;
  story_points: number;
  due_date: string | null;
  tags: string[];
}

interface TaskFormProps {
  initial?: Task | null;
  sprints: Sprint[];
  submitting?: boolean;
  onSubmit: (values: TaskFormValues) => void;
  onCancel: () => void;
}

export function TaskForm({ initial, sprints, submitting, onSubmit, onCancel }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial?.title ?? '',
      description: initial?.description ?? '',
      status: initial?.status ?? 'todo',
      priority: initial?.priority ?? 'medium',
      sprint_id: initial?.sprint_id ?? '',
      story_points: initial?.story_points ?? 1,
      due_date: initial?.due_date ?? '',
      tags: initial?.tags?.join(', ') ?? '',
    },
  });

  function submit(fields: FormFields) {
    onSubmit({
      title: fields.title.trim(),
      description: fields.description?.trim() || null,
      status: fields.status,
      priority: fields.priority,
      sprint_id: fields.sprint_id || null,
      story_points: fields.story_points,
      due_date: fields.due_date || null,
      tags: fields.tags
        ? fields.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
    });
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
      <Input
        label="Title"
        placeholder="e.g. Refactor auth middleware"
        error={errors.title?.message}
        {...register('title')}
      />

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium text-slate-700">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          placeholder="Optional details…"
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          {...register('description')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Status"
          options={TASK_STATUSES.map((s) => ({ value: s, label: TASK_STATUS_LABELS[s] }))}
          {...register('status')}
        />
        <Select
          label="Priority"
          options={TASK_PRIORITIES.map((p) => ({ value: p, label: TASK_PRIORITY_LABELS[p] }))}
          {...register('priority')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Sprint"
          placeholder="No sprint"
          options={sprints.map((s) => ({ value: s.id, label: s.name }))}
          {...register('sprint_id')}
        />
        <Input
          label="Story points"
          type="number"
          min={0}
          error={errors.story_points?.message}
          {...register('story_points')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Due date" type="date" {...register('due_date')} />
        <Input
          label="Tags"
          placeholder="api, bug, backend"
          hint="Comma-separated"
          {...register('tags')}
        />
      </div>

      <div className="mt-2 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {initial ? 'Save changes' : 'Create task'}
        </Button>
      </div>
    </form>
  );
}
