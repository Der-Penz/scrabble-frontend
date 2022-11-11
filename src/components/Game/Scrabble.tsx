import React, { useState } from 'react';
import useAction from '../../hooks/useAction';
import { Bench, Board } from '../../types/GameTypes';
import { Bag, GameInfo } from '../../types/GameTypes';
import { RoomSetting } from '../../types/RoomSetting';
import BagDisplay from './BagDisplay';
import BoardDisplay from './BoardDisplay';
import GameInfoDisplay from './GameInfoDisplay';
import InputDisplay from './InputDisplay';

type ScrabbleProps = {
	settings?: RoomSetting;
};

export default function Scrabble({ settings }: ScrabbleProps) {
	const [board, setBoard] = useState<Board>([[]]);
	const [bag, setBag] = useState<Bag>({ tiles: [] });
	const [bench, setBench] = useState<Bench>({
		tilesOnHand: [],
		owner: '',
		maxTiles: 7,
		points: 0,
	});
	const [gameInfo, setGameInfo] = useState<GameInfo>();
	const [currentPlayer, setCurrentPlayer] = useState('');

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
		setCurrentPlayer(message.message.currentPlayer);
	});

	useAction<{ currentPlayer: string; bench: Bench }>(
		'game:next',
		(message) => {
			console.log('got it');

			setBench(message.message.bench);
		}
	);

	return (
		<section className="flex flex-row gap-2">
			<section className="flex flex-col gap-2 mx-auto">
				<BoardDisplay board={board} />
				<InputDisplay bench={bench} />
			</section>
			<section className="flex flex-col gap-2 ml-auto">
				<GameInfoDisplay gameInfo={gameInfo} settings={settings} />
				<BagDisplay bag={bag} />
			</section>
		</section>
	);
}
