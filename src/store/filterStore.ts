import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SearchRequestFilter {
	[filterId: string]: string[]
}

interface FilterState {
	selectedFilters: SearchRequestFilter
	tempSelectedFilters: SearchRequestFilter
	isFilterModalOpen: boolean

	openFilterModal: () => void
	closeFilterModal: () => void
	toggleTempOption: (filterId: string, optionId: string) => void
	clearAllTempFilters: () => void
	applyFilters: () => void
	discardChanges: () => void
	resetAllFilters: () => void

	hasSelectedFilters: () => boolean
	hasTempSelectedFilters: () => boolean
	hasChanges: () => boolean
}

export const useFilterStore = create<FilterState>()(
	persist(
		(set, get) => ({
			selectedFilters: {},
			tempSelectedFilters: {},
			isFilterModalOpen: false,

			openFilterModal: () => {
				const { selectedFilters } = get()
				set({
					isFilterModalOpen: true,
					tempSelectedFilters: { ...selectedFilters }
				})
			},

			closeFilterModal: () => {
				set({
					isFilterModalOpen: false,
					tempSelectedFilters: { ...get().selectedFilters }
				})
			},

			toggleTempOption: (filterId: string, optionId: string) => {
				set(state => {
					const currentOptions = state.tempSelectedFilters[filterId] || []
					const newOptions = currentOptions.includes(optionId)
						? currentOptions.filter(id => id !== optionId)
						: [...currentOptions, optionId]

					const newTempFilters = {
						...state.tempSelectedFilters,
						[filterId]: newOptions
					}

					if (newOptions.length === 0) {
						delete newTempFilters[filterId]
					}

					return { tempSelectedFilters: newTempFilters }
				})
			},

			clearAllTempFilters: () => {
				set({ tempSelectedFilters: {} })
			},

			applyFilters: () => {
				const { tempSelectedFilters } = get()
				set({
					selectedFilters: { ...tempSelectedFilters },
					isFilterModalOpen: false
				})
			},

			discardChanges: () => {
				const { selectedFilters } = get()
				set({
					tempSelectedFilters: { ...selectedFilters },
					isFilterModalOpen: false
				})
			},

			resetAllFilters: () => {
				set({
					selectedFilters: {},
					tempSelectedFilters: {},
					isFilterModalOpen: false
				})
			},

			hasSelectedFilters: () => {
				const { selectedFilters } = get()
				return Object.values(selectedFilters).some(
					options => options.length > 0
				)
			},

			hasTempSelectedFilters: () => {
				const { tempSelectedFilters } = get()
				return Object.values(tempSelectedFilters).some(
					options => options.length > 0
				)
			},

			hasChanges: () => {
				const { selectedFilters, tempSelectedFilters } = get()
				return (
					JSON.stringify(selectedFilters) !==
					JSON.stringify(tempSelectedFilters)
				)
			}
		}),
		{
			name: 'filter-storage',
			partialize: state => ({ selectedFilters: state.selectedFilters })
		}
	)
)
