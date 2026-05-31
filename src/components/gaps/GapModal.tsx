import { useState } from 'react';
import { Modal } from '@/components/shared/Modal';
import { GapForm, type GapFormValues } from './GapForm';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { useGaps } from '@/hooks/useGaps';
import { closeGapModal } from '@/store/uiSlice';

export function GapModal() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.ui.gapModalOpen);
  const editingGapId = useAppSelector((s) => s.ui.editingGapId);
  const tasks = useAppSelector((s) => s.tasks.items);
  const { gaps, createGap, editGap } = useGaps();
  const [submitting, setSubmitting] = useState(false);

  const editing = editingGapId ? gaps.find((g) => g.id === editingGapId) ?? null : null;

  function handleClose() {
    dispatch(closeGapModal());
  }

  async function handleSubmit(values: GapFormValues) {
    setSubmitting(true);
    const result = editing
      ? await editGap(editing.id, values)
      : await createGap(values);
    setSubmitting(false);
    if (result) handleClose();
  }

  if (!open) return null;

  return (
    <Modal open={open} onClose={handleClose} title={editing ? 'Edit gap' : 'Log knowledge gap'} size="md">
      <GapForm
        initial={editing}
        tasks={tasks}
        submitting={submitting}
        onSubmit={handleSubmit}
        onCancel={handleClose}
      />
    </Modal>
  );
}
