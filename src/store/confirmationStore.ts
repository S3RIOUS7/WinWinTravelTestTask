import { create } from 'zustand'

interface ConfirmationState {
	isConfirmationOpen: boolean
	pendingAction: (() => void) | null
	cancelAction: (() => void) | null

	openConfirmation: (onConfirm: () => void, onCancel?: () => void) => void
	closeConfirmation: () => void
	confirm: () => void
	cancel: () => void
}

export const useConfirmationStore = create<ConfirmationState>((set, get) => ({
	isConfirmationOpen: false,
	pendingAction: null,
	cancelAction: null,

	openConfirmation: (onConfirm, onCancel) => {
		set({
			isConfirmationOpen: true,
			pendingAction: onConfirm,
			cancelAction: onCancel || null
		})
	},

	closeConfirmation: () => {
		set({
			isConfirmationOpen: false,
			pendingAction: null,
			cancelAction: null
		})
	},

	confirm: () => {
		const { pendingAction, closeConfirmation } = get()
		if (pendingAction) {
			pendingAction()
		}
		closeConfirmation()
	},

	cancel: () => {
		const { cancelAction, closeConfirmation } = get()
		if (cancelAction) {
			cancelAction()
		}
		closeConfirmation()
	}
}))
