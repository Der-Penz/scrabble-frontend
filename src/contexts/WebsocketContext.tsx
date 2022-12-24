import { createContext, ReactNode, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { JsonValue, SendJsonMessage } from 'react-use-websocket/dist/lib/types';
import { WSResponse } from '../types/WSResponse';
import { toSearchParamString } from '../util/Helpers';

interface Props {
	children?: ReactNode;
}

interface WebsocketContextType {
	lastJsonMessage: JsonValue | null;
	sendJsonMessage: SendJsonMessage;
}

export const WebsocketContext = createContext<WebsocketContextType>({
	lastJsonMessage: null,
	sendJsonMessage: () => {},
});

export default function WebsocketProvider({ children }: Props) {
	const [searchParams, _] = useSearchParams();
	const navigate = useNavigate();

	const wsURL = useMemo(() => {
		const id = searchParams.get('id');
		const name = searchParams.get('name');
		const socketToken = localStorage.getItem('socketToken')?.split(':')[1];

		const url: string = `${import.meta.env.VITE_WS}/${id}`;
		const params = toSearchParamString({
			name,
			socketToken,
		});

		return url + params;
	}, [searchParams]);

	const { readyState, lastJsonMessage, sendJsonMessage } = useWebSocket(
		wsURL,
		{
			share: true,
		}
	);

	useEffect(() => {
		const id = searchParams.get('id');

		if (!id || readyState === ReadyState.CLOSED) {
			navigate('/');
		}
	}, [searchParams, readyState]);

	useEffect(() => {
		if (!lastJsonMessage) return;

		const message = lastJsonMessage as WSResponse<{ socketToken: string }>;

		if (message.action === 'player:self') {
			localStorage.setItem('socketToken', message.message.socketToken);
		}
	}, [lastJsonMessage]);

	return (
		<WebsocketContext.Provider
			value={{ lastJsonMessage: lastJsonMessage, sendJsonMessage }}
		>
			{children}
		</WebsocketContext.Provider>
	);
}
