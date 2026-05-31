import { useState } from 'react';
import { Modal } from '@/components/shared/Modal';
import { SprintForm, type SprintFormValues } from './SprintForm';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { useSprints } from '@/hooks/useSprints';
import { closeSprintModal } from '@/store/uiSlice';

/** Create/edit sprint modal, driven by uiSlice (sprintModalOpen + editingSprintId). */
export function SprintModal() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.ui.sprintModalOpen);
  const editingSprintId = useAppSelector((s) => s.ui.editingSprintId);
  const { sprints, createSprint, editSprint } = useSprints();
  const [submitting, setSubmitting] = useState(false);

  const editing = editingSprintId
    ? sprints.find((s) => s.id === editingSprintId) ?? null
    : null;

  function handleClose() {
    dispatch(closeSprintModal());
  }

  async function handleSubmit(values: SprintFormValues) {
    setSubmitting(true);
    const result = editing
      ? await editSprint(editing.id, values)
      : await createSprint(values);
    setSubmitting(false);
    if (result) handleClose();
  }

  if (!open) return null;

  return (
    <Modal open={open} onClose={handleClose} title={editing ? 'Edit sprint' : 'New sprint'} size="md">
      <SprintForm
        initial={editing}
        submitting={submitting}
        onSubmit={handleSubmit}
        onCancel={handleClose}
      />
    </Modal>
  );
}
