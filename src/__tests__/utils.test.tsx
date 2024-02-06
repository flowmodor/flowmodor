import { describe, expect, it } from 'vitest';
import { formatTime } from '@/utils';

describe('formatTime', () => {
  it('correctly formats seconds', () => {
    expect(formatTime(0)).toBe('00:00');
    expect(formatTime(45)).toBe('00:45');
  });

  it('correctly formats minutes and seconds', () => {
    expect(formatTime(300)).toBe('05:00');
    expect(formatTime(615)).toBe('10:15');
  });

  it('correctly formats hours, minutes, and seconds', () => {
    expect(formatTime(3665)).toBe('01:01:05');
    expect(formatTime(45296)).toBe('12:34:56');
  });

  it('pads single-digit minutes and seconds with zeros', () => {
    expect(formatTime(65)).toBe('01:05');
  });

  it('handles edge cases at the hour mark', () => {
    expect(formatTime(3600)).toBe('01:00:00');
    expect(formatTime(7200)).toBe('02:00:00');
  });
});
