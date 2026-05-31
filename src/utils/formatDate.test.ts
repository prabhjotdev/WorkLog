import { describe, it, expect } from 'vitest';
import { formatDate, formatRelative, isOverdue } from './formatDate';

describe('formatDate', () => {
  it('formats an ISO timestamp', () => {
    expect(formatDate('2026-05-16T12:00:00.000Z')).toBe('May 16, 2026');
  });

  it('formats a date-only string', () => {
    expect(formatDate('2026-01-02')).toBe('Jan 2, 2026');
  });

  it('returns empty string for null/undefined/empty', () => {
    expect(formatDate(null)).toBe('');
    expect(formatDate(undefined)).toBe('');
    expect(formatDate('')).toBe('');
  });

  it('returns empty string for invalid input', () => {
    expect(formatDate('not-a-date')).toBe('');
  });
});

describe('formatRelative', () => {
  it('returns empty string for falsy input', () => {
    expect(formatRelative(null)).toBe('');
  });

  it('produces a relative suffix string for a past date', () => {
    const result = formatRelative('2020-01-01T00:00:00.000Z');
    expect(result).toMatch(/ago$/);
  });
});

describe('isOverdue', () => {
  // Hermetic: use dates unambiguously in the distant past/future so the test
  // does not depend on (or mutate) the global system clock. Mutating the clock
  // with fake timers here leaked into other suites under parallel execution.
  it('is true for a date well before today', () => {
    expect(isOverdue('2000-01-01')).toBe(true);
  });

  it('is false for a date well in the future', () => {
    expect(isOverdue('2999-12-31')).toBe(false);
  });

  it('is false for null or invalid input', () => {
    expect(isOverdue(null)).toBe(false);
    expect(isOverdue('garbage')).toBe(false);
  });
});
