import CreateRoom from '../components/Home/CreateRoom';
import JoinRoom from '../components/Home/JoinRoom';
import { useFetch } from '../hooks/useFetch';

type OpenRoom = {
	playerCount: number;
	gameState: string;
	host: string;
	roomID: string;
	roomJoinUrl?: string;
};

export default function Home() {
	const { error, response, loading, makeRequest } = useFetch<OpenRoom[]>(
		'http://localhost:8808/api/v1/room/opened'
	);

	return (
		<div>
			<h1>Number 1 letter game in the world</h1>

			<section className="h-[80vh] flex flex-col gap-2 justify-center items-center">
				<JoinRoom />
				<CreateRoom />
				{response?.map((room) => (
					<div className="form-control">
					<label className="input-group">
					  <span>{room.playerCount}/4</span>
					  <span className="input input-disabled">{room.roomID}</span>
					  <button className='btn btn-square'>JOIN</button>
					</label>
				  </div>
				))}
			</section>
		</div>
	);
}
