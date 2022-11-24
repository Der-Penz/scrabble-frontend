import React, {
	createContext,
	ReactNode,
	RefObject,
	useId,
	useRef,
	useState,
} from 'react';

type Props = {
	children?: ReactNode;
};

export type Modal = {
	title?: string;
	content: JSX.Element | string;
	acceptButton: {
		content: JSX.Element | string;
		onAccept: () => void;
	};
	deniedButton?: {
		content: JSX.Element | string;
		onDenied: () => void;
	};
};

const defaultModal = {
	title: 'Default modal state',
	content: 'you should not see this, if you do see it just press "OK"',
	acceptButton: {
		onAccept: () => {},
		content: 'OK',
	},
};

type ModalContext = (modal: Modal) => void;

export const ModalContext = createContext<ModalContext | undefined>(undefined);

export default function ModalProvider({ children }: Props) {
	const modalId = useId();

	const showRef = useRef(false);
	const modalRef = useRef() as React.MutableRefObject<HTMLDivElement>;
	const [modal, setModal] = useState<Modal>(defaultModal);

	const onAccept = () => {
		modal?.acceptButton.onAccept();
		hideModal();
	};

	const onDenied = () => {
		modal?.deniedButton?.onDenied();
		hideModal();
	};

	const hideModal = () => {
		modalRef.current.classList.add('!opacity-0');

		modalRef.current.addEventListener('transitionend', () => {
			if (!modalRef.current.classList.contains('!opacity-0')) {
				return;
			}
			showRef.current = false;
			modalRef.current.classList.remove('!opacity-0');
			setModal(defaultModal);
		});
	};

	const showModal = (modal: Modal) => {
		setModal(modal);
		modalRef.current.classList.remove('!opacity-0');
		showRef.current = true;
	};
	return (
		<ModalContext.Provider value={showModal}>
			<input
				type="checkbox"
				id={modalId}
				className="modal-toggle"
				checked={showRef.current}
				onChange={() => {}}
			/>
			<div className="modal modal-bottom sm:modal-middle" ref={modalRef}>
				<div className="modal-box">
					{modal?.title && (
						<h3 className="font-bold text-lg">{modal?.title}</h3>
					)}
					<div className="py-4">{modal?.content}</div>
					<div className="modal-action">
						{modal?.deniedButton && (
							<label
								htmlFor={modalId}
								onClick={onDenied}
								className="btn btn-error"
							>
								{modal.deniedButton.content}
							</label>
						)}
						<label
							htmlFor={modalId}
							onClick={onAccept}
							className="btn btn-success"
						>
							{modal?.acceptButton.content}
						</label>
					</div>
				</div>
			</div>

			{children}
		</ModalContext.Provider>
	);
}
