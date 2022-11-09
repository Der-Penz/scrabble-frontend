import React from 'react';
import { GameInfo } from '../../types/GameTypes';
import PlayerInfo from './PlayerInfo';

type GameInfoProps = {
	gameInfo?: GameInfo;
};

export default function GameInfoDisplay({ gameInfo }: GameInfoProps) {
	if (!gameInfo) return <div></div>;

	return (
		<div className="bg-base-300 rounded-lg mx-3 p-3 max-w-max self-center">
			<h1 className="flex gap-2 items-center justify-center">
				<span className="text-2xl font-bold uppercase">stats •</span>
				<span className="text-lg font-bold">Language: English</span>
			</h1>
			<div className="stats mx-auto flex flex-row flex-wrap max-w-max">
				{Object.keys(gameInfo.players).map((name, i) => (
					<PlayerInfo
					key={i}
						name={name}
						points={gameInfo.players[name]}
						onTurn={gameInfo.currentPlayer === name}
						timeLeft={gameInfo.timeToPlay || -1}
					/>
				))}
			</div>
		</div>
	);
}
