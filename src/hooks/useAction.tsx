import { useEffect } from 'react';
import { JsonValue, SendJsonMessage } from 'react-use-websocket/dist/lib/types';
import Action from '../types/Actions';
import { WSRequest } from '../types/WSRequest';
import { WSResponse } from '../types/WSResponse';
import useWebsocket from './useWebsocket';

type MessageCallback<T> = (
	message: WSResponse<T>,
	send: SendJsonMessage,
	incomingAction: Action
) => void;

const useAction = <T extends unknown>(
	action: Action | Action[],
	...callbacks: MessageCallback<T>[]
) => {
	const { lastJsonMessage, sendJsonMessage } = useWebsocket();

	useEffect(() => {
		if (!lastJsonMessage) return;
		
		const message = lastJsonMessage as WSResponse<T>;
		console.log('✉️Message incoming', message.action, ':', message);

		if (typeof action === 'string') {
			if (message.action === action) {
				callbacks.forEach((callback) =>
					callback(message, sendJsonMessage, message.action)
				);
			}
		} else {
			if (action.some((a) => message.action === a)) {
				callbacks.forEach((callback) =>
					callback(message, sendJsonMessage, message.action)
				);
			}
		}
	}, [lastJsonMessage]);

	const sendMessage = <T extends unknown>(message: WSRequest<T>) => {
		sendJsonMessage(message.toJSON() as JsonValue);
	};

	return sendMessage;
};

export default useAction;
