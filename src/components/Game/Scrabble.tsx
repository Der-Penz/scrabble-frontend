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
import { useNavigate } from 'react-router-dom';

type ScrabbleProps = {
	settings?: RoomSetting;
};

export default function Scrabble({ settings }: ScrabbleProps) {
	const { showModal, showModalAsync, state: jokerLetter } = useModal('A');
	const navigate = useNavigate();
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

	useAction<{
		players: { [name: string]: number };
		winner?: { name: string; points: number };
		surrendered: boolean;
		surrenderer: string;
	}>('game:end', (message) => {
		showModal({
			title: 'Game over',
			content: (
				<div className="flex items-center flex-col gap-2">
					<span className="font-bold text-2xl">
						Winner: {message.message.winner?.name || '-'}
					</span>
					<div className="stats shadow">
						{Object.keys(message.message.players).map((name, i) => (
							<div className="stat" key={i}>
								<div className="stat-title">{name}</div>
								<div className="divider divider-horizontal"></div>
								<div className="stat-value">
									{message.message.players[name]}
								</div>
							</div>
						))}
					</div>
					{message.message.surrendered && (
						<div className="alert shadow-lg">
							<div>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="stroke-current flex-shrink-0 h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<span className="font-thin">
									{message.message.surrenderer} forfeited the
									game.
								</span>
							</div>
						</div>
					)}
				</div>
			),
			acceptButton: {
				content: 'close',
				onAccept: () => {
					navigate('/');
				},
			},
		});
	});

	const dropTile = async (
		tile: Tile & { x?: number; y?: number },
		where: BoardPosition
	) => {
		if (where.placedTile !== null) {
			return;
		}

		if (tile.char === '0') {
			let res = await showModalAsync({
				title: 'Joker conversion',
				content: (
					<div className="grid place-items-center gap-4">
						<span className="text-lg">
							Enter letter to convert Joker to:
						</span>
						<input
							type="text"
							maxLength={1}
							placeholder="Enter letter here"
							className="input input-bordered input-sm w-full max-w-xs"
							onKeyDown={(e) => {
								let key = e.key.toUpperCase().at(0);
								if (!key?.match(/[A-Z]/)) {
									e.preventDefault();
									e.stopPropagation();
								} else {
									jokerLetter.current = key;
								}
							}}
						/>
					</div>
				),
				acceptButton: {
					content: 'convert',
					onAccept: () => {},
				},
			});

			res = res?.at(0)?.toUpperCase() || 'A';

			if (!res.match(/[A-Z]/)) {
				res = 'A';
			}

			tile.as = res;
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
			<section className="flex flex-col gap-2 mx-auto flex-[2] items-center">
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
			<section className="flex flex-col gap-2 ml-auto flex-1">
				<GameInfoDisplay gameInfo={gameInfo} settings={settings} />
				<BagDisplay bag={bag} />
			</section>
		</section>
	);
}
