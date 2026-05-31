import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/shared/Input';
import { Select } from '@/components/shared/Select';
import { Button } from '@/components/shared/Button';
import type { KnowledgeGap, Task } from '@/types/app';

const CATEGORIES = [
  'algorithms',
  'architecture',
  'debugging',
  'devops',
  'networking',
  'security',
  'testing',
  'tooling',
  'other',
] as const;

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  category: z.string().optional(),
  task_id: z.string().optional(),
});

type FormFields = z.infer<typeof schema>;

export interface GapFormValues {
  title: string;
  description: string | null;
  category: string | null;
  task_id: string | null;
}

interface GapFormProps {
  initial?: KnowledgeGap | null;
  tasks: Task[];
  submitting?: boolean;
  onSubmit: (values: GapFormValues) => void;
  onCancel: () => void;
}

export function GapForm({ initial, tasks, submitting, onSubmit, onCancel }: GapFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial?.title ?? '',
      description: initial?.description ?? '',
      category: initial?.category ?? '',
      task_id: initial?.task_id ?? '',
    },
  });

  function submit(fields: FormFields) {
    onSubmit({
      title: fields.title.trim(),
      description: fields.description?.trim() || null,
      category: fields.category || null,
      task_id: fields.task_id || null,
    });
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
      <Input
        label="Title"
        placeholder="e.g. gRPC streaming semantics"
        error={errors.title?.message}
        {...register('title')}
      />

      <div className="flex flex-col gap-1">
        <label htmlFor="gap-description" className="text-sm font-medium text-slate-700">
          Description
        </label>
        <textarea
          id="gap-description"
          rows={3}
          placeholder="What specifically tripped you up? What do you need to learn?"
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          {...register('description')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Category"
          placeholder="Select category"
          options={CATEGORIES.map((c) => ({ value: c, label: c[0].toUpperCase() + c.slice(1) }))}
          {...register('category')}
        />
        <Select
          label="Linked task"
          placeholder="No task"
          options={tasks.map((t) => ({ value: t.id, label: t.title }))}
          {...register('task_id')}
        />
      </div>

      <div className="mt-2 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {initial ? 'Save changes' : 'Log gap'}
        </Button>
      </div>
    </form>
  );
}
