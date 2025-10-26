import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SearchRequestFilter {
	[filterId: string]: string[]
}

interface FilterState {
	// Основные состояния
	selectedFilters: SearchRequestFilter
	tempSelectedFilters: SearchRequestFilter
	isFilterModalOpen: boolean
	isConfirmationOpen: boolean
	pendingChanges: SearchRequestFilter | null

	// Действия для модалки фильтра
	openFilterModal: () => void
	closeFilterModal: () => void

	// Действия для временных фильтров
	setTempSelectedFilters: (filters: SearchRequestFilter) => void
	updateTempFilter: (filterId: string, optionIds: string[]) => void
	toggleTempOption: (filterId: string, optionId: string) => void
	clearTempFilter: (filterId: string) => void
	clearAllTempFilters: () => void
	resetTempFilters: () => void

	// Действия для диалога подтверждения
	openConfirmation: (pendingChanges: SearchRequestFilter) => void
	closeConfirmation: () => void
	applyChanges: () => void
	discardChanges: () => void

	// Сброс всего
	resetAllFilters: () => void
}

export const useFilterStore = create<FilterState>()(
	persist(
		(set, get) => ({
			// Начальные состояния
			selectedFilters: {},
			tempSelectedFilters: {},
			isFilterModalOpen: false,
			isConfirmationOpen: false,
			pendingChanges: null,

			openFilterModal: () => {
				// Синхронизируем временные фильтры с текущими при открытии
				const { selectedFilters } = get()
				set({
					isFilterModalOpen: true,
					tempSelectedFilters: { ...selectedFilters }
				})
			},

			closeFilterModal: () => {
				set({
					isFilterModalOpen: false,
					// Сбрасываем временные изменения при закрытии без применения
					tempSelectedFilters: { ...get().selectedFilters }
				})
			},

			// Действия для временных фильтров
			setTempSelectedFilters: filters => {
				set({ tempSelectedFilters: filters })
			},

			updateTempFilter: (filterId, optionIds) => {
				set(state => ({
					tempSelectedFilters: {
						...state.tempSelectedFilters,
						[filterId]: optionIds
					}
				}))
			},

			toggleTempOption: (filterId, optionId) => {
				set(state => {
					const currentOptions = state.tempSelectedFilters[filterId] || []
					const newOptions = currentOptions.includes(optionId)
						? currentOptions.filter(id => id !== optionId)
						: [...currentOptions, optionId]

					return {
						tempSelectedFilters: {
							...state.tempSelectedFilters,
							[filterId]: newOptions
						}
					}
				})
			},

			clearTempFilter: filterId => {
				set(state => ({
					tempSelectedFilters: {
						...state.tempSelectedFilters,
						[filterId]: []
					}
				}))
			},

			clearAllTempFilters: () => {
				set({ tempSelectedFilters: {} })
			},

			resetTempFilters: () => {
				const { selectedFilters } = get()
				set({ tempSelectedFilters: { ...selectedFilters } })
			},

			// Действия для диалога подтверждения
			openConfirmation: pendingChanges => {
				set({
					isConfirmationOpen: true,
					pendingChanges
				})
			},

			closeConfirmation: () => {
				set({
					isConfirmationOpen: false,
					pendingChanges: null
				})
			},

			applyChanges: () => {
				const state = get()
				if (state.pendingChanges) {
					set({
						selectedFilters: state.pendingChanges,
						tempSelectedFilters: state.pendingChanges,
						isConfirmationOpen: false,
						isFilterModalOpen: false,
						pendingChanges: null
					})
				}
			},

			discardChanges: () => {
				const state = get()
				set({
					tempSelectedFilters: state.selectedFilters,
					isConfirmationOpen: false,
					isFilterModalOpen: false,
					pendingChanges: null
				})
			},

			// Полный сброс
			resetAllFilters: () => {
				set({
					selectedFilters: {},
					tempSelectedFilters: {},
					isFilterModalOpen: false,
					isConfirmationOpen: false,
					pendingChanges: null
				})
			}
		}),
		{
			name: 'filter-storage',
			partialize: state => ({
				selectedFilters: state.selectedFilters
				// Сохраняем только выбранные фильтры, не UI состояния
			})
		}
	)
)
