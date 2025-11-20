import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { FilterModal } from '@/base/Filter/Filter'
import { useFilters } from '@/hooks/useFilter'

import { ConfirmationDialog } from '../../../components/ConfirmationModalWindow'
import { useAppStore } from '../../../store/appStore'
import { useFilterStore } from '../../../store/filterStore'

export const App = () => {
	const { t } = useTranslation('appFilter')
	const { data: filtersData, isLoading, error } = useFilters()

	// Stores
	const { filters, setFilters, getFilterName, getOptionName } = useAppStore()

	const { selectedFilters, hasSelectedFilters, openFilterModal } =
		useFilterStore()

	useEffect(() => {
		if (filtersData) {
			setFilters(filtersData)
		}
	}, [filtersData, setFilters])

	const shouldShowSelectedFilters =
		hasSelectedFilters() && !isLoading && filters

	if (isLoading) {
		return (
			<main className="w-full h-dvh flex flex-col items-center justify-center p-8">
				<div className="flex justify-center items-center py-12">
					<div
						className="animate-spin rounded-full h-12 w-12 border-b-2 border-[rgba(255,95,0,1)]"
						aria-hidden="true"
					></div>
					<span className="sr-only">{t('loading')}</span>
				</div>
			</main>
		)
	}

	if (error) {
		return (
			<main className="w-full h-dvh flex flex-col items-center justify-center p-8">
				<section
					className="text-red-500 text-xl"
					role="alert"
					aria-live="polite"
				>
					{t('errorLoadingFilters', { message: error.message })}
				</section>
			</main>
		)
	}

	return (
		<main className="w-full h-dvh flex flex-col items-center justify-center p-8">
			<header>
				<h1 className="text-6xl text-gray-600 mb-12 text-center">
					{t('pageTitle')}
				</h1>
			</header>

			<section aria-labelledby="filter-controls-heading">
				<h2
					id="filter-controls-heading"
					className="sr-only"
				>
					{t('filterControls')}
				</h2>

				<button
					className="
            bg-[rgba(255,95,0,1)] text-white rounded-2xl
            hover:bg-[rgba(255,95,0,0.9)] active:bg-[rgba(255,95,0,0.8)]
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-[rgba(255,95,0,0.5)] focus:ring-opacity-50
            font-medium text-lg
            w-[280px] h-[64px]
            flex items-center justify-center
            disabled:opacity-50 disabled:cursor-not-allowed
          "
					onClick={openFilterModal}
					disabled={isLoading}
					aria-expanded={useFilterStore.getState().isFilterModalOpen}
					aria-haspopup="dialog"
				>
					{t('filterButton')}
				</button>
			</section>

			<FilterModal />
			<ConfirmationDialog />

			{shouldShowSelectedFilters && (
				<section
					aria-labelledby="selected-filters-heading"
					className="mt-8 p-6 bg-gray-100 rounded-lg max-w-4xl w-full"
				>
					<h2
						id="selected-filters-heading"
						className="font-bold text-lg mb-4"
					>
						{t('currentSelectedFilters')}
					</h2>

					<figure>
						<figcaption className="sr-only">
							{t('selectedFiltersJSON')}
						</figcaption>
						<pre
							className="bg-white p-4 rounded border text-sm overflow-auto"
							role="document"
							aria-label={t('selectedFiltersJSON')}
						>
							{JSON.stringify(selectedFilters, null, 2)}
						</pre>
					</figure>
				</section>
			)}

			{shouldShowSelectedFilters && (
				<section
					aria-labelledby="selected-options-heading"
					className="mt-4 p-6 bg-blue-50 rounded-lg max-w-4xl w-full"
				>
					<h2
						id="selected-options-heading"
						className="font-bold text-lg mb-4"
					>
						{t('selectedOptions')}
					</h2>
					<div
						className="flex flex-wrap gap-2"
						role="list"
					>
						{selectedFilters.map(
							(filter: { id: string; optionsIds: string[] }) => {
								const filterName = getFilterName(filter.id)
								return filter.optionsIds.map((optionId: string) => {
									const optionName = getOptionName(filter.id, optionId)
									if (!filterName || !optionName) {
										return null
									}

									return (
										<span
											key={`${filter.id}-${optionId}`}
											className="px-3 py-2 bg-blue-100 text-blue-500 rounded-lg text-sm font-medium"
											role="listitem"
										>
											{filterName}: {optionName}
										</span>
									)
								})
							}
						)}
					</div>
				</section>
			)}
		</main>
	)
}
