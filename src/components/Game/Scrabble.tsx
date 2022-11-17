import React, { useMemo, useState, useCallback } from 'react';
import useAction from '../../hooks/useAction';
import { Bench, Board, BoardPosition, Tile } from '../../types/GameTypes';
import { Bag, GameInfo } from '../../types/GameTypes';
import { RoomSetting } from '../../types/RoomSetting';
import BagDisplay from './BagDisplay';
import BoardDisplay from './BoardDisplay';
import GameInfoDisplay from './GameInfoDisplay';
import InputDisplay from './InputDisplay';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import useModal from '../../hooks/useModal';

type ScrabbleProps = {
	settings?: RoomSetting;
};

export default function Scrabble({ settings }: ScrabbleProps) {
	const { showModal, state } = useModal<string>('A');
	const [board, setBoard] = useState<Board>([[]]);
	const [bag, setBag] = useState<Bag>({ tiles: [] });
	const [bench, setBench] = useState<Bench>({
		tilesOnHand: [],
		owner: '',
		maxTiles: 7,
		points: 0,
	});
	const [gameInfo, setGameInfo] = useState<GameInfo>();
	const [placedTiles, setPlacedTiles] = useState<BoardPosition[]>([]);

	const tilesOnHand = useMemo<Tile[]>(() => {
		const toFilter = placedTiles.map((pos) => pos.placedTile?.char);
		const allTiles = bench.tilesOnHand;

		const filtered = allTiles.reduce((filtered, tile) => {
			if (toFilter.includes(tile.char)) {
				toFilter.splice(toFilter.indexOf(tile.char), 1);
				return filtered;
			}

			return [...filtered, tile];
		}, [] as Tile[]);

		return filtered;
	}, [bench, placedTiles]);

	useAction<{
		bag: Bag;
		board: Board;
		currentPlayer: string;
		players: { [name: string]: { points: number; timeLeft: number } };
	}>('game:state', (message) => {
		setPlacedTiles([]);
		setBoard(message.message.board);
		setGameInfo({
			currentPlayer: message.message.currentPlayer,
			timeToPlay: settings?.minutes || -1,
			players: message.message.players,
		});
		setBag(message.message.bag);
	});

	useAction<{ currentPlayer: string; bench: Bench }>(
		'game:next',
		(message) => {
			setBench(message.message.bench);
		}
	);

	const dropTile = useCallback(
		(tile: Tile & { x?: number; y?: number }, position: BoardPosition) => {
			if (position.placedTile !== null) {
				return;
			}

			setPlacedTiles((prev) => {
				if (
					prev.some(
						(pos) => pos.x === position.x && pos.y === position.y
					)
				) {
					return prev;
				}

				if (tile.x && tile.y) {
					const newTilePosition = { ...position };
					newTilePosition.placedTile = { ...tile };
					return [
						...prev.filter(
							(pos) => pos.x !== tile.x && pos.y !== tile.y
						),
						newTilePosition,
					];
				}

				const newTilePosition = { ...position };
				newTilePosition.placedTile = { ...tile };

				return [...prev, newTilePosition];
			});

			// if (tile.char === '0') {
			// 	showModal({
			// 		title: 'Activate joker',
			// 		content: (
			// 			<div className="grid place-items-center">
			// 				<span>
			// 					Enter a valid char to redeem your joker in this one
			// 				</span>
			// 				<input
			// 					className="input input-primary"
			// 					type="text"
			// 					placeholder="Enter a char"
			// 					onChange={(e) => {
			// 						if (e.target.value.at(0)?.match(/[A-Z]/)) {
			// 							state.current = e.target.value.at(0)!;
			// 						} else {
			// 							state.current = 'A';
			// 						}
			// 					}}
			// 				/>
			// 			</div>
			// 		),
			// 		acceptButton: {
			// 			content: 'activate',
			// 			onAccept: () => {
			// 				tile.as = state.current;
			// 				const newTilePosition = { ...position };
			// 				newTilePosition.placedTile = { ...tile };
			// 				setPlacedTiles((prev) => [...prev, newTilePosition]);
			// 			},
			// 		},
			// 	});
		},
		[placedTiles, board, state]
	);

	const takeTilesBack = () => {
		setPlacedTiles([]);
	};

	return (
		<section className="flex flex-row gap-2">
			<section className="flex flex-col gap-2 mx-auto">
				<DndProvider backend={HTML5Backend}>
					<BoardDisplay
						board={board}
						placedTiles={placedTiles}
						onDrop={dropTile}
					/>
					<InputDisplay
						placedTiles={placedTiles.map((pos) => pos.placedTile)}
						bench={bench}
						onTurn={gameInfo?.currentPlayer === bench.owner}
						takeTilesBack={takeTilesBack}
					/>
				</DndProvider>
			</section>
			<section className="flex flex-col gap-2 ml-auto">
				<GameInfoDisplay gameInfo={gameInfo} settings={settings} />
				<BagDisplay bag={bag} />
			</section>
		</section>
	);
}
