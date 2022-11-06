import { useContext, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { JsonValue, SendJsonMessage } from 'react-use-websocket/dist/lib/types';
import Action from '../types/Actions';
import { WSRequest } from '../types/WSRequest';
import { WSResponse } from '../types/WSResponse';
import useWsUrl from './useWsUrl';

const useAction = <T extends unknown>(
	action: Action | Action[],
	cb: (
		message: WSResponse<T>,
		send: SendJsonMessage,
		incomingAction?: Action
	) => void
) => {
	let url = useWsUrl() || '';
	const { lastJsonMessage, sendJsonMessage } = useWebSocket(url, {
		share: true,
	});

	useEffect(() => {
		if (lastJsonMessage === null) return;

		console.log('Message incoming', lastJsonMessage);
		const message = lastJsonMessage as WSResponse<T>;

		if (typeof action === 'string') {
			if (message.action === action) {
				cb(message, sendJsonMessage, message.action);
			}
		} else {
			if (action.some((a) => message.action === a)) {
				cb(message, sendJsonMessage, message.action);
			}
		}
	}, [lastJsonMessage]);

	const sendMessage = <T extends unknown>(message: WSRequest<T>) => {
		sendJsonMessage(message.toJSON() as JsonValue);
	}

	return sendMessage;
};

export default useAction;
