import { useContext } from 'react';
import { ModalContext } from '../contexts/ModalContext';

const useModal = () => {
	const modalContext = useContext(ModalContext);

	if (modalContext === undefined) {
		throw new Error('useModalContext must be within ModalProvider');
	}

	return modalContext;
};

export default useModal;
