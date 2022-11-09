import CreateRoom from '../components/Home/CreateRoom';
import JoinRoom from '../components/Home/JoinRoom';
import RoomList from '../components/Room/RoomList';




export default function Home() {


	return (
		<div>
			<h1>Number 1 letter game in the world</h1>

			<section className="h-[80vh] flex flex-col gap-2 justify-center items-center">
				<JoinRoom />
				<CreateRoom />
				<RoomList/>
			</section>
		</div>
	);
}
