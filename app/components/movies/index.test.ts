import { describe, expect, test } from 'vitest';
import { getDirection } from './TableHeader';

describe('TableHeader - getDirection', () => {
	test('should return "Sort ascending" when sortingOrder is "asc"', () => {
		expect(getDirection('asc')).toBe(' 🔼');
	});

	test('should return "Sort descending" when sortingOrder is "desc"', () => {
		expect(getDirection('desc')).toBe(' 🔽');
	});

	test('should return "Clear sort" when sortingOrder is any other value', () => {
		expect(getDirection(false)).toBe(null);
	});
});
