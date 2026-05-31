import { useAppSelector } from './useAppDispatch';

/** Returns the current auth state from the Redux store. */
export function useAuth() {
  return useAppSelector((s) => s.auth);
}
