import { useContext, useRef } from 'react';
import { Modal, ModalContext } from '../contexts/ModalContext';

const useModal = <T extends unknown>(defaultState: T) => {
	const modalContext = useContext(ModalContext);
	const state = useRef<T>(defaultState);

	if (modalContext === undefined) {
		throw new Error('useModal must be within ModalProvider');
	}

	const showModal = (modal: Modal) => {
		state.current = defaultState;
		modalContext(modal);
	};

	const showModalAsync = (modal: Modal) => {
		return new Promise<T>((res, rej) => {
			showModal({
				...modal,
				acceptButton: {
					content: modal.acceptButton.content,
					onAccept: () => {
						res(state.current);
						modal.acceptButton.onAccept();
					},
				},
				...(modal.deniedButton && {
					deniedButton: {
						content: modal.deniedButton?.content!,
						onDenied: () => {
							rej();
							modal.deniedButton?.onDenied();
						},
					},
				}),
			});
		});
	};

	return { showModal, showModalAsync, state };
};

export default useModal;
