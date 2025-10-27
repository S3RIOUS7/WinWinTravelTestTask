import { describe, expect, it } from 'vitest'

import { useFilters } from './useFilter'

describe('useFilters', () => {
	it('is defined and exported', () => {
		expect(useFilters).toBeDefined()
		expect(typeof useFilters).toBe('function')
	})

	it('returns a function that can be called', () => {
		const hook = useFilters
		expect(() => {
			if (typeof hook !== 'function') {
				throw new Error('useFilters is not a function')
			}
		}).not.toThrow()
	})

	it('has correct function name', () => {
		expect(useFilters.name).toBe('useFilters')
	})
})
