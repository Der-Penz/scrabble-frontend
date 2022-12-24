import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateRoom from '../components/Home/CreateRoom';
import JoinRoom from '../components/Home/JoinRoom';
import RoomList from '../components/Home/RoomList';
import { useFetch } from '../hooks/useFetch';
import useModal from '../hooks/useModal';
import { ExitsRoom } from '../types/Room';
import { toSearchParamString } from '../util/Helpers';

export default function Home() {
	const navigate = useNavigate();
	const { showModal } = useModal(null);
	const { error, response, loading, makeRequest } = useFetch<ExitsRoom>();

	useEffect(() => {
		const socketToken = localStorage.getItem('socketToken');
		const roomID = socketToken?.split(':')[0];

		const params = toSearchParamString({
			id: roomID,
		});
		if (roomID) {
			makeRequest(`/room/exists` + params);
		}
	}, []);

	useEffect(() => {
		if (!response) {
			return;
		}

		if (response?.exists) {
			showModal({
				title: 'Reconnect to previous game?',
				content:
					'There is a running game you left. You are still able to reconnect',
				acceptButton: {
					content: 'Reconnect',
					onAccept: () => {
						const params = toSearchParamString({
							id: response.idToCheck,
						});
						navigate(`/room` + params);
					},
				},
				deniedButton: {
					content: 'Discard',
					onDenied: () => {},
				},
			});
		} else {
			localStorage.removeItem('socketToken');
		}
	}, [response]);

	return (
		<div>
			<h1>Number 1 letter game in the world</h1>

			<section className="h-[80vh] flex flex-col gap-2 justify-center items-center">
				<JoinRoom />
				<CreateRoom />
				<RoomList />
			</section>
		</div>
	);
}
