import { JsonValue } from 'react-use-websocket/dist/lib/types';
import { WSRequest } from '../types/WSRequest';
import useWebSocket from 'react-use-websocket';
import useWsUrl from './useWsUrl';

const useMessage = () => {
	let url = useWsUrl() || '';
	const { sendJsonMessage } = useWebSocket(url, {
		share: true,
	});

	const sendMessage = <T extends unknown>(message: WSRequest<T>) => {
		sendJsonMessage(message.toJSON() as JsonValue);
	};

	return sendMessage;
};

export default useMessage;
