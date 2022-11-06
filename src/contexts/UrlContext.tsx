import { createContext, ReactNode, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useWebSocket, { ReadyState } from 'react-use-websocket';

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

		return `ws://localhost:8808/ws/${id}${name ? `?name=${name}` : ''}`;
	}, [searchParams]);

	const { readyState } = useWebSocket(wsURL, {
		share: true,
	});

	useEffect(() => {
		const id = searchParams.get('id');

		if (!id || readyState === ReadyState.CLOSED) {
			navigate('/');
		}
	}, [searchParams, readyState]);

	return <UrlContext.Provider value={wsURL}>{children}</UrlContext.Provider>;
}
