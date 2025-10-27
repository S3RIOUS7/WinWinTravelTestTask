import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { FilterModal } from './Filter'

const createTestQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: {
				retry: false
			}
		}
	})

describe('FilterModal', () => {
	it('renders without errors', () => {
		const queryClient = createTestQueryClient()

		const { container } = render(
			<QueryClientProvider client={queryClient}>
				<FilterModal />
			</QueryClientProvider>
		)
		expect(container).toBeDefined()
	})
})
