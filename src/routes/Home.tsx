import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateRoom from '../components/Home/CreateRoom';
import JoinRoom from '../components/Home/JoinRoom';
import RoomList from '../components/Room/RoomList';
import { useFetch } from '../hooks/useFetch';
import useModal from '../hooks/useModal';
import { ExitsRoom } from '../types/Room';

export default function Home() {
	const navigate = useNavigate();
	const { showModal } = useModal(null);
	const { error, response, loading, makeRequest } = useFetch<ExitsRoom>();

	useEffect(() => {
		const socketToken = localStorage.getItem('socketToken');
		const roomID = socketToken?.split(':')[0];
		if (roomID) {
			makeRequest(
				`http://localhost:8808/api/v1/room/exists?id=${roomID}`
			);
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
						navigate(`/room?id=${response.idToCheck}`);
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
