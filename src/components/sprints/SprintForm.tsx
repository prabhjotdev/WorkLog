import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/shared/Input';
import { Select } from '@/components/shared/Select';
import { Button } from '@/components/shared/Button';
import { SPRINT_STATUSES, SPRINT_STATUS_LABELS } from '@/lib/constants';
import type { Sprint } from '@/types/app';

const schema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    goal: z.string().optional(),
    status: z.enum(SPRINT_STATUSES),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
  })
  .refine(
    (data) => !data.start_date || !data.end_date || data.end_date >= data.start_date,
    { message: 'End date must be after start date', path: ['end_date'] }
  );

type FormFields = z.infer<typeof schema>;

export interface SprintFormValues {
  name: string;
  goal: string | null;
  status: Sprint['status'];
  start_date: string | null;
  end_date: string | null;
}

interface SprintFormProps {
  initial?: Sprint | null;
  submitting?: boolean;
  onSubmit: (values: SprintFormValues) => void;
  onCancel: () => void;
}

export function SprintForm({ initial, submitting, onSubmit, onCancel }: SprintFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initial?.name ?? '',
      goal: initial?.goal ?? '',
      status: initial?.status ?? 'planned',
      start_date: initial?.start_date ?? '',
      end_date: initial?.end_date ?? '',
    },
  });

  function submit(fields: FormFields) {
    onSubmit({
      name: fields.name.trim(),
      goal: fields.goal?.trim() || null,
      status: fields.status,
      start_date: fields.start_date || null,
      end_date: fields.end_date || null,
    });
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
      <Input
        label="Sprint name"
        placeholder="e.g. Q2 Week 3"
        error={errors.name?.message}
        {...register('name')}
      />

      <div className="flex flex-col gap-1">
        <label htmlFor="goal" className="text-sm font-medium text-slate-700">
          Goal
        </label>
        <textarea
          id="goal"
          rows={2}
          placeholder="What's the focus of this sprint?"
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          {...register('goal')}
        />
      </div>

      <Select
        label="Status"
        options={SPRINT_STATUSES.map((s) => ({ value: s, label: SPRINT_STATUS_LABELS[s] }))}
        {...register('status')}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input label="Start date" type="date" {...register('start_date')} />
        <Input
          label="End date"
          type="date"
          error={errors.end_date?.message}
          {...register('end_date')}
        />
      </div>

      <div className="mt-2 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {initial ? 'Save changes' : 'Create sprint'}
        </Button>
      </div>
    </form>
  );
}
