import { useQuery } from '@tanstack/react-query'

import { FilterItem, FilterType } from '@/shared/api/types/Filter'

const fetchFilterData = async (): Promise<FilterItem[]> => {
	await new Promise(resolve => setTimeout(resolve, 500))
	const response = await import('@/shared/temp/filterData.json')

	return response.default.filterItems.map(item => ({
		...item,
		type: item.type as FilterType
	}))
}

export const useFilters = () => {
	return useQuery({
		queryKey: ['filters'],
		queryFn: fetchFilterData,
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000
	})
}
