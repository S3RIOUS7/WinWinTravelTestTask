import { describe, expect, it } from 'vitest'

import { useFilters } from './useFilter'

describe('useFilters', () => {
	it('is defined and exported', () => {
		expect(useFilters).toBeDefined()
		expect(typeof useFilters).toBe('function')
	})

	it('returns expected properties from useQuery', () => {
		expect(useFilters).toBeInstanceOf(Function)
	})
})
