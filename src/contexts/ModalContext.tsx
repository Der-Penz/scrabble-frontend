import React, { createContext, ReactNode, useId, useState } from 'react';

type Props = {
	children?: ReactNode;
};

type Modal = {
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

type ModalContext = (modal: Modal) => void;

export const ModalContext = createContext<ModalContext | undefined>(undefined);

export default function ModalProvider({ children }: Props) {
	const modalId = useId();

	const [show, setShow] = useState(false);
	const [modal, setModal] = useState<Modal>({
		title: 'Default',
		content: 'you should not see this',
		acceptButton: {
			onAccept: () => {},
			content: 'OK',
		},
	});

	const onAccept = () => {
		modal?.acceptButton.onAccept();
		hideModal();
	};

	const onDenied = () => {
		modal?.deniedButton?.onDenied();
		hideModal();
	};

	const hideModal = () => {
		setShow(false);
	};

	const showModal = (modal: Modal) => {
		setModal(modal);
		setShow(true);
	};
	return (
		<ModalContext.Provider value={showModal}>
			<input
				type="checkbox"
				id={modalId}
				className="modal-toggle"
				checked={show}
			/>
			<div className="modal modal-bottom sm:modal-middle">
				<div className="modal-box">
					{modal?.title && (
						<h3 className="font-bold text-lg">{modal?.title}</h3>
					)}
					<p className="py-4">{modal?.content}</p>
					<div className="modal-action">
						<label
							htmlFor={modalId}
							onClick={onAccept}
							className="btn btn-success"
						>
							{modal?.acceptButton.content}
						</label>
						{modal?.deniedButton && (
							<label
								htmlFor={modalId}
								onClick={onDenied}
								className="btn btn-error"
							>
								{modal.deniedButton.content}
							</label>
						)}
					</div>
				</div>
			</div>

			{children}
		</ModalContext.Provider>
	);
}
