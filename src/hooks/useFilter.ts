import { useQuery } from '@tanstack/react-query'

import { FilterItem, FilterType } from '@/shared/api/types/Filter'

import { useAppStore } from '../store/appStore'

const fetchFilterData = async (): Promise<FilterItem[]> => {
	await new Promise(resolve => setTimeout(resolve, 500))
	const response = await import('@/shared/temp/filterData.json')

	return response.default.filterItems.map(item => ({
		...item,
		type: item.type as FilterType
	}))
}

export const useFilters = () => {
	const { setFilters, setLoading, setError } = useAppStore()

	return useQuery({
		queryKey: ['filters'],
		queryFn: async () => {
			try {
				setLoading(true)
				const data = await fetchFilterData()
				setFilters(data)
				return data
			} catch (error) {
				setError(error instanceof Error ? error.message : 'Unknown error')
				throw error
			} finally {
				setLoading(false)
			}
		},
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000
	})
}
