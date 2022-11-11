import React from 'react';
import { GameInfo } from '../../types/GameTypes';
import { RoomSetting } from '../../types/RoomSetting';
import PlayerInfo from './PlayerInfo';

type GameInfoProps = {
	gameInfo?: GameInfo;
	settings?: RoomSetting;
};

export default function GameInfoDisplay({ gameInfo, settings }: GameInfoProps) {
	if (!gameInfo) return <div></div>;

	return (
		<div className="bg-base-300 rounded-lg mx-3 p-3 max-w-max self-center">
			<h1 className="flex gap-2 items-center justify-center text-xl font-bold">
				{settings?.objectiveType && (
					<span>{settings?.objectiveType} •</span>
				)}

				<span>Language: English</span>
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
