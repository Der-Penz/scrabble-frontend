import React, { useMemo, useState, useCallback, useEffect } from 'react';
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

	useAction<{
		bag: Bag;
		board: Board;
		currentPlayer: string;
		players: { [name: string]: { points: number; timeLeft: number } };
	}>('game:state', (message) => {
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
			setPlacedTiles([]);
		}
	);

	const dropTile = (
		tile: Tile & { x?: number; y?: number },
		where: BoardPosition
	) => {
		if (where.placedTile !== null) {
			return;
		}

		if (tile.char === '0') {
			let input =
				prompt('enter letter to convert Joker to')
					?.at(0)
					?.toUpperCase() || 'A';

			if (!input.match(/[A-Z]/)) {
				input = 'A';
			}

			tile.as = input;
		}

		setPlacedTiles((prev) => {
			if (prev.some((pos) => pos.x === where.x && pos.y === where.y)) {
				return prev;
			}

			if (tile.x && tile.y) {
				const tilePositionToAdd = { ...where };
				tilePositionToAdd.placedTile = {
					char: tile.char,
					points: tile.points,
					as: tile.as,
				};

				return [
					...prev.filter(
						(pos) => !(pos.x === tile.x && pos.y === tile.y)
					),
					tilePositionToAdd,
				];
			}

			const tilePositionToAdd = { ...where };
			tilePositionToAdd.placedTile = tile;

			return [...prev, tilePositionToAdd];
		});
	};

	const takeTilesBack = (tile?: Tile & { x: number; y: number }) => {
		if (tile) {
			setPlacedTiles((prev) => {
				const index = prev.findIndex(
					(pos) =>
						pos.placedTile?.char === tile.char &&
						pos.x === tile.x &&
						pos.y === tile.y
				);

				if (index !== -1) {
					prev.splice(index, 1);
				}

				return [...prev];
			});
		} else {
			setPlacedTiles([]);
		}
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
						placedTiles={placedTiles}
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
