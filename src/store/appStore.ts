import { create } from 'zustand'

import { FilterItem } from '@/shared/api/types/Filter'

interface AppState {
	filters: FilterItem[]

	setFilters: (filters: FilterItem[]) => void

	getFilterById: (filterId: string) => FilterItem | undefined
	getFilterName: (filterId: string) => string
	getOptionName: (filterId: string, optionId: string) => string
}

export const useAppStore = create<AppState>((set, get) => ({
	filters: [],

	setFilters: filters => set({ filters }),

	getFilterById: (filterId: string) => {
		const { filters } = get()
		return filters.find(filter => filter.id === filterId)
	},

	getFilterName: (filterId: string) => {
		const filter = get().getFilterById(filterId)
		return filter?.name || ''
	},

	getOptionName: (filterId: string, optionId: string) => {
		const filter = get().getFilterById(filterId)
		const option = filter?.options.find(opt => opt.id === optionId)
		return option?.name || ''
	}
}))
