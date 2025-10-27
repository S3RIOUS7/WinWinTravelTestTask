import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { App } from './App'

const createTestQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: {
				retry: false
			}
		}
	})

describe('App', () => {
	it('renders main element', () => {
		const queryClient = createTestQueryClient()

		render(
			<QueryClientProvider client={queryClient}>
				<App />
			</QueryClientProvider>
		)

		const mainElement = screen.getByRole('main')
		expect(mainElement).toBeInTheDocument()
	})

	it('has correct page structure', () => {
		const queryClient = createTestQueryClient()

		render(
			<QueryClientProvider client={queryClient}>
				<App />
			</QueryClientProvider>
		)

		expect(screen.getByRole('main')).toBeInTheDocument()
	})
})
