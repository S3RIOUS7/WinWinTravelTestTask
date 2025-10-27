import { create } from 'zustand'

import { FilterItem } from '@/shared/api/types/Filter'

interface AppState {
	filters: FilterItem[]
	isLoading: boolean
	error: string | null

	setFilters: (filters: FilterItem[]) => void
	setLoading: (loading: boolean) => void
	setError: (error: string | null) => void
	clearError: () => void

	getFilterById: (filterId: string) => FilterItem | undefined
	getFilterName: (filterId: string) => string
	getOptionName: (filterId: string, optionId: string) => string
}

export const useAppStore = create<AppState>((set, get) => ({
	filters: [],
	isLoading: false,
	error: null,

	setFilters: filters => set({ filters }),
	setLoading: isLoading => set({ isLoading }),
	setError: error => set({ error }),
	clearError: () => set({ error: null }),

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
