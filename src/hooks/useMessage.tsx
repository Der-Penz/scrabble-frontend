import { JsonValue } from 'react-use-websocket/dist/lib/types';
import { WSRequest } from '../types/WSRequest';
import useWebsocket from './useWebsocket';

const useMessage = () => {
	const { sendJsonMessage } = useWebsocket();

	const sendMessage = <T extends unknown>(message: WSRequest<T>) => {
		sendJsonMessage(message.toJSON() as JsonValue);
	};

	return sendMessage;
};

export default useMessage;
