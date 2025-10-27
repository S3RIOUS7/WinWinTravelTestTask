import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ConfirmationDialog } from './ConfirmationModalWindow'

const createTestQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: {
				retry: false
			}
		}
	})

describe('ConfirmationDialog', () => {
	it('renders without crashing', () => {
		const queryClient = createTestQueryClient()

		const { container } = render(
			<QueryClientProvider client={queryClient}>
				<ConfirmationDialog />
			</QueryClientProvider>
		)
		expect(container).toBeDefined()
	})
})
