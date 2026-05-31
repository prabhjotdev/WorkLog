import { useState } from 'react';
import { Modal } from '@/components/shared/Modal';
import { TaskForm, type TaskFormValues } from './TaskForm';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { useTasks } from '@/hooks/useTasks';
import { closeTaskModal } from '@/store/uiSlice';

/**
 * Create/edit task modal. Driven by uiSlice state: taskModalOpen +
 * editingTaskId (null = create mode).
 */
export function TaskModal() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.ui.taskModalOpen);
  const editingTaskId = useAppSelector((s) => s.ui.editingTaskId);
  const sprints = useAppSelector((s) => s.sprints.items);
  const { tasks, createTask, editTask } = useTasks();
  const [submitting, setSubmitting] = useState(false);

  const editing = editingTaskId ? tasks.find((t) => t.id === editingTaskId) ?? null : null;

  function handleClose() {
    dispatch(closeTaskModal());
  }

  async function handleSubmit(values: TaskFormValues) {
    setSubmitting(true);
    // Stamp completed_at when creating/saving a task already marked done.
    const completed_at = values.status === 'done' ? new Date().toISOString() : null;
    const result = editing
      ? await editTask(editing.id, { ...values, completed_at })
      : await createTask({ ...values, completed_at });
    setSubmitting(false);
    if (result) handleClose();
  }

  if (!open) return null;

  return (
    <Modal open={open} onClose={handleClose} title={editing ? 'Edit task' : 'New task'} size="md">
      <TaskForm
        initial={editing}
        sprints={sprints}
        submitting={submitting}
        onSubmit={handleSubmit}
        onCancel={handleClose}
      />
    </Modal>
  );
}
