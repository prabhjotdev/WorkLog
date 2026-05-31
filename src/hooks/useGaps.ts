import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from './useAppDispatch';
import * as gapsService from '@/services/gaps.service';
import {
  setGaps,
  addGap,
  updateGap as updateGapAction,
  removeGap,
  setStatus,
  setError,
} from '@/store/gapsSlice';
import type { GapInsert, GapUpdate } from '@/types/app';

export function useGaps() {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((s) => s.gaps);
  const userId = useAppSelector((s) => s.auth.session?.user.id);

  const loadGaps = useCallback(async () => {
    dispatch(setStatus('loading'));
    try {
      const gaps = await gapsService.fetchGaps();
      dispatch(setGaps(gaps));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load gaps';
      dispatch(setError(message));
      toast.error(message);
    }
  }, [dispatch]);

  const createGap = useCallback(
    async (input: Omit<GapInsert, 'user_id'>) => {
      if (!userId) { toast.error('You must be signed in'); return null; }
      try {
        const gap = await gapsService.createGap({ ...input, user_id: userId });
        dispatch(addGap(gap));
        toast.success('Gap logged');
        return gap;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to create gap');
        return null;
      }
    },
    [dispatch, userId]
  );

  const editGap = useCallback(
    async (id: string, updates: GapUpdate) => {
      try {
        const gap = await gapsService.updateGap(id, updates);
        dispatch(updateGapAction(gap));
        toast.success('Gap updated');
        return gap;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to update gap');
        return null;
      }
    },
    [dispatch]
  );

  const resolveGap = useCallback(
    async (id: string) => {
      try {
        const gap = await gapsService.updateGap(id, {
          resolved: true,
          resolved_at: new Date().toISOString(),
        });
        dispatch(updateGapAction(gap));
        toast.success('Gap resolved!');
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to resolve gap');
      }
    },
    [dispatch]
  );

  const reopenGap = useCallback(
    async (id: string) => {
      try {
        const gap = await gapsService.updateGap(id, { resolved: false, resolved_at: null });
        dispatch(updateGapAction(gap));
        toast.success('Gap reopened');
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to reopen gap');
      }
    },
    [dispatch]
  );

  const incrementRecurrence = useCallback(
    async (id: string, current: number) => {
      try {
        const gap = await gapsService.updateGap(id, { recurrence: current + 1 });
        dispatch(updateGapAction(gap));
        toast.success('Recurrence updated');
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to update recurrence');
      }
    },
    [dispatch]
  );

  const deleteGap = useCallback(
    async (id: string) => {
      try {
        await gapsService.deleteGap(id);
        dispatch(removeGap(id));
        toast.success('Gap deleted');
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to delete gap');
      }
    },
    [dispatch]
  );

  return {
    gaps: items,
    status,
    error,
    loadGaps,
    createGap,
    editGap,
    resolveGap,
    reopenGap,
    incrementRecurrence,
    deleteGap,
  };
}
