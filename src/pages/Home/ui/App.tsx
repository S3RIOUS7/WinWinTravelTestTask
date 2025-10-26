import { useTranslation } from 'react-i18next'

import { useFilters } from '@/hooks/useFilter'
import { FilterItem } from '@/shared/api/types/Filter'

import { ConfirmationDialog } from '../../../components/ConfirmationModalWindow'
import { useFilterStore } from '../../../store/filterStore'

export const App = () => {
	const { t } = useTranslation('appFilter')
	const { data: filters, isLoading, error } = useFilters()

	const {
		isFilterModalOpen,
		isConfirmationOpen,
		tempSelectedFilters,
		selectedFilters,
		openFilterModal,
		closeFilterModal,
		toggleTempOption,
		clearAllTempFilters,
		openConfirmation,
		closeConfirmation,
		applyChanges,
		discardChanges
	} = useFilterStore()

	const columnConfig = [2, 3, 2, 1, 3]

	const handleOptionToggle = (filterId: string, optionId: string) => {
		toggleTempOption(filterId, optionId)
	}

	const handleClearAll = () => {
		clearAllTempFilters()
	}

	const handleApply = () => {
		const hasChanges =
			JSON.stringify(tempSelectedFilters) !== JSON.stringify(selectedFilters)

		if (hasChanges) {
			openConfirmation(tempSelectedFilters)
		} else {
			closeFilterModal()
		}
	}

	const handleConfirm = () => {
		applyChanges()
	}

	const handleCancel = () => {
		discardChanges()
	}

	const handleCloseConfirmation = () => {
		closeConfirmation()
	}

	const getFilterById = (filterId: string): FilterItem | undefined => {
		return filters?.find(filterItem => filterItem.id === filterId)
	}

	const getOptionName = (filterId: string, optionId: string): string => {
		const filter = getFilterById(filterId)
		const option = filter?.options.find(
			optionItem => optionItem.id === optionId
		)
		return option?.name || t('unknownOption', { optionId })
	}

	const getFilterName = (filterId: string): string => {
		const filter = getFilterById(filterId)
		return filter?.name || t('unknownFilter', { filterId })
	}

	if (error) {
		return (
			<main className="w-full h-dvh flex flex-col items-center justify-center p-8">
				<section
					className="text-red-500 text-xl"
					role="alert"
					aria-live="polite"
				>
					{t('errorLoadingFilters', { message: (error as Error).message })}
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
					aria-expanded={isFilterModalOpen}
					aria-haspopup="dialog"
				>
					{isLoading ? t('loading') : t('filterButton')}
				</button>
			</section>

			<div
				className={`
					fixed inset-0 z-50 flex items-center justify-center
					transition-all duration-300 ease-in-out
					${isFilterModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
				`}
				role="dialog"
				aria-labelledby="filter-modal-title"
				aria-modal="true"
			>
				<div
					className={`
						absolute inset-0 bg-black
						transition-opacity duration-300
						${isFilterModalOpen ? 'opacity-50' : 'opacity-0'}
					`}
					onClick={closeFilterModal}
					aria-hidden="true"
				/>

				<section
					className={`
						relative z-10 bg-white rounded-2xl shadow-2xl
						w-[1280px] mx-4 max-h-[90vh] overflow-hidden
						transform transition-all duration-300
						${isFilterModalOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
					`}
					role="document"
					aria-labelledby="filter-modal-title"
					onClick={e => e.stopPropagation()}
				>
					<header className="flex items-center justify-between p-6 border-b border-gray-200">
						<div className="flex-1"></div>
						<div className="flex-1 flex justify-center">
							<h1
								id="filter-modal-title"
								className="text-4xl font-medium font-inter leading-none tracking-normal text-gray-500"
							>
								{t('filterModalTitle')}
							</h1>
						</div>
						<div className="flex-1 flex justify-end">
							<button
								className="
									w-8 h-8 rounded-full
									flex items-center justify-center
									text-gray-500 hover:text-gray-600
									hover:bg-gray-100
									transition-colors duration-200
									focus:outline-none focus:ring-2 focus:ring-gray-400
								"
								onClick={closeFilterModal}
								aria-label={t('closeFilter')}
							>
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>
					</header>

					<main className="overflow-y-auto max-h-[60vh] p-6 scrollbar-hide">
						{isLoading ? (
							<div
								className="flex justify-center items-center py-12"
								role="status"
								aria-live="polite"
							>
								<div
									className="animate-spin rounded-full h-12 w-12 border-b-2 border-[rgba(255,95,0,1)]"
									aria-hidden="true"
								></div>
								<span className="sr-only">{t('loading')}</span>
							</div>
						) : (
							<div
								className="space-y-8"
								role="application"
							>
								{filters?.map((filter: FilterItem, index: number) => {
									const selectedOptions = tempSelectedFilters[filter.id] || []
									const filterSectionId = `filter-section-${filter.id}`

									return (
										<section
											key={filter.id}
											id={filterSectionId}
											className="border-b border-gray-200 pb-6 last:border-b-0"
											aria-labelledby={`${filterSectionId}-heading`}
										>
											<header className="mb-4">
												<h2
													id={`${filterSectionId}-heading`}
													className="font-inter font-medium text-2xl text-gray-500 leading-none"
												>
													{filter.name}
												</h2>
											</header>

											<fieldset>
												<legend className="sr-only">
													{t('optionsForFilter', { filterName: filter.name })}
												</legend>
												<div
													className="grid grid-cols-1 gap-2"
													style={{
														gridTemplateColumns: `repeat(${columnConfig[index]}, minmax(0, 1fr))`
													}}
												>
													{filter.options.map(option => {
														const isSelected = selectedOptions.includes(
															option.id
														)
														return (
															<div
																key={option.id}
																role="checkbox"
																aria-checked={isSelected}
																tabIndex={0}
																className="
																	flex items-center cursor-pointer
																	hover:bg-gray-50 transition-colors duration-200
																	py-2
																"
																onClick={() =>
																	handleOptionToggle(filter.id, option.id)
																}
																onKeyDown={e => {
																	if (e.key === 'Enter' || e.key === ' ') {
																		e.preventDefault()
																		handleOptionToggle(filter.id, option.id)
																	}
																}}
																aria-describedby={`${filterSectionId}-heading`}
															>
																<div
																	className={`
																		w-6 h-6 border-2 rounded mr-3 flex items-center justify-center
																		${
																			isSelected
																				? 'bg-[rgba(255,95,0,1)] border-[rgba(255,95,0,1)]'
																				: 'border-gray-300'
																		}
																	`}
																	aria-hidden="true"
																>
																	{isSelected && (
																		<svg
																			className="w-4 h-4 text-white"
																			fill="currentColor"
																			viewBox="0 0 20 20"
																		>
																			<path
																				fillRule="evenodd"
																				d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
																				clipRule="evenodd"
																			/>
																		</svg>
																	)}
																</div>

																<div className="flex-1">
																	<h3 className="font-inter font-normal text-base text-gray-500 leading-none">
																		{option.name}
																	</h3>
																</div>
															</div>
														)
													})}
												</div>
											</fieldset>
										</section>
									)
								})}
							</div>
						)}
					</main>

					<footer className="flex justify-between items-center p-6 border-t border-gray-200">
						<div className="flex-1"></div>
						<div className="flex items-center gap-3 flex-1 justify-center">
							<button
								className="
									w-[184px] h-[64px]
									bg-[rgba(255,95,0,1)] text-white rounded-2xl
									hover:bg-[rgba(255,95,0,0.9)] active:bg-[rgba(255,95,0,0.8)]
									transition-colors duration-200
									focus:outline-none focus:ring-2 focus:ring-[rgba(255,95,0,0.5)] focus:ring-opacity-50
									font-medium
									flex items-center justify-center
									disabled:opacity-50 disabled:cursor-not-allowed
								"
								onClick={handleApply}
								disabled={isLoading}
							>
								{t('applyButton')}
							</button>
						</div>
						<div className="flex justify-end flex-1">
							<button
								className="
									font-inter font-medium text-base underline
									text-[rgba(7,134,145,1)] hover:text-[rgba(7,134,145,0.8)]
									transition-colors duration-200
									focus:outline-none focus:ring-2 focus:ring-[rgba(7,134,145,0.3)] focus:ring-opacity-50
									bg-transparent
									px-0 py-0
									disabled:opacity-50 disabled:cursor-not-allowed
								"
								onClick={handleClearAll}
								disabled={
									isLoading || Object.keys(tempSelectedFilters).length === 0
								}
							>
								{t('clearAllParameters')}
							</button>
						</div>
					</footer>
				</section>
			</div>

			{/* Диалог подтверждения */}
			<ConfirmationDialog
				isOpen={isConfirmationOpen}
				onConfirm={handleConfirm}
				onCancel={handleCancel}
				onClose={handleCloseConfirmation}
			/>

			{/* Отображение выбранных фильтров */}
			{Object.keys(selectedFilters).length > 0 && (
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

			{/* Отображение выбранных опций */}
			{Object.keys(selectedFilters).length > 0 && (
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
						{Object.entries(selectedFilters).map(([filterId, optionIds]) => {
							const filterName = getFilterName(filterId)
							return optionIds.map(optionId => {
								const optionName = getOptionName(filterId, optionId)
								return (
									<span
										key={`${filterId}-${optionId}`}
										className="px-3 py-2 bg-blue-100 text-blue-500 rounded-lg text-sm font-medium"
										role="listitem"
									>
										{filterName}: {optionName}
									</span>
								)
							})
						})}
					</div>
				</section>
			)}
		</main>
	)
}
