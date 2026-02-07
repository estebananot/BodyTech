import { formatDate, capitalizeFirst, getStatusColor, debounce } from '../src/utils/helpers';

describe('Helper Functions', () => {
  describe('formatDate', () => {
    test('formats date correctly', () => {
      const dateString = '2026-02-06 17:27:05';
      const formatted = formatDate(dateString);
      expect(formatted).toContain('feb');
      expect(formatted).toContain('2026');
    });
  });

  describe('capitalizeFirst', () => {
    test('capitalizes first letter', () => {
      expect(capitalizeFirst('hello')).toBe('Hello');
      expect(capitalizeFirst('world')).toBe('World');
    });

    test('handles empty string', () => {
      expect(capitalizeFirst('')).toBe('');
    });

    test('handles null/undefined', () => {
      expect(capitalizeFirst(null)).toBe('');
      expect(capitalizeFirst(undefined)).toBe('');
    });
  });

  describe('getStatusColor', () => {
    test('returns correct color for pending', () => {
      expect(getStatusColor('pending')).toBe('yellow');
    });

    test('returns correct color for in_progress', () => {
      expect(getStatusColor('in_progress')).toBe('blue');
    });

    test('returns correct color for done', () => {
      expect(getStatusColor('done')).toBe('green');
    });

    test('returns gray for unknown status', () => {
      expect(getStatusColor('unknown')).toBe('gray');
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('delays function execution', () => {
      const func = jest.fn();
      const debouncedFunc = debounce(func, 100);
      
      debouncedFunc();
      debouncedFunc();
      debouncedFunc();
      
      expect(func).not.toHaveBeenCalled();
      
      jest.advanceTimersByTime(100);
      
      expect(func).toHaveBeenCalledTimes(1);
    });
  });
});
