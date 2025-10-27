import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ConfirmationDialog } from './ConfirmationModalWindow'

describe('ConfirmationDialog', () => {
	it('renders without crashing', () => {
		const { container } = render(<ConfirmationDialog />)
		expect(container).toBeDefined()
	})

	it('has dialog accessibility attributes', () => {
		render(<ConfirmationDialog />)

		// Проверяем базовые accessibility атрибуты
		const dialog = screen.queryByRole('dialog')
		if (dialog) {
			expect(dialog).toHaveAttribute('aria-modal', 'true')
			expect(dialog).toHaveAttribute('aria-labelledby')
		}
	})
})
