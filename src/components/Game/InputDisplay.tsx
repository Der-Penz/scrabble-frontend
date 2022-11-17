import { useState } from 'react';
import useMessage from '../../hooks/useMessage';
import { Bench, Tile } from '../../types/GameTypes';
import { WSRequest } from '../../types/WSRequest';
import LetterTile from './LetterTile';
import { FaAngleDoubleDown } from 'react-icons/fa';
import useModal from '../../hooks/useModal';
// @ts-ignore
import classNames from 'clean-react-classnames';
import DraggableLetterTile from './DraggableLetterTile';

type InputDisplayProps = {
	bench: Bench;
	tiles: Tile[];
	takeTilesBack: any;
	onTurn: boolean;
};

export default function InputDisplay({
	bench,
	onTurn,
	tiles,
	takeTilesBack,
}: InputDisplayProps) {
	const message = useMessage();
	const { showModal, state: selectedTradeTiles } = useModal<Set<number>>(
		new Set()
	);
	const [selected, setSelected] = useState<number>();

	const TradeElement = (
		<div className="flex flex-col gap-2 items-center">
			<span className="block">select the tiles you wanna trade</span>
			<div className="flex gap-2">
				{tiles.map((tile, i) => (
					<div key={i} className="flex flex-col gap-2 items-center">
						<LetterTile
							tile={tile}
							displayPoints={true}
							tooltip={false}
							onClick={(e: React.MouseEvent<HTMLDivElement>) => {
								if (selectedTradeTiles.current.has(i)) {
									selectedTradeTiles.current.delete(i);
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
									selectedTradeTiles.current.delete(i);
								}
							}}
						/>
					</div>
				))}
			</div>
		</div>
	);

	const trade = () => {
		showModal({
			title: 'Trading',
			content: TradeElement,
			acceptButton: {
				content: 'trade',
				onAccept: () => {
					const toTrade = [
						...selectedTradeTiles.current.values(),
					].map((i) => bench.tilesOnHand[i].char);

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

	const place = () => {
		message(new WSRequest('game:move:place', {}));
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

	const selectTile = (index: number) => {
		setSelected(selected === index ? -1 : index);
	};

	return (
		<div>
			<section className="bg-base-300 rounded-lg my-2 flex flex-row justify-center gap-2 p-2">
				<button
					onClick={takeTilesBack}
					className={classNames(
						{
							'btn-disabled':
								bench.tilesOnHand.length === tiles.length,
						},
						'btn btn-info'
					)}
				>
					<FaAngleDoubleDown size={'1.3rem'} />
				</button>
				{tiles.map((tilesman, i) => (
					<DraggableLetterTile
						key={i}
						draggable={true}
						tile={tilesman}
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
					onClick={place}
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
