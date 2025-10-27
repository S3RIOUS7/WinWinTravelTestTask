import React from 'react'
import { useTranslation } from 'react-i18next'

import { useConfirmationStore } from '../store/confirmationStore'

export const ConfirmationDialog: React.FC = () => {
	const { t } = useTranslation()
	const {
		isConfirmationOpen,
		confirm,
		cancel,
		closeConfirmation,
		pendingAction
	} = useConfirmationStore()

	const dialogId = 'confirmation-dialog'
	const titleId = `${dialogId}-title`

	if (!isConfirmationOpen || !pendingAction) {
		return null
	}

	return (
		<div
			className="
        fixed inset-0 z-[60] flex items-center justify-center
        transition-all duration-300 ease-in-out
        opacity-100 pointer-events-auto
      "
			role="dialog"
			aria-labelledby={titleId}
			aria-modal="true"
		>
			<div
				className="
          absolute inset-0 bg-black
          transition-opacity duration-300
          opacity-50
        "
				onClick={closeConfirmation}
				aria-hidden="true"
			/>

			<article
				className="
          relative z-10 bg-white
          w-[1280px] rounded-[16px] p-[32px]
          shadow-2xl mx-4
          transform transition-all duration-300
          scale-100 translate-y-0
        "
				style={{ opacity: 1 }}
				onClick={e => e.stopPropagation()}
			>
				<button
					className="
            absolute right-[32px] top-[32px]
            w-8 h-8 rounded-full
            flex items-center justify-center
            text-gray-500 hover:text-gray-600
            hover:bg-gray-100
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-gray-400
            active:outline-none active:ring-0
            z-20
          "
					onClick={closeConfirmation}
					aria-label={t('closeDialog', 'Close dialog')}
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

				<div className="flex flex-col gap-[120px]">
					<header className="text-center relative">
						<h1
							id={titleId}
							className="font-inter font-medium text-[40px] text-gray-500 leading-none tracking-normal"
							style={{
								fontFamily: 'Inter',
								fontWeight: 500,
								fontStyle: 'normal',
								lineHeight: '100%',
								letterSpacing: '0%'
							}}
						>
							{t('confirmationTitle', 'Do you want to apply new filter')}
						</h1>
					</header>

					<main className="flex justify-center gap-[12px]">
						<button
							className="
                w-[280px] h-[64px] rounded-[16px]
                font-inter font-medium text-base
                text-gray-700 hover:text-gray-800
                bg-white border-2 border-[rgba(180,180,180,1)]
                hover:bg-gray-50 active:bg-gray-100
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-gray-400
                active:outline-none active:ring-0
                flex items-center justify-center
              "
							style={{
								opacity: 1,
								padding: '26px 49px'
							}}
							onClick={cancel}
							aria-describedby={titleId}
						>
							{t('confirmation.cancel', 'Use old filter')}
						</button>

						<button
							className="
                w-[280px] h-[64px] rounded-[16px]
                bg-[rgba(255,95,0,1)] text-white
                hover:bg-[rgba(255,95,0,0.9)] active:bg-[rgba(255,95,0,0.8)]
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-[rgba(255,95,0,0.5)]
                active:outline-none active:ring-0
                font-inter font-medium
                flex items-center justify-center
              "
							style={{
								opacity: 1,
								padding: '26px 49px'
							}}
							onClick={confirm}
							aria-describedby={titleId}
						>
							{t('confirmation.confirm', 'Apply new filter')}
						</button>
					</main>
				</div>
			</article>
		</div>
	)
}
