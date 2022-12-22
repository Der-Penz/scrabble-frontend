import { createContext, ReactNode, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { WSResponse } from '../types/WSResponse';

interface Props {
	children?: ReactNode;
}

export const UrlContext = createContext<string | undefined>(undefined);

export default function UrlProvider({ children }: Props) {
	const [searchParams, _] = useSearchParams();
	const navigate = useNavigate();

	const wsURL = useMemo(() => {
		const id = searchParams.get('id');
		const name = searchParams.get('name');
		const socketToken = localStorage.getItem('socketToken')?.split(':')[1];

		return `ws://localhost:8808/ws/${id}${name ? `?name=${name}` : ''}${socketToken ? `?token=${socketToken}` : ''}`;
	}, [searchParams]);

	const { readyState, lastJsonMessage } = useWebSocket(wsURL, {
		share: true,
	});

	useEffect(() => {
		const id = searchParams.get('id');

		if (!id || readyState === ReadyState.CLOSED) {
			navigate('/');
		}
	}, [searchParams, readyState]);

	useEffect(() => {
		if (lastJsonMessage === null) return;

		const message = lastJsonMessage as WSResponse<{ socketToken: string }>;

		if (message.action === 'player:self') {
			localStorage.setItem('socketToken', message.message.socketToken);
		}
	}, [lastJsonMessage]);

	return <UrlContext.Provider value={wsURL}>{children}</UrlContext.Provider>;
}
