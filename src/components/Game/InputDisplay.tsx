import { useState, useMemo, useEffect, useCallback } from 'react';
import useMessage from '../../hooks/useMessage';
import { Bench, BoardPosition, Tile } from '../../types/GameTypes';
import { WSRequest } from '../../types/WSRequest';
import LetterTile from './LetterTile';
import { FaAngleDoubleDown } from 'react-icons/fa';
import useModal from '../../hooks/useModal';
import classNames from 'clean-react-classnames';
import DraggableLetterTile from './DraggableLetterTile';
import { useDrop } from 'react-dnd';

type InputDisplayProps = {
	bench: Bench;
	placedTiles: BoardPosition[];
	takeTilesBack: (tile?: Tile & { x: number; y: number }) => void;
	onTurn: boolean;
};

export default function InputDisplay({
	bench,
	onTurn,
	placedTiles,
	takeTilesBack,
}: InputDisplayProps) {
	const message = useMessage();
	const { showModal, state: selectedTradeTiles } = useModal<Set<number>>(
		new Set()
	);

	const [{ isOver }, drop] = useDrop(() => ({
		accept: 'tile',
		drop: (item: Tile & { x: number; y: number }) => {
			console.log(item);
			if (!item.x) {
				return;
			}
			takeTilesBack(item);
		},
		collect: (monitor) => ({
			isOver:
				!!monitor.isOver() &&
				(monitor.getItem() as Tile & { x: number; y: number }).x,
		}),
	}));

	const tilesOnHand = useMemo<Tile[]>(() => {
		const toFilter = placedTiles.map((pos) => pos.placedTile?.char || '-');
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

	useEffect(() => {
		place(true);
	}, [placedTiles]);

	const trade = () => {
		showModal({
			title: 'Trading',
			content: (
				<div className="flex flex-col gap-2 items-center">
					<span className="block">
						select the tiles you wanna trade
					</span>
					<div className="flex gap-2">
						{bench.tilesOnHand.map((tile, i) => (
							<div
								key={i}
								className="flex flex-col gap-2 items-center"
							>
								<LetterTile
									tile={tile}
									displayPoints={true}
									tooltip={false}
									onClick={(
										e: React.MouseEvent<HTMLDivElement>
									) => {
										if (selectedTradeTiles.current.has(i)) {
											selectedTradeTiles.current.delete(
												i
											);
										} else {
											selectedTradeTiles.current.add(i);
										}
									}}
									className={'hover:border-info kbd-xs'}
								/>
								<input
									type="checkbox"
									className="checkbox"
									onChange={(
										e: React.ChangeEvent<HTMLInputElement>
									) => {
										if (e.target.checked) {
											selectedTradeTiles.current.add(i);
										} else {
											console.log('deleting', i);

											selectedTradeTiles.current.delete(
												i
											);
										}
									}}
								/>
							</div>
						))}
					</div>
				</div>
			),
			acceptButton: {
				content: 'trade',
				onAccept: () => {
					const toTrade = [
						...selectedTradeTiles.current.values(),
					].map((i) => bench.tilesOnHand[i].char);
					selectedTradeTiles.current.clear();
					message(new WSRequest('game:move:trade', toTrade));
				},
			},
			deniedButton: {
				content: 'discard',
				onDenied: () => {},
			},
		});
	};

	const skip = () => {
		showModal({
			title: 'Skip turn?',
			content:
				'you wont get any new tile or points after skipping your turn',
			acceptButton: {
				content: 'skip',
				onAccept: () => {
					message(new WSRequest('game:move:skip', {}));
				},
			},
			deniedButton: {
				content: 'discard',
				onDenied: () => {},
			},
		});
	};

	const place = (ghostPlace: boolean) => {
		if (placedTiles.length === 0) {
			return;
		}

		message(
			new WSRequest(
				ghostPlace ? 'game:move:ghost' : 'game:move:place',
				placedTiles.map((pos) => ({
					x: pos.x,
					y: pos.y,
					char: pos.placedTile?.as || pos.placedTile?.char,
					asJoker: !!pos.placedTile?.as,
				}))
			)
		);
	};

	const forfeit = () => {
		showModal({
			title: 'You really want to forfeit?',
			content:
				'you will lose the game immediately even if you are currently winning',
			acceptButton: {
				content: 'forfeit',
				onAccept: () => {
					message(new WSRequest('game:move:forfeit', {}));
				},
			},
			deniedButton: {
				content: 'discard',
				onDenied: () => {},
			},
		});
	};

	return (
		<div className="min-w-min w-1/2 max-w-xl">
			<section
				ref={drop}
				className={classNames(
					{ 'scale-95': isOver },
					'bg-base-300 transition-transform rounded-lg my-2 flex flex-row justify-center gap-2 p-2'
				)}
			>
				<button
					onClick={() => takeTilesBack()}
					className={classNames(
						{
							'btn-disabled':
								bench.tilesOnHand.length === tilesOnHand.length,
						},
						'btn btn-info mr-auto'
					)}
				>
					<FaAngleDoubleDown size={'1.3rem'} />
				</button>
				{tilesOnHand.map((tile, i) => (
					<DraggableLetterTile
						key={i}
						draggable={true}
						tile={tile}
						displayPoints={true}
						tooltip={false}
						className={'hover:border-info'}
					/>
				))}
			</section>
			<section className="btn-group flex gap-2">
				<button
					onClick={forfeit}
					className={classNames('btn btn-outline btn-error flex-1')}
				>
					Forfeit
				</button>
				<button
					onClick={skip}
					className={classNames('btn btn-outline btn-info flex-1', {
						'btn-disabled opacity-50': !onTurn,
					})}
				>
					Skip
				</button>
				<button
					onClick={trade}
					className={classNames('btn btn-outline btn-info flex-1', {
						'btn-disabled opacity-50': !onTurn,
					})}
				>
					Trade
				</button>
				<button
					onClick={() => place(false)}
					className={classNames(
						'btn btn-outline btn-success flex-1',
						{
							'btn-disabled opacity-50': !onTurn,
						}
					)}
				>
					Place
				</button>
			</section>
		</div>
	);
}
