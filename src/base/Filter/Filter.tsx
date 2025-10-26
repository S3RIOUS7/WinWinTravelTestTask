import { useTranslation } from 'react-i18next'

import { useFilters } from '@/hooks/useFilter'

interface FilterProps {
	active: boolean
	setActive: (active: boolean) => void
	filterId: string
	selectedOptions: string[]
	onOptionToggle: (optionId: string) => void
}

const Filter = ({
	active,
	setActive,
	filterId,
	selectedOptions,
	onOptionToggle
}: FilterProps) => {
	const { t } = useTranslation('filter')
	const { data: filters, isLoading, error } = useFilters()

	const filter = filters?.find(filterItem => filterItem.id === filterId)

	const handleOptionClick = (optionId: string) => {
		onOptionToggle(optionId)
	}

	const handleClearAll = () => {
		filter?.options.forEach(option => {
			if (selectedOptions.includes(option.id)) {
				onOptionToggle(option.id)
			}
		})
	}

	const modalId = `filter-modal-${filterId}`
	const titleId = `${modalId}-title`

	if (error) {
		return (
			<section
				className="p-4 text-red-500"
				role="alert"
				aria-live="polite"
			>
				{t('errorLoadingFilter', { message: (error as Error).message })}
			</section>
		)
	}

	return (
		<div
			className={`
				fixed inset-0 z-50 flex items-center justify-center
				transition-all duration-300 ease-in-out
				${active ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
			`}
			role="dialog"
			aria-labelledby={titleId}
			aria-modal="true"
		>
			<div
				className={`
					absolute inset-0 bg-black
					transition-opacity duration-300
					${active ? 'opacity-50' : 'opacity-0'}
				`}
				onClick={() => setActive(false)}
				aria-hidden="true"
			/>

			<section
				className={`
					relative z-10 bg-white rounded-2xl shadow-2xl
					w-[1280px] mx-4 max-h-[80vh] overflow-hidden
					transform transition-all duration-300
					${active ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
				`}
				role="document"
				aria-labelledby={titleId}
				onClick={e => e.stopPropagation()}
			>
				<header className="flex items-center justify-between p-6 border-b border-gray-200">
					<div>
						<h1
							id={titleId}
							className="font-inter font-medium text-2xl text-gray-500 leading-none"
						>
							{isLoading ? t('loading') : filter?.name}
						</h1>
					</div>

					<button
						className="
							w-12 h-12 rounded-full
							flex items-center justify-center
							text-gray-500 hover:text-gray-600
							hover:bg-gray-100
							transition-colors duration-200
							outline-none
							border-none
							ring-0
							focus:outline-none focus:ring-0
							active:outline-none active:ring-0 active:border-none
							select-none
						"
						onClick={() => setActive(false)}
						aria-label={t('closeFilter')}
						onMouseDown={e => e.preventDefault()}
					>
						<svg
							className="w-6 h-6"
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
				</header>

				<main className="overflow-y-auto max-h-96">
					{isLoading ? (
						<div
							className="flex justify-center items-center py-12"
							role="status"
							aria-live="polite"
						>
							<div
								className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgba(255,95,0,1)]"
								aria-hidden="true"
							></div>
							<span className="sr-only">{t('loading')}</span>
						</div>
					) : (
						<fieldset>
							<legend className="sr-only">
								{t('filterOptions', { filterName: filter?.name })}
							</legend>
							{filter?.options.map(option => {
								const isSelected = selectedOptions.includes(option.id)
								return (
									<div
										key={option.id}
										role="checkbox"
										aria-checked={isSelected}
										tabIndex={0}
										className={`
											flex items-center cursor-pointer py-3 px-6
											hover:bg-gray-50 transition-colors duration-200
											${isSelected ? 'bg-[rgba(255,95,0,0.1)]' : ''}
										`}
										onClick={() => handleOptionClick(option.id)}
										onKeyDown={e => {
											if (e.key === 'Enter' || e.key === ' ') {
												e.preventDefault()
												handleOptionClick(option.id)
											}
										}}
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
											<h2 className="font-inter font-normal text-base text-gray-500 leading-none">
												{option.name}
											</h2>
										</div>
									</div>
								)
							})}
						</fieldset>
					)}
				</main>

				<footer className="flex justify-between items-center p-6 border-t border-gray-200">
					<button
						className="
							font-inter font-medium text-base underline
							text-gray-700 hover:text-gray-800
							transition-colors duration-200
							outline-none
							border-none
							ring-0
							focus:outline-none focus:ring-0
							active:outline-none active:ring-0 active:border-none
							bg-transparent
							px-0 py-0
							disabled:opacity-50 disabled:cursor-not-allowed
							select-none
						"
						onClick={handleClearAll}
						disabled={isLoading || selectedOptions.length === 0}
						onMouseDown={e => e.preventDefault()}
					>
						{t('clearAll')}
					</button>
					<button
						className="
							w-[184px] h-[64px]
							bg-[rgba(255,95,0,1)] text-white rounded-[16px]
							hover:bg-[rgba(255,95,0,0.9)] active:bg-[rgba(255,95,0,0.8)]
							transition-colors duration-200
							outline-none
							border-none
							ring-0
							focus:outline-none focus:ring-0
							active:outline-none active:ring-0 active:border-none
							font-medium
							flex items-center justify-center
							disabled:opacity-50 disabled:cursor-not-allowed
							select-none
						"
						onClick={() => setActive(false)}
						disabled={isLoading}
						onMouseDown={e => e.preventDefault()}
					>
						{t('applyButton')}
					</button>
				</footer>
			</section>
		</div>
	)
}

export default Filter
