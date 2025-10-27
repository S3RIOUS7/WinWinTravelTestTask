import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { App } from './App'

// Простой тест для проверки рендеринга
describe('App', () => {
	it('renders main element', () => {
		render(<App />)

		// Проверяем что основной элемент отрендерился
		const mainElement = screen.getByRole('main')
		expect(mainElement).toBeInTheDocument()
	})

	it('has correct page structure', () => {
		render(<App />)

		// Проверяем базовую структуру
		expect(screen.getByRole('main')).toBeInTheDocument()

		// Проверяем что есть заголовок (может быть в loading состоянии)
		const headings = screen.getAllByRole('heading')
		expect(headings.length).toBeGreaterThan(0)
	})
})
