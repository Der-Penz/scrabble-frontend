import { MdOutlineRefresh } from 'react-icons/md';
import { useFetch } from '../../hooks/useFetch';
import { OpenRoom } from '../../types/Room';
import RoomItem from './RoomItem';


export default function RoomList() {
	const { error, response, loading, makeRequest } = useFetch<OpenRoom[]>(
		'http://localhost:8808/api/v1/room/opened'
	);

	return (
		<div className="rounded-md border border-base-300 relative m-4">
			<button
				onClick={() => makeRequest()}
				className="bg-neutral absolute w-8 p-1 rounded-lg grid place-items-center aspect-square -top-3 -right-3 z-10 group hover:scale-110 transition-transform"
			>
				<MdOutlineRefresh className="w-full h-full group-hover:animate-spin" />
			</button>
			<div className="">
				<table className="table overflow-auto h-10 max-h-14">
					<thead>
						<tr>
							<th>Nr</th>
							<th>Room Name</th>
							<th>Host</th>
							<th>Players</th>
							<th>Join</th>
						</tr>
					</thead>
					<tbody>
						{response?.map((room, i) => (
							<RoomItem
								key={i}
								i={i}
								maxPlayer={4}
								playerCount={room.playerCount}
								roomID={room.roomID}
								roomJoinUrl={room.roomJoinUrl}
								host={room.host}
							/>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
