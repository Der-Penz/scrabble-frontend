import React from 'react';
import { FaAngleDoubleRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

type RoomItemProps = {
	roomID: string;
	playerCount: number;
	maxPlayer: number;
	i: number;
	roomJoinUrl: string;
	host: string;
};

export default function RoomItem({
	roomID,
	playerCount,
	maxPlayer,
	i,
	roomJoinUrl,
	host,
}: RoomItemProps) {

    const navigate = useNavigate()

    const joinRoom = () => {
        navigate(`room?id=${roomID}`);
    }

	return (
		<tr onClick={joinRoom} className='group cursor-pointer'>
			<td>{i}</td>
			<td className='group-hover:underline underline-offset-4'>{roomID}</td>
			<td>{host}</td>
			<td>
				{playerCount}/{maxPlayer}
			</td>
			<td>
				<FaAngleDoubleRight size={'1.5rem'} className="group-hover:scale-125 group-hover:animate-pulse transition-transform" />
			</td>
		</tr>
	);
}
