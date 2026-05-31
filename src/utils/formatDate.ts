import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';

/** Format an ISO date/timestamp string as e.g. "May 16, 2026". Empty input → "". */
export function formatDate(input: string | null | undefined): string {
  if (!input) return '';
  const date = parseISO(input);
  return isValid(date) ? format(date, 'MMM d, yyyy') : '';
}

/** Format as a relative string, e.g. "3 days ago". Empty input → "". */
export function formatRelative(input: string | null | undefined): string {
  if (!input) return '';
  const date = parseISO(input);
  return isValid(date) ? formatDistanceToNow(date, { addSuffix: true }) : '';
}

/** True if the given date (date-only) is before today. */
export function isOverdue(input: string | null | undefined): boolean {
  if (!input) return false;
  const date = parseISO(input);
  if (!isValid(date)) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}
