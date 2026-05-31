import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store';

/** Typed dispatch — use this instead of plain useDispatch throughout the app. */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/** Typed selector — use this instead of plain useSelector. */
export const useAppSelector = <T>(selector: (state: RootState) => T) =>
  useSelector(selector);
