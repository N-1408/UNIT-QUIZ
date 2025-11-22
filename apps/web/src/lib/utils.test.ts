import { describe, it, expect } from 'vitest';
import { formatDuration } from './utils';

describe('formatDuration', () => {
    it('formats minutes correctly', () => {
        expect(formatDuration(30)).toBe('30 min');
    });

    it('formats hours correctly', () => {
        expect(formatDuration(60)).toBe('1 h');
    });

    it('formats hours and minutes correctly', () => {
        expect(formatDuration(90)).toBe('1 h 30 min');
    });

    it('formats zero correctly', () => {
        expect(formatDuration(0)).toBe('0 min');
    });
});
