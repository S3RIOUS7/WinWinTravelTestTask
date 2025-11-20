import React from 'react'
import { useTranslation } from 'react-i18next'

import { FilterItem } from '@/shared/api/types/Filter'

import { useAppStore } from '../../store/appStore'
import { useConfirmationStore } from '../../store/confirmationStore'
import { useFilterStore } from '../../store/filterStore'

export const FilterModal: React.FC = () => {
	const { t } = useTranslation('appFilter')

	const { filters, isLoading } = useAppStore()

	const {
		isFilterModalOpen,
		tempSelectedFilters,
		closeFilterModal,
		toggleTempOption,
		clearAllTempFilters,
		applyFilters,
		discardChanges,
		hasTempSelectedFilters,
		hasChanges
	} = useFilterStore()

	const { openConfirmation } = useConfirmationStore()

	const handleOptionToggle = (filterId: string, optionId: string) => {
		toggleTempOption(filterId, optionId)
	}

	const handleClearAll = () => {
		clearAllTempFilters()
	}

	const handleApply = () => {
		if (hasChanges()) {
			openConfirmation(
				() => applyFilters(),
				() => discardChanges()
			)
		} else {
			closeFilterModal()
		}
	}

	// Функция для получения выбранных опций для фильтра
	const getSelectedOptionsForFilter = (filterId: string): string[] => {
		const filterData = tempSelectedFilters.find(
			// eslint-disable-next-line id-length
			(f: { id: string }) => f.id === filterId
		)
		return filterData?.optionsIds || []
	}

	if (!isFilterModalOpen) {
		return null
	}

	return (
		<div
			className="
        fixed inset-0 z-50 flex items-center justify-center
        transition-all duration-300 ease-in-out
        opacity-100 pointer-events-auto
      "
			role="dialog"
			aria-labelledby="filter-modal-title"
			aria-modal="true"
		>
			<div
				className="
          absolute inset-0 bg-black
          transition-opacity duration-300
          opacity-50
        "
				onClick={closeFilterModal}
				aria-hidden="true"
			/>

			<section
				className="
          relative z-10 bg-white rounded-2xl shadow-2xl
          w-[1280px] mx-4 max-h-[90vh] overflow-hidden
          transform transition-all duration-300
          scale-100 translate-y-0
        "
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
							{filters?.map((filter: FilterItem) => {
								const selectedOptions = getSelectedOptionsForFilter(filter.id)
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
												className="grid gap-2"
												style={{
													gridTemplateColumns:
														'repeat(auto-fit, minmax(280px, 1fr))'
												}}
											>
												{filter.options.map(
													(option: { id: string; name: string }) => {
														const isSelected = selectedOptions.includes(
															option.id
														)
														return (
															<div
																key={option.id}
																className="flex items-center py-0"
															>
																<div
																	role="checkbox"
																	aria-checked={isSelected}
																	tabIndex={0}
																	className="
                                  flex items-center cursor-pointer
                                  hover:bg-gray-50 transition-colors duration-200
                                  rounded p-1
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
																</div>

																<div className="flex-1">
																	<h3 className="font-inter font-normal text-base text-gray-500 leading-none">
																		{option.name}
																	</h3>
																</div>
															</div>
														)
													}
												)}
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
							disabled={isLoading || !hasTempSelectedFilters()}
						>
							{t('clearAllParameters')}
						</button>
					</div>
				</footer>
			</section>
		</div>
	)
}
