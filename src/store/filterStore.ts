import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { FilterType } from '@/shared/api/types/Filter'
import {
	SearchRequestFilter,
	SearchRequestOptions
} from '@/shared/api/types/SearchRequest/SearchRequestFilter'

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
			selectedFilters: [],
			tempSelectedFilters: [],
			isFilterModalOpen: false,

			openFilterModal: () => {
				const { selectedFilters } = get()
				set({
					isFilterModalOpen: true,
					tempSelectedFilters: JSON.parse(JSON.stringify(selectedFilters))
				})
			},

			closeFilterModal: () => {
				set({
					isFilterModalOpen: false,
					tempSelectedFilters: JSON.parse(JSON.stringify(get().selectedFilters))
				})
			},

			toggleTempOption: (filterId: string, optionId: string) => {
				set(state => {
					const tempFilters: SearchRequestOptions[] = [
						...state.tempSelectedFilters
					]
					const existingFilterIndex = tempFilters.findIndex(
						// eslint-disable-next-line id-length
						(f: SearchRequestOptions) => f.id === filterId
					)

					if (existingFilterIndex >= 0) {
						const existingFilter = { ...tempFilters[existingFilterIndex] }
						const optionIndex = existingFilter.optionsIds.indexOf(optionId)

						if (optionIndex >= 0) {
							// Remove option
							existingFilter.optionsIds = existingFilter.optionsIds.filter(
								id => id !== optionId
							)
							// Remove filter if no options left
							if (existingFilter.optionsIds.length === 0) {
								tempFilters.splice(existingFilterIndex, 1)
							} else {
								tempFilters[existingFilterIndex] = existingFilter
							}
						} else {
							// Add option
							existingFilter.optionsIds = [
								...existingFilter.optionsIds,
								optionId
							]
							tempFilters[existingFilterIndex] = existingFilter
						}
					} else {
						// Create new filter
						tempFilters.push({
							id: filterId,
							type: FilterType.OPTION,
							optionsIds: [optionId]
						})
					}

					return { tempSelectedFilters: tempFilters }
				})
			},

			clearAllTempFilters: () => {
				set({ tempSelectedFilters: [] })
			},

			applyFilters: () => {
				const { tempSelectedFilters } = get()
				set({
					selectedFilters: JSON.parse(JSON.stringify(tempSelectedFilters)),
					isFilterModalOpen: false
				})
			},

			discardChanges: () => {
				const { selectedFilters } = get()
				set({
					tempSelectedFilters: JSON.parse(JSON.stringify(selectedFilters)),
					isFilterModalOpen: false
				})
			},

			resetAllFilters: () => {
				set({
					selectedFilters: [],
					tempSelectedFilters: [],
					isFilterModalOpen: false
				})
			},

			hasSelectedFilters: () => {
				const { selectedFilters } = get()
				return selectedFilters.some(
					(filter: SearchRequestOptions) => filter.optionsIds.length > 0
				)
			},

			hasTempSelectedFilters: () => {
				const { tempSelectedFilters } = get()
				return tempSelectedFilters.some(
					(filter: SearchRequestOptions) => filter.optionsIds.length > 0
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
