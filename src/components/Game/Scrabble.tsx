import React, { useState } from 'react';
import useAction from '../../hooks/useAction';
import { Board } from '../../types/GameTypes';
import { Bag, GameInfo } from '../../types/GameTypes';
import { RoomSetting } from '../../types/RoomSetting';
import BagDisplay from './BagDisplay';
import BoardDisplay from './BoardDisplay';
import GameInfoDisplay from './GameInfoDisplay';

export default function Scrabble() {
	const [settings, setSettings] = useState<RoomSetting>();
	const [board, setBoard] = useState<Board>([[]]);
	const [bag, setBag] = useState<Bag>({ tiles: [] });
	const [gameInfo, setGameInfo] = useState<GameInfo>();

	useAction<any>('game:started', (message) => {
		console.log("here");
		
		// console.log(message.message);
		
		// setSettings(message.message as RoomSetting);
	});


	useAction<{
		bag: any;
		board: Board;
		currentPlayer: string;
		players: { [name: string]: number };
	}>('game:state', (message) => {
		setBoard(message.message.board);
		setGameInfo({
			currentPlayer: message.message.currentPlayer,
			timeToPlay: settings?.minutes || -1,
			players: message.message.players,
		});
		setBag(message.message.bag);
	});
	useAction('game:started', () => {
		console.log('hi');
	})

	return (
		<section className="flex flex-row gap-2">
			<section className="flex flex-col gap-2 mx-auto">
				<BoardDisplay board={board} />
			</section>
			<section className="flex flex-col gap-2 ml-auto">
				<GameInfoDisplay gameInfo={gameInfo} />
				<BagDisplay bag={bag} />
			</section>
		</section>
	);
}
