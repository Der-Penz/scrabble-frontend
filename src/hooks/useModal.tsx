import { useContext, useRef } from 'react';
import { Modal, ModalContext } from '../contexts/ModalContext';

const useModal = <T extends unknown>(defaultState: T) => {
	const modalContext = useContext(ModalContext);
	const state = useRef<T>(defaultState);

	if (modalContext === undefined) {
		throw new Error('useModal must be within ModalProvider');
	}

	const showModal = (modal: Modal) => {
		modalContext(modal);
	};

	return { showModal, state };
};

export default useModal;
