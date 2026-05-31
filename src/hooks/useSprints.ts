import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from './useAppDispatch';
import * as sprintsService from '@/services/sprints.service';
import {
  setSprints,
  addSprint,
  updateSprint as updateSprintAction,
  removeSprint,
  setVelocity,
  setStatus,
  setError,
} from '@/store/sprintsSlice';
import type { SprintInsert, SprintUpdate } from '@/types/app';

/**
 * Sprint data hook. Wraps the Supabase sprint service + velocity RPC and keeps
 * the Redux store in sync. user_id is read from auth state.
 */
export function useSprints() {
  const dispatch = useAppDispatch();
  const { items, velocity, status, error, activeSprintId } = useAppSelector((s) => s.sprints);
  const userId = useAppSelector((s) => s.auth.session?.user.id);

  const loadSprints = useCallback(async () => {
    dispatch(setStatus('loading'));
    try {
      const sprints = await sprintsService.fetchSprints();
      dispatch(setSprints(sprints));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load sprints';
      dispatch(setError(message));
      toast.error(message);
    }
  }, [dispatch]);

  const loadVelocity = useCallback(async () => {
    if (!userId) return;
    try {
      const rows = await sprintsService.fetchVelocity(userId);
      dispatch(setVelocity(rows));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load velocity';
      toast.error(message);
    }
  }, [dispatch, userId]);

  const createSprint = useCallback(
    async (input: Omit<SprintInsert, 'user_id'>) => {
      if (!userId) {
        toast.error('You must be signed in');
        return null;
      }
      try {
        const sprint = await sprintsService.createSprint({ ...input, user_id: userId });
        dispatch(addSprint(sprint));
        toast.success('Sprint created');
        return sprint;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create sprint';
        toast.error(message);
        return null;
      }
    },
    [dispatch, userId]
  );

  const editSprint = useCallback(
    async (id: string, updates: SprintUpdate) => {
      try {
        const sprint = await sprintsService.updateSprint(id, updates);
        dispatch(updateSprintAction(sprint));
        toast.success('Sprint updated');
        return sprint;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update sprint';
        toast.error(message);
        return null;
      }
    },
    [dispatch]
  );

  const deleteSprint = useCallback(
    async (id: string) => {
      try {
        await sprintsService.deleteSprint(id);
        dispatch(removeSprint(id));
        toast.success('Sprint deleted');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete sprint';
        toast.error(message);
      }
    },
    [dispatch]
  );

  return {
    sprints: items,
    velocity,
    status,
    error,
    activeSprintId,
    loadSprints,
    loadVelocity,
    createSprint,
    editSprint,
    deleteSprint,
  };
}
